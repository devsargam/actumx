import { and, desc, eq } from "drizzle-orm";

import { db } from "../../db/client";
import {
  agents,
  apiKeys,
  creditLedger,
  usageEvents,
  x402Transactions,
} from "../../db/schema";
import {
  X402_PAID_ENDPOINT,
  X402_PAID_REQUEST_COST_CENTS,
  X402_SETTLEMENT_ENDPOINT,
} from "../../config/constants";
import { newId } from "../../lib/crypto";
import { ApiKeyContextService } from "../../services/api-key-context.service";
import { CreditsService } from "../../services/credits.service";
import { SolanaBalanceService } from "../../services/solana-balance.service";
import { TimeService } from "../../services/time.service";
import type { X402Model } from "./model";

type JsonRpcRequest = {
  jsonrpc?: unknown;
  id?: unknown;
  method?: unknown;
  params?: unknown;
};

type ToolCallParams = {
  name?: unknown;
  arguments?: unknown;
};

type JsonRpcHandlerResult = {
  statusCode: number;
  body?: unknown;
};

export abstract class X402Service {
  private static async getAgentForTool(userId: string, agentId?: string) {
    if (agentId) {
      const [agent] = await db
        .select({
          id: agents.id,
          name: agents.name,
          publicKey: agents.publicKey,
        })
        .from(agents)
        .where(and(eq(agents.userId, userId), eq(agents.id, agentId)))
        .limit(1);

      return agent ?? null;
    }

    const [latestAgent] = await db
      .select({
        id: agents.id,
        name: agents.name,
        publicKey: agents.publicKey,
      })
      .from(agents)
      .where(eq(agents.userId, userId))
      .orderBy(desc(agents.createdAt))
      .limit(1);

    return latestAgent ?? null;
  }

  private static jsonRpcError(id: unknown, code: number, message: string) {
    return {
      jsonrpc: "2.0",
      error: { code, message },
      id: id ?? null,
    };
  }

  private static jsonRpcResult(id: unknown, result: unknown) {
    return {
      jsonrpc: "2.0",
      result,
      id: id ?? null,
    };
  }

  static async mcp(
    request: Request,
    payload?: unknown,
  ): Promise<JsonRpcHandlerResult> {
    const apiKey = await ApiKeyContextService.getAuthenticatedApiKey(request);
    if (!apiKey) {
      return {
        statusCode: 401,
        body: X402Service.jsonRpcError(null, -32001, "API key required"),
      };
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return {
        statusCode: 400,
        body: X402Service.jsonRpcError(null, -32600, "Invalid Request"),
      };
    }

    const rpc = payload as JsonRpcRequest;
    const method = typeof rpc.method === "string" ? rpc.method : "";
    const id = rpc.id ?? null;

    if (method === "initialize") {
      return {
        statusCode: 200,
        body: X402Service.jsonRpcResult(id, {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "actumx-mcp",
            version: "0.1.0",
          },
        }),
      };
    }

    if (method === "tools/list") {
      return {
        statusCode: 200,
        body: X402Service.jsonRpcResult(id, {
          tools: [
            {
              name: "wallet_balance",
              title: "Wallet Balance",
              description:
                "Return the selected agent wallet balance on Solana.",
              inputSchema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  agentId: {
                    type: "string",
                    description:
                      "Optional agent id. If omitted, uses your most recent agent.",
                  },
                },
              },
            },
          ],
        }),
      };
    }

    if (method === "tools/call") {
      const params = (rpc.params ?? {}) as ToolCallParams;
      const toolName = typeof params.name === "string" ? params.name : "";
      if (toolName !== "wallet_balance") {
        return {
          statusCode: 200,
          body: X402Service.jsonRpcError(id, -32602, "Unknown tool"),
        };
      }

      const args = (params.arguments ?? {}) as { agentId?: unknown };
      const agentId =
        typeof args.agentId === "string" ? args.agentId : undefined;

      const agent = await X402Service.getAgentForTool(apiKey.userId, agentId);
      if (!agent) {
        return {
          statusCode: 200,
          body: X402Service.jsonRpcResult(id, {
            content: [
              {
                type: "text",
                text: "No agents found for this API key user. Create an agent first.",
              },
            ],
            isError: true,
          }),
        };
      }

      const balance = await SolanaBalanceService.getBalance(agent.publicKey);
      const balanceSol = balance.balanceSol ?? 0;
      const lamports = balance.balanceLamports ?? 0;

      return {
        statusCode: 200,
        body: X402Service.jsonRpcResult(id, {
          content: [
            {
              type: "text",
              text: `Agent ${agent.name} (${agent.publicKey}) balance: ${balanceSol.toFixed(6)} SOL (${lamports} lamports).`,
            },
          ],
          structuredContent: {
            agentId: agent.id,
            agentName: agent.name,
            publicKey: agent.publicKey,
            balanceLamports: lamports,
            balanceSol,
            network: "solana",
            error: balance.error,
          },
          isError: balance.error !== null,
        }),
      };
    }

    if (method === "notifications/initialized") {
      // JSON-RPC notifications must not receive a response body.
      return {
        statusCode: 202,
      };
    }

    if (rpc.id === undefined) {
      // Ignore unknown notifications without responding with a JSON-RPC payload.
      return {
        statusCode: 202,
      };
    }

    return {
      statusCode: 200,
      body: X402Service.jsonRpcError(id, -32601, "Method not found"),
    };
  }

  static buildPaymentRequiredResponse(paymentId: string) {
    const now = Date.now();

    return {
      error: "payment_required",
      message:
        "This endpoint requires payment. Settle first and retry with payment proof.",
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
          eq(x402Transactions.apiKeyId, apiKey.id),
        ),
      )
      .limit(1);

    if (!transaction) {
      return { statusCode: 404, body: { error: "payment_not_found" } };
    }

    if (
      (transaction.status === "settled" ||
        transaction.status === "completed") &&
      transaction.receiptId
    ) {
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

    const balanceCents = await CreditsService.computeBalanceCents(
      apiKey.userId,
    );
    if (balanceCents < transaction.amountCents) {
      return {
        statusCode: 402,
        body: {
          error: "insufficient_balance",
          requiredCents: transaction.amountCents,
          balanceCents,
          message:
            "Top up balance in dashboard before settling this x402 payment.",
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
    },
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
          eq(x402Transactions.apiKeyId, apiKey.id),
        ),
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

    await db
      .update(apiKeys)
      .set({ lastUsedAt: timestamp })
      .where(eq(apiKeys.id, apiKey.id));

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
