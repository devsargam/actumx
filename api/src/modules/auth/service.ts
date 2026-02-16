import { eq } from "drizzle-orm";

import { db } from "../../db/client";
import { sessions, users } from "../../db/schema";
import { hashSecret, newId, newSessionToken } from "../../lib/crypto";
import { AuthContextService } from "../../services/auth-context.service";
import { TimeService } from "../../services/time.service";
import { SESSION_TTL_DAYS } from "../../config/constants";
import type { AuthModel } from "./model";

export abstract class AuthService {
  static async register(payload: AuthModel.RegisterBody) {
    const email = payload.email.trim().toLowerCase();
    const name = payload.name.trim();

    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return { statusCode: 409, body: { error: "email_already_registered" } };
    }

    const userId = newId("usr");
    const createdAt = TimeService.nowIso();

    await db.insert(users).values({
      id: userId,
      email,
      name,
      createdAt,
    });

    const token = newSessionToken();
    await db.insert(sessions).values({
      id: newId("sessrec"),
      userId,
      tokenHash: hashSecret(token),
      expiresAt: TimeService.futureIso(SESSION_TTL_DAYS),
      revokedAt: null,
      createdAt,
    });

    return {
      statusCode: 200,
      body: {
        token,
        user: {
          id: userId,
          email,
          name,
          createdAt,
        },
      },
    };
  }

  static async login(payload: AuthModel.LoginBody) {
    const email = payload.email.trim().toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return { statusCode: 404, body: { error: "user_not_found" } };
    }

    const token = newSessionToken();
    await db.insert(sessions).values({
      id: newId("sessrec"),
      userId: user.id,
      tokenHash: hashSecret(token),
      expiresAt: TimeService.futureIso(SESSION_TTL_DAYS),
      revokedAt: null,
      createdAt: TimeService.nowIso(),
    });

    return { statusCode: 200, body: { token, user } };
  }

  static async me(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    return { statusCode: 200, body: { user: auth.user } };
  }

  static async logout(request: Request) {
    const token = AuthContextService.getBearerToken(request);
    if (!token) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    await db
      .update(sessions)
      .set({ revokedAt: TimeService.nowIso() })
      .where(eq(sessions.tokenHash, hashSecret(token)));

    return { statusCode: 200, body: { success: true } };
  }
}
