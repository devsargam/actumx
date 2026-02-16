import { cors } from "@elysiajs/cors";
import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "./db/client";
import { initializeDatabase } from "./db/init";
import {
  apiKeys,
  creditLedger,
  paymentIntents,
  sessions,
  usageEvents,
  users,
  x402Transactions,
} from "./db/schema";
import { hashSecret, newApiKey, newId, newSessionToken } from "./lib/crypto";

const PORT = Number(process.env.PORT ?? 3001);
const SESSION_TTL_DAYS = 30;
const PAID_REQUEST_COST_CENTS = 25;
const PAID_ENDPOINT = "/v1/protected/quote";

initializeDatabase();

function nowIso(): string {
  return new Date().toISOString();
}

function futureIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function dollarsFromCents(amountCents: number): string {
  return (amountCents / 100).toFixed(2);
}

async function computeBalanceCents(userId: string): Promise<number> {
  const [result] = await db
    .select({
      balanceCents: sql<number>`COALESCE(SUM(CASE WHEN ${creditLedger.direction} = 'credit' THEN ${creditLedger.amountCents} ELSE -${creditLedger.amountCents} END), 0)`,
    })
    .from(creditLedger)
    .where(eq(creditLedger.userId, userId));

  return result?.balanceCents ?? 0;
}

function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) {
    return null;
  }

  const [type, token] = header.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

async function getAuthenticatedUser(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return null;
  }

  const tokenHash = hashSecret(token);
  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, nowIso()),
        isNull(sessions.revokedAt)
      )
    )
    .limit(1);

  if (!session) {
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);

  if (!user) {
    return null;
  }

  return { user, session };
}

async function getAuthenticatedApiKey(request: Request) {
  const rawApiKey = request.headers.get("x-api-key");
  if (!rawApiKey) {
    return null;
  }

  const [apiKey] = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, hashSecret(rawApiKey)), isNull(apiKeys.revokedAt)))
    .limit(1);

  if (!apiKey) {
    return null;
  }

  return apiKey;
}

function buildPaymentRequiredResponse(paymentId: string) {
  const now = Date.now();

  return {
    error: "payment_required",
    message: "This endpoint requires payment. Settle first and retry with payment proof.",
    x402: {
      version: "0.1-draft",
      paymentId,
      amountCents: PAID_REQUEST_COST_CENTS,
      amountUsd: dollarsFromCents(PAID_REQUEST_COST_CENTS),
      currency: "USD",
      endpoint: PAID_ENDPOINT,
      settlementEndpoint: "/v1/x402/settle",
      facilitator: "internal-simulator",
      expiresAt: new Date(now + 10 * 60 * 1000).toISOString(),
    },
  };
}

const app = new Elysia()
  .use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "x-payment-id", "x-payment-proof"],
    })
  )
  .get("/health", () => ({ status: "ok", service: "x402-api" }))
  .post(
    "/v1/auth/register",
    async ({ body, set }) => {
      const email = body.email.trim().toLowerCase();
      const name = body.name.trim();

      const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing) {
        set.status = 409;
        return { error: "email_already_registered" };
      }

      const userId = newId("usr");
      const createdAt = nowIso();

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
        expiresAt: futureIso(SESSION_TTL_DAYS),
        revokedAt: null,
        createdAt,
      });

      return {
        token,
        user: {
          id: userId,
          email,
          name,
          createdAt,
        },
      };
    },
    {
      body: t.Object({
        email: t.String({ minLength: 3 }),
        name: t.String({ minLength: 2 }),
      }),
    }
  )
  .post(
    "/v1/auth/login",
    async ({ body, set }) => {
      const email = body.email.trim().toLowerCase();
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (!user) {
        set.status = 404;
        return { error: "user_not_found" };
      }

      const token = newSessionToken();
      await db.insert(sessions).values({
        id: newId("sessrec"),
        userId: user.id,
        tokenHash: hashSecret(token),
        expiresAt: futureIso(SESSION_TTL_DAYS),
        revokedAt: null,
        createdAt: nowIso(),
      });

      return { token, user };
    },
    {
      body: t.Object({
        email: t.String({ minLength: 3 }),
      }),
    }
  )
  .get("/v1/auth/me", async ({ request, set }) => {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      set.status = 401;
      return { error: "unauthorized" };
    }

    return { user: auth.user };
  })
  .post("/v1/auth/logout", async ({ request, set }) => {
    const token = getBearerToken(request);
    if (!token) {
      set.status = 401;
      return { error: "unauthorized" };
    }

    await db
      .update(sessions)
      .set({ revokedAt: nowIso() })
      .where(eq(sessions.tokenHash, hashSecret(token)));

    return { success: true };
  })
  .get("/v1/billing/summary", async ({ request, set }) => {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      set.status = 401;
      return { error: "unauthorized" };
    }

    const [topUpTotal] = await db
      .select({
        totalCents: sql<number>`COALESCE(SUM(${paymentIntents.amountCents}), 0)`,
      })
      .from(paymentIntents)
      .where(and(eq(paymentIntents.userId, auth.user.id), eq(paymentIntents.status, "settled")));

    const [usageTotal] = await db
      .select({
        totalCents: sql<number>`COALESCE(SUM(${usageEvents.costCents}), 0)`,
      })
      .from(usageEvents)
      .where(eq(usageEvents.userId, auth.user.id));

    const [activeKeyCount] = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, auth.user.id), isNull(apiKeys.revokedAt)));

    const [transactionCount] = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(x402Transactions)
      .where(eq(x402Transactions.userId, auth.user.id));

    const balanceCents = await computeBalanceCents(auth.user.id);

    return {
      balanceCents,
      topUpTotalCents: topUpTotal?.totalCents ?? 0,
      usageTotalCents: usageTotal?.totalCents ?? 0,
      activeApiKeys: activeKeyCount?.count ?? 0,
      x402Transactions: transactionCount?.count ?? 0,
    };
  })
  .post(
    "/v1/billing/top-up",
    async ({ request, body, set }) => {
      const auth = await getAuthenticatedUser(request);
      if (!auth) {
        set.status = 401;
        return { error: "unauthorized" };
      }

      if (body.amountCents < 100 || body.amountCents > 100000) {
        set.status = 400;
        return { error: "amount_must_be_between_100_and_100000_cents" };
      }

      const timestamp = nowIso();
      const intentId = newId("pi");

      await db.insert(paymentIntents).values({
        id: intentId,
        userId: auth.user.id,
        amountCents: body.amountCents,
        status: "settled",
        providerReference: `dummy_${newId("provider")}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      await db.insert(creditLedger).values({
        id: newId("ledger"),
        userId: auth.user.id,
        direction: "credit",
        amountCents: body.amountCents,
        source: "top_up",
        referenceId: intentId,
        createdAt: timestamp,
      });

      const balanceCents = await computeBalanceCents(auth.user.id);

      return {
        paymentIntentId: intentId,
        addedCents: body.amountCents,
        balanceCents,
      };
    },
    {
      body: t.Object({
        amountCents: t.Number({ minimum: 100 }),
      }),
    }
  )
  .get("/v1/billing/payment-intents", async ({ request, set }) => {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      set.status = 401;
      return { error: "unauthorized" };
    }

    const intents = await db
      .select()
      .from(paymentIntents)
      .where(eq(paymentIntents.userId, auth.user.id))
      .orderBy(desc(paymentIntents.createdAt))
      .limit(50);

    return { intents };
  })
  .get("/v1/api-keys", async ({ request, set }) => {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      set.status = 401;
      return { error: "unauthorized" };
    }

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        revokedAt: apiKeys.revokedAt,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, auth.user.id))
      .orderBy(desc(apiKeys.createdAt));

    return { keys };
  })
  .post(
    "/v1/api-keys",
    async ({ request, body, set }) => {
      const auth = await getAuthenticatedUser(request);
      if (!auth) {
        set.status = 401;
        return { error: "unauthorized" };
      }

      const rawKey = newApiKey();
      const keyPrefix = rawKey.slice(0, 14);
      const timestamp = nowIso();
      const keyId = newId("key");

      await db.insert(apiKeys).values({
        id: keyId,
        userId: auth.user.id,
        name: body.name,
        keyPrefix,
        keyHash: hashSecret(rawKey),
        revokedAt: null,
        lastUsedAt: null,
        createdAt: timestamp,
      });

      return {
        apiKeyId: keyId,
        apiKey: rawKey,
        keyPrefix,
        warning: "Store this key now. It is shown only once.",
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 80 }),
      }),
    }
  )
  .delete("/v1/api-keys/:id", async ({ request, params, set }) => {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      set.status = 401;
      return { error: "unauthorized" };
    }

    await db
      .update(apiKeys)
      .set({ revokedAt: nowIso() })
      .where(and(eq(apiKeys.id, params.id), eq(apiKeys.userId, auth.user.id), isNull(apiKeys.revokedAt)));

    return { success: true };
  })
  .get("/v1/transactions", async ({ request, set }) => {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      set.status = 401;
      return { error: "unauthorized" };
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
      transactions: txs.map((tx) => ({
        ...tx,
        apiKeyName: keyById.get(tx.apiKeyId)?.name ?? "Unknown key",
        apiKeyPrefix: keyById.get(tx.apiKeyId)?.keyPrefix ?? "",
      })),
    };
  })
  .get("/v1/usage", async ({ request, set }) => {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      set.status = 401;
      return { error: "unauthorized" };
    }

    const events = await db
      .select()
      .from(usageEvents)
      .where(eq(usageEvents.userId, auth.user.id))
      .orderBy(desc(usageEvents.createdAt))
      .limit(100);

    return { events };
  })
  .post(
    "/v1/x402/settle",
    async ({ request, body, set }) => {
      const apiKey = await getAuthenticatedApiKey(request);
      if (!apiKey) {
        set.status = 401;
        return { error: "missing_or_invalid_api_key" };
      }

      const [transaction] = await db
        .select()
        .from(x402Transactions)
        .where(
          and(
            eq(x402Transactions.id, body.paymentId),
            eq(x402Transactions.userId, apiKey.userId),
            eq(x402Transactions.apiKeyId, apiKey.id)
          )
        )
        .limit(1);

      if (!transaction) {
        set.status = 404;
        return { error: "payment_not_found" };
      }

      if ((transaction.status === "settled" || transaction.status === "completed") && transaction.receiptId) {
        return {
          receiptId: transaction.receiptId,
          paymentId: transaction.id,
          status: transaction.status,
          amountCents: transaction.amountCents,
        };
      }

      const balanceCents = await computeBalanceCents(apiKey.userId);
      if (balanceCents < transaction.amountCents) {
        set.status = 402;
        return {
          error: "insufficient_balance",
          requiredCents: transaction.amountCents,
          balanceCents,
          message: "Top up balance in dashboard before settling this x402 payment.",
        };
      }

      const receiptId = newId("receipt");
      const timestamp = nowIso();

      await db.insert(creditLedger).values({
        id: newId("ledger"),
        userId: apiKey.userId,
        direction: "debit",
        amountCents: transaction.amountCents,
        source: "api_request",
        referenceId: transaction.id,
        createdAt: timestamp,
      });

      await db
        .update(x402Transactions)
        .set({
          status: "settled",
          receiptId,
          updatedAt: timestamp,
        })
        .where(eq(x402Transactions.id, transaction.id));

      return {
        receiptId,
        paymentId: transaction.id,
        status: "settled",
        amountCents: transaction.amountCents,
        settledAt: timestamp,
      };
    },
    {
      body: t.Object({
        paymentId: t.String({ minLength: 6 }),
      }),
    }
  )
  .get("/v1/protected/quote", async ({ request, set, query }) => {
    const apiKey = await getAuthenticatedApiKey(request);
    if (!apiKey) {
      set.status = 401;
      return { error: "missing_or_invalid_api_key" };
    }

    const paymentId = request.headers.get("x-payment-id");
    const paymentProof = request.headers.get("x-payment-proof");

    if (!paymentId || !paymentProof) {
      const txId = newId("x402tx");
      const timestamp = nowIso();

      await db.insert(x402Transactions).values({
        id: txId,
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        endpoint: PAID_ENDPOINT,
        method: "GET",
        amountCents: PAID_REQUEST_COST_CENTS,
        status: "pending",
        paymentIntentId: null,
        receiptId: null,
        consumedAt: null,
        metadata: JSON.stringify({ topic: query.topic ?? "general" }),
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      set.status = 402;
      return buildPaymentRequiredResponse(txId);
    }

    const [transaction] = await db
      .select()
      .from(x402Transactions)
      .where(
        and(
          eq(x402Transactions.id, paymentId),
          eq(x402Transactions.userId, apiKey.userId),
          eq(x402Transactions.apiKeyId, apiKey.id)
        )
      )
      .limit(1);

    if (!transaction || transaction.receiptId !== paymentProof) {
      set.status = 402;
      return { error: "invalid_payment_proof" };
    }

    if (transaction.status !== "settled") {
      set.status = 402;
      return { error: "payment_not_settled", status: transaction.status };
    }

    const timestamp = nowIso();

    await db
      .update(x402Transactions)
      .set({
        status: "completed",
        consumedAt: timestamp,
        updatedAt: timestamp,
      })
      .where(eq(x402Transactions.id, transaction.id));

    await db.insert(usageEvents).values({
      id: newId("usage"),
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
      endpoint: PAID_ENDPOINT,
      method: "GET",
      units: 1,
      costCents: transaction.amountCents,
      x402TransactionId: transaction.id,
      createdAt: timestamp,
    });

    await db.update(apiKeys).set({ lastUsedAt: timestamp }).where(eq(apiKeys.id, apiKey.id));

    return {
      data: {
        topic: query.topic ?? "general",
        insight:
          "x402 allows machine-readable payment requirements using HTTP 402 so clients can settle and retry without custom per-API billing logic.",
        generatedAt: timestamp,
      },
      payment: {
        paymentId: transaction.id,
        receiptId: transaction.receiptId,
        amountCents: transaction.amountCents,
        status: "completed",
      },
    };
  })
  .listen(PORT);

console.log(`x402 API running on http://localhost:${PORT}`);
