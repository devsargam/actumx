import { desc, eq } from "drizzle-orm";

import { db } from "../../db/client";
import { apiKeys, usageEvents, x402Transactions } from "../../db/schema";
import { AuthContextService } from "../../services/auth-context.service";

export abstract class ActivityService {
  static async transactions(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const txs = await db
      .select({
        id: x402Transactions.id,
        status: x402Transactions.status,
        method: x402Transactions.method,
        endpoint: x402Transactions.endpoint,
        amountCents: x402Transactions.amountCents,
        receiptId: x402Transactions.receiptId,
        consumedAt: x402Transactions.consumedAt,
        createdAt: x402Transactions.createdAt,
        updatedAt: x402Transactions.updatedAt,
        apiKeyId: x402Transactions.apiKeyId,
      })
      .from(x402Transactions)
      .where(eq(x402Transactions.userId, auth.user.id))
      .orderBy(desc(x402Transactions.createdAt))
      .limit(100);

    const keys = await db
      .select({ id: apiKeys.id, name: apiKeys.name, keyPrefix: apiKeys.keyPrefix })
      .from(apiKeys)
      .where(eq(apiKeys.userId, auth.user.id));

    const keyById = new Map(keys.map((key) => [key.id, key]));

    return {
      statusCode: 200,
      body: {
        transactions: txs.map((tx) => ({
          ...tx,
          apiKeyName: keyById.get(tx.apiKeyId)?.name ?? "Unknown key",
          apiKeyPrefix: keyById.get(tx.apiKeyId)?.keyPrefix ?? "",
        })),
      },
    };
  }

  static async usage(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const events = await db
      .select()
      .from(usageEvents)
      .where(eq(usageEvents.userId, auth.user.id))
      .orderBy(desc(usageEvents.createdAt))
      .limit(100);

    return { statusCode: 200, body: { events } };
  }
}
