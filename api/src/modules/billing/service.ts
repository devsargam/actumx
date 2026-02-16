import { and, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "../../db/client";
import { apiKeys, creditLedger, paymentIntents, usageEvents, x402Transactions } from "../../db/schema";
import { newId } from "../../lib/crypto";
import { AuthContextService } from "../../services/auth-context.service";
import { CreditsService } from "../../services/credits.service";
import { TimeService } from "../../services/time.service";
import type { BillingModel } from "./model";

export abstract class BillingService {
  static async summary(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const [topUpTotal] = await db
      .select({ totalCents: sql<number>`COALESCE(SUM(${paymentIntents.amountCents}), 0)` })
      .from(paymentIntents)
      .where(and(eq(paymentIntents.userId, auth.user.id), eq(paymentIntents.status, "settled")));

    const [usageTotal] = await db
      .select({ totalCents: sql<number>`COALESCE(SUM(${usageEvents.costCents}), 0)` })
      .from(usageEvents)
      .where(eq(usageEvents.userId, auth.user.id));

    const [activeKeyCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, auth.user.id), isNull(apiKeys.revokedAt)));

    const [transactionCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(x402Transactions)
      .where(eq(x402Transactions.userId, auth.user.id));

    const balanceCents = await CreditsService.computeBalanceCents(auth.user.id);

    return {
      statusCode: 200,
      body: {
        balanceCents,
        topUpTotalCents: topUpTotal?.totalCents ?? 0,
        usageTotalCents: usageTotal?.totalCents ?? 0,
        activeApiKeys: activeKeyCount?.count ?? 0,
        x402Transactions: transactionCount?.count ?? 0,
      },
    };
  }

  static async topUp(request: Request, payload: BillingModel.TopUpBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    if (payload.amountCents < 100 || payload.amountCents > 100000) {
      return {
        statusCode: 400,
        body: { error: "amount_must_be_between_100_and_100000_cents" },
      };
    }

    const timestamp = TimeService.nowIso();
    const intentId = newId("pi");

    await db.insert(paymentIntents).values({
      id: intentId,
      userId: auth.user.id,
      amountCents: payload.amountCents,
      status: "settled",
      providerReference: `dummy_${newId("provider")}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await db.insert(creditLedger).values({
      id: newId("ledger"),
      userId: auth.user.id,
      direction: "credit",
      amountCents: payload.amountCents,
      source: "top_up",
      referenceId: intentId,
      createdAt: timestamp,
    });

    const balanceCents = await CreditsService.computeBalanceCents(auth.user.id);

    return {
      statusCode: 200,
      body: {
        paymentIntentId: intentId,
        addedCents: payload.amountCents,
        balanceCents,
      },
    };
  }

  static async paymentIntents(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const intents = await db
      .select()
      .from(paymentIntents)
      .where(eq(paymentIntents.userId, auth.user.id))
      .orderBy(desc(paymentIntents.createdAt))
      .limit(50);

    return { statusCode: 200, body: { intents } };
  }
}
