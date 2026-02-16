import { and, eq } from "drizzle-orm";

import { db } from "../../db/client";
import { apiKeys, creditLedger, usageEvents, x402Transactions } from "../../db/schema";
import { X402_PAID_ENDPOINT, X402_PAID_REQUEST_COST_CENTS, X402_SETTLEMENT_ENDPOINT } from "../../config/constants";
import { newId } from "../../lib/crypto";
import { ApiKeyContextService } from "../../services/api-key-context.service";
import { CreditsService } from "../../services/credits.service";
import { TimeService } from "../../services/time.service";
import type { X402Model } from "./model";

export abstract class X402Service {
  static buildPaymentRequiredResponse(paymentId: string) {
    const now = Date.now();

    return {
      error: "payment_required",
      message: "This endpoint requires payment. Settle first and retry with payment proof.",
      x402: {
        version: "0.1-draft",
        paymentId,
        amountCents: X402_PAID_REQUEST_COST_CENTS,
        amountUsd: TimeService.dollarsFromCents(X402_PAID_REQUEST_COST_CENTS),
        currency: "USD",
        endpoint: X402_PAID_ENDPOINT,
        settlementEndpoint: X402_SETTLEMENT_ENDPOINT,
        facilitator: "internal-simulator",
        expiresAt: new Date(now + 10 * 60 * 1000).toISOString(),
      },
    };
  }

  static async settle(request: Request, payload: X402Model.SettleBody) {
    const apiKey = await ApiKeyContextService.getAuthenticatedApiKey(request);
    if (!apiKey) {
      return { statusCode: 401, body: { error: "missing_or_invalid_api_key" } };
    }

    const [transaction] = await db
      .select()
      .from(x402Transactions)
      .where(
        and(
          eq(x402Transactions.id, payload.paymentId),
          eq(x402Transactions.userId, apiKey.userId),
          eq(x402Transactions.apiKeyId, apiKey.id)
        )
      )
      .limit(1);

    if (!transaction) {
      return { statusCode: 404, body: { error: "payment_not_found" } };
    }

    if ((transaction.status === "settled" || transaction.status === "completed") && transaction.receiptId) {
      return {
        statusCode: 200,
        body: {
          receiptId: transaction.receiptId,
          paymentId: transaction.id,
          status: transaction.status,
          amountCents: transaction.amountCents,
        },
      };
    }

    const balanceCents = await CreditsService.computeBalanceCents(apiKey.userId);
    if (balanceCents < transaction.amountCents) {
      return {
        statusCode: 402,
        body: {
          error: "insufficient_balance",
          requiredCents: transaction.amountCents,
          balanceCents,
          message: "Top up balance in dashboard before settling this x402 payment.",
        },
      };
    }

    const receiptId = newId("receipt");
    const timestamp = TimeService.nowIso();

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
      statusCode: 200,
      body: {
        receiptId,
        paymentId: transaction.id,
        status: "settled",
        amountCents: transaction.amountCents,
        settledAt: timestamp,
      },
    };
  }

  static async quote(
    request: Request,
    query: {
      topic?: string;
    }
  ) {
    const apiKey = await ApiKeyContextService.getAuthenticatedApiKey(request);
    if (!apiKey) {
      return { statusCode: 401, body: { error: "missing_or_invalid_api_key" } };
    }

    const paymentId = request.headers.get("x-payment-id");
    const paymentProof = request.headers.get("x-payment-proof");

    if (!paymentId || !paymentProof) {
      const txId = newId("x402tx");
      const timestamp = TimeService.nowIso();

      await db.insert(x402Transactions).values({
        id: txId,
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        endpoint: X402_PAID_ENDPOINT,
        method: "GET",
        amountCents: X402_PAID_REQUEST_COST_CENTS,
        status: "pending",
        paymentIntentId: null,
        receiptId: null,
        consumedAt: null,
        metadata: JSON.stringify({ topic: query.topic ?? "general" }),
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      return {
        statusCode: 402,
        body: X402Service.buildPaymentRequiredResponse(txId),
      };
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
      return { statusCode: 402, body: { error: "invalid_payment_proof" } };
    }

    if (transaction.status !== "settled") {
      return {
        statusCode: 402,
        body: { error: "payment_not_settled", status: transaction.status },
      };
    }

    const timestamp = TimeService.nowIso();

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
      endpoint: X402_PAID_ENDPOINT,
      method: "GET",
      units: 1,
      costCents: transaction.amountCents,
      x402TransactionId: transaction.id,
      createdAt: timestamp,
    });

    await db.update(apiKeys).set({ lastUsedAt: timestamp }).where(eq(apiKeys.id, apiKey.id));

    return {
      statusCode: 200,
      body: {
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
      },
    };
  }
}
