import { and, eq } from "drizzle-orm";

import { db } from "../../db/client";
import { endpoints, paymentLinks, services, x402Transactions, creditLedger, usageEvents, apiKeys } from "../../db/schema";
import { newId } from "../../lib/crypto";
import { ApiKeyContextService } from "../../services/api-key-context.service";
import { TimeService } from "../../services/time.service";

type GatewayResult = {
  statusCode: number;
  body: unknown;
  headers?: Record<string, string>;
};

export abstract class GatewayService {
  /**
   * Handle /x402/pay/:linkId
   * Returns a 402 payment-required response with the payment link details.
   */
  static async handlePaymentLink(request: Request, linkId: string): Promise<GatewayResult> {
    const [link] = await db
      .select()
      .from(paymentLinks)
      .where(eq(paymentLinks.id, linkId))
      .limit(1);

    if (!link) {
      return { statusCode: 404, body: { error: "payment_link_not_found" } };
    }

    const apiKey = await ApiKeyContextService.getAuthenticatedApiKey(request);

    const paymentId = request.headers.get("x-payment-id");
    const paymentProof = request.headers.get("x-payment-proof");

    // If caller provides valid payment proof, return success
    if (paymentId && paymentProof && apiKey) {
      const verified = await GatewayService.verifyAndComplete(
        paymentId,
        paymentProof,
        apiKey.userId,
        apiKey.id,
        `/x402/pay/${linkId}`,
        request.method
      );
      if (verified) {
        return {
          statusCode: 200,
          body: {
            status: "paid",
            paymentLinkId: link.id,
            amountCents: link.amountCents,
            description: link.description,
            receiptId: paymentProof,
          },
        };
      }
    }

    // Create a pending transaction and return 402
    if (!apiKey) {
      // Without an API key, just return payment info without creating a transaction
      return {
        statusCode: 402,
        body: {
          error: "payment_required",
          message: "This payment link requires payment. Provide an API key and settle first.",
          x402: {
            version: "0.1-draft",
            amountCents: link.amountCents,
            amountUsd: TimeService.dollarsFromCents(link.amountCents),
            currency: "USD",
            description: link.description,
            isReusable: link.isReusable === "true",
            settlementEndpoint: "/v1/x402/settle",
            facilitator: "internal-simulator",
          },
        },
      };
    }

    const txId = newId("x402tx");
    const now = TimeService.nowIso();

    await db.insert(x402Transactions).values({
      id: txId,
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
      endpoint: `/x402/pay/${linkId}`,
      method: request.method,
      amountCents: link.amountCents,
      status: "pending",
      paymentIntentId: null,
      receiptId: null,
      consumedAt: null,
      metadata: JSON.stringify({ paymentLinkId: linkId, description: link.description }),
      createdAt: now,
      updatedAt: now,
    });

    return {
      statusCode: 402,
      body: {
        error: "payment_required",
        message: "This payment link requires payment. Settle first and retry with payment proof.",
        x402: {
          version: "0.1-draft",
          paymentId: txId,
          amountCents: link.amountCents,
          amountUsd: TimeService.dollarsFromCents(link.amountCents),
          currency: "USD",
          description: link.description,
          isReusable: link.isReusable === "true",
          endpoint: `/x402/pay/${linkId}`,
          settlementEndpoint: "/v1/x402/settle",
          facilitator: "internal-simulator",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
      },
    };
  }

  /**
   * Handle /x402/purchase/:serviceId/*path
   * Looks up the endpoint pricing, handles x402 payment, then proxies to the upstream.
   */
  static async handleGatewayRequest(
    request: Request,
    serviceId: string,
    path: string
  ): Promise<GatewayResult> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (!service) {
      return { statusCode: 404, body: { error: "service_not_found" } };
    }

    // Find the matching endpoint
    const allEndpoints = await db
      .select()
      .from(endpoints)
      .where(and(eq(endpoints.serviceId, serviceId), eq(endpoints.isEnabled, "true")));

    const method = request.method.toUpperCase();
    const matchedEndpoint = allEndpoints.find((ep) => {
      if (ep.method !== method) return false;
      return matchPath(ep.path, path);
    });

    if (!matchedEndpoint) {
      return { statusCode: 404, body: { error: "endpoint_not_found" } };
    }

    // If endpoint is free, proxy directly
    if (matchedEndpoint.priceCents === 0) {
      return GatewayService.proxyToUpstream(request, service, path);
    }

    // Paid endpoint — require API key and x402 flow
    const apiKey = await ApiKeyContextService.getAuthenticatedApiKey(request);
    if (!apiKey) {
      return { statusCode: 401, body: { error: "missing_or_invalid_api_key" } };
    }

    const paymentId = request.headers.get("x-payment-id");
    const paymentProof = request.headers.get("x-payment-proof");

    if (paymentId && paymentProof) {
      const verified = await GatewayService.verifyAndComplete(
        paymentId,
        paymentProof,
        apiKey.userId,
        apiKey.id,
        `/x402/purchase/${serviceId}${path}`,
        method
      );
      if (verified) {
        return GatewayService.proxyToUpstream(request, service, path);
      }
      return { statusCode: 402, body: { error: "invalid_payment_proof" } };
    }

    // Create pending transaction and return 402
    const txId = newId("x402tx");
    const now = TimeService.nowIso();

    await db.insert(x402Transactions).values({
      id: txId,
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
      endpoint: `/x402/purchase/${serviceId}${path}`,
      method,
      amountCents: matchedEndpoint.priceCents,
      status: "pending",
      paymentIntentId: null,
      receiptId: null,
      consumedAt: null,
      metadata: JSON.stringify({ serviceId, endpointId: matchedEndpoint.id }),
      createdAt: now,
      updatedAt: now,
    });

    return {
      statusCode: 402,
      body: {
        error: "payment_required",
        message: "This endpoint requires payment. Settle first and retry with payment proof.",
        x402: {
          version: "0.1-draft",
          paymentId: txId,
          amountCents: matchedEndpoint.priceCents,
          amountUsd: TimeService.dollarsFromCents(matchedEndpoint.priceCents),
          currency: "USD",
          endpoint: `/x402/purchase/${serviceId}${path}`,
          settlementEndpoint: "/v1/x402/settle",
          facilitator: "internal-simulator",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
      },
    };
  }

  private static async verifyAndComplete(
    paymentId: string,
    paymentProof: string,
    userId: string,
    apiKeyId: string,
    endpoint: string,
    method: string
  ): Promise<boolean> {
    const [tx] = await db
      .select()
      .from(x402Transactions)
      .where(
        and(
          eq(x402Transactions.id, paymentId),
          eq(x402Transactions.userId, userId),
          eq(x402Transactions.apiKeyId, apiKeyId)
        )
      )
      .limit(1);

    if (!tx || tx.receiptId !== paymentProof) return false;
    if (tx.status !== "settled") return tx.status === "completed";

    const now = TimeService.nowIso();

    const [completed] = await db
      .update(x402Transactions)
      .set({ status: "completed", consumedAt: now, updatedAt: now })
      .where(and(eq(x402Transactions.id, tx.id), eq(x402Transactions.status, "settled")))
      .returning({ id: x402Transactions.id });

    if (completed) {
      await db.insert(usageEvents).values({
        id: newId("usage"),
        userId,
        apiKeyId,
        endpoint,
        method,
        units: 1,
        costCents: tx.amountCents,
        x402TransactionId: tx.id,
        createdAt: now,
      });

      await db
        .update(apiKeys)
        .set({ lastUsedAt: now })
        .where(eq(apiKeys.id, apiKeyId));
    }

    return true;
  }

  private static async proxyToUpstream(
    request: Request,
    service: typeof services.$inferSelect,
    path: string
  ): Promise<GatewayResult> {
    const upstreamUrl = `${service.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "content-type": request.headers.get("content-type") ?? "application/json",
    };

    // Forward auth to upstream
    if (service.authMethod === "bearer" && service.apiKey) {
      headers["authorization"] = `Bearer ${service.apiKey}`;
    } else if (service.authMethod === "x-api-key" && service.apiKey) {
      headers["x-api-key"] = service.apiKey;
    }

    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        method: request.method,
        headers,
        body: request.method !== "GET" && request.method !== "HEAD"
          ? await request.text()
          : undefined,
      });

      const responseBody = await upstreamResponse.text();
      const contentType = upstreamResponse.headers.get("content-type") ?? "application/json";

      let parsedBody: unknown;
      try {
        parsedBody = JSON.parse(responseBody);
      } catch {
        parsedBody = responseBody;
      }

      return {
        statusCode: upstreamResponse.status,
        body: parsedBody,
        headers: { "content-type": contentType },
      };
    } catch (error) {
      return {
        statusCode: 502,
        body: {
          error: "upstream_error",
          message: error instanceof Error ? error.message : "failed to reach upstream service",
        },
      };
    }
  }
}

/**
 * Match a route pattern like /v1/users/:id against an actual path like /v1/users/123
 */
function matchPath(pattern: string, actual: string): boolean {
  const patternParts = pattern.split("/").filter(Boolean);
  const actualParts = actual.split("/").filter(Boolean);

  if (patternParts.length !== actualParts.length) return false;

  return patternParts.every((part, i) => {
    if (part.startsWith(":")) return true;
    return part === actualParts[i];
  });
}
