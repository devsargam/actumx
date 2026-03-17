import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";

import { db } from "../../db/client";
import { authDb } from "../../db/auth-client";
import { user } from "../../db/auth-schema";
import { apiKeys, creditLedger } from "../../db/schema";
import { hashSecret, newApiKey, newId } from "../../lib/crypto";
import { TimeService } from "../../services/time.service";

// In-memory OTP store: email -> { otp, expiresAt }
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SIGNUP_BONUS_CENTS = 100; // $1.00 free credits for new users

export abstract class OnboardService {
  static async requestOtp(email: string) {
    if (!email || !email.includes("@")) {
      return { statusCode: 400, body: { error: "invalid_email", message: "A valid email is required." } };
    }

    const otp = randomBytes(3).toString("hex").slice(0, 6).toUpperCase();
    otpStore.set(email, { otp, expiresAt: Date.now() + OTP_TTL_MS });

    // Mock: log OTP to terminal instead of sending email
    console.log(`\n========================================`);
    console.log(`  OTP for ${email}: ${otp}`);
    console.log(`  Expires in 5 minutes`);
    console.log(`========================================\n`);

    return {
      statusCode: 200,
      body: { success: true, message: "OTP sent to your email." },
    };
  }

  static async verifyOtp(email: string, otp: string) {
    if (!email || !otp) {
      return { statusCode: 400, body: { error: "missing_fields", message: "Email and OTP are required." } };
    }

    const stored = otpStore.get(email);
    if (!stored) {
      return { statusCode: 400, body: { error: "no_otp", message: "No OTP found. Request a new one." } };
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return { statusCode: 400, body: { error: "otp_expired", message: "OTP has expired. Request a new one." } };
    }

    if (stored.otp !== otp.toUpperCase()) {
      return { statusCode: 400, body: { error: "invalid_otp", message: "Invalid OTP." } };
    }

    // OTP is valid — clean up
    otpStore.delete(email);

    // Find or create user
    let existingUser = await authDb
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((rows) => rows[0] ?? null);

    const isNewUser = !existingUser;

    if (!existingUser) {
      const now = new Date();
      const userId = newId("usr");
      await authDb.insert(user).values({
        id: userId,
        name: email.split("@")[0],
        email,
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      });
      existingUser = { id: userId, name: email.split("@")[0], email, emailVerified: true, image: null, createdAt: now, updatedAt: now };
    }

    // Give signup bonus to new users
    if (isNewUser && SIGNUP_BONUS_CENTS > 0) {
      await db.insert(creditLedger).values({
        id: newId("ledger"),
        userId: existingUser.id,
        direction: "credit",
        amountCents: SIGNUP_BONUS_CENTS,
        source: "signup_bonus",
        referenceId: null,
        createdAt: TimeService.nowIso(),
      });
    }

    // Generate API key
    const rawKey = newApiKey();
    const keyPrefix = rawKey.slice(0, 14);
    const keyId = newId("key");

    await db.insert(apiKeys).values({
      id: keyId,
      userId: existingUser.id,
      name: "Agent Key (onboard)",
      keyPrefix,
      keyHash: hashSecret(rawKey),
      revokedAt: null,
      lastUsedAt: null,
      createdAt: TimeService.nowIso(),
    });

    return {
      statusCode: 200,
      body: {
        apiKey: rawKey,
        keyPrefix,
        userId: existingUser.id,
        isNewUser,
        message: isNewUser
          ? `Welcome! Your account has been created with $${(SIGNUP_BONUS_CENTS / 100).toFixed(2)} free credits.`
          : "Logged in successfully. New API key generated.",
      },
    };
  }
}
