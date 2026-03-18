import { db } from "../../db/client";
import { creditLedger } from "../../db/schema";
import { env } from "../../config/env";
import { newId } from "../../lib/crypto";
import { AuthContextService } from "../../services/auth-context.service";
import { ApiKeyContextService } from "../../services/api-key-context.service";
import { CreditsService } from "../../services/credits.service";
import { TimeService } from "../../services/time.service";
import { MarketplaceModel } from "./model";

async function resolveUserId(request: Request): Promise<string | null> {
  const session = await AuthContextService.getAuthenticatedUser(request);
  if (session) return session.user.id;

  const apiKey = await ApiKeyContextService.getAuthenticatedApiKey(request);
  if (apiKey) return apiKey.userId;

  return null;
}

export abstract class MarketplaceService {
  static async run(request: Request, payload: MarketplaceModel.RunBody) {
    const userId = await resolveUserId(request);
    if (!userId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const model = MarketplaceModel.MODELS[payload.modelId as MarketplaceModel.ModelId];
    if (!model) {
      return {
        statusCode: 400,
        body: { error: "unknown_model", message: "Model not found." },
      };
    }

    const balanceCents = await CreditsService.computeBalanceCents(userId);
    if (balanceCents < model.costCents) {
      return {
        statusCode: 402,
        body: {
          error: "insufficient_balance",
          message: `Insufficient credits. You have $${(balanceCents / 100).toFixed(2)} but this request costs $${(model.costCents / 100).toFixed(2)}.`,
          balanceCents,
          costCents: model.costCents,
        },
      };
    }

    let aiResponse: string;
    try {
      aiResponse = await callOpenRouter(model.openRouterId, payload.prompt);
    } catch (err) {
      const message = err instanceof Error ? err.message : "LLM call failed";
      return { statusCode: 502, body: { error: "llm_error", message } };
    }

    if (model.costCents > 0) {
      const timestamp = TimeService.nowIso();
      await db.insert(creditLedger).values({
        id: newId("ledger"),
        userId,
        direction: "debit",
        amountCents: model.costCents,
        source: "marketplace_run",
        referenceId: payload.modelId,
        createdAt: timestamp,
      });
    }

    const newBalance = await CreditsService.computeBalanceCents(userId);

    return {
      statusCode: 200,
      body: {
        modelId: payload.modelId,
        modelLabel: model.label,
        response: aiResponse,
        costCents: model.costCents,
        balanceCents: newBalance,
      },
    };
  }

  static async deduct(request: Request, payload: { modelId: string }) {
    const userId = await resolveUserId(request);
    if (!userId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const model = MarketplaceModel.MODELS[payload.modelId as MarketplaceModel.ModelId];
    if (!model) {
      return {
        statusCode: 400,
        body: { error: "unknown_model", message: "Model not found." },
      };
    }

    const balanceCents = await CreditsService.computeBalanceCents(userId);
    if (balanceCents < model.costCents) {
      return {
        statusCode: 402,
        body: {
          error: "insufficient_balance",
          message: `Insufficient credits. You have $${(balanceCents / 100).toFixed(2)} but this request costs $${(model.costCents / 100).toFixed(2)}.`,
          balanceCents,
          costCents: model.costCents,
        },
      };
    }

    if (model.costCents > 0) {
      const timestamp = TimeService.nowIso();
      await db.insert(creditLedger).values({
        id: newId("ledger"),
        userId,
        direction: "debit",
        amountCents: model.costCents,
        source: "marketplace_run",
        referenceId: payload.modelId,
        createdAt: timestamp,
      });
    }

    const newBalance = await CreditsService.computeBalanceCents(userId);
    return {
      statusCode: 200,
      body: { balanceCents: newBalance, costCents: model.costCents },
    };
  }

  static async balance(request: Request) {
    const userId = await resolveUserId(request);
    if (!userId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const balanceCents = await CreditsService.computeBalanceCents(userId);
    return { statusCode: 200, body: { balanceCents } };
  }

  static async imagine(request: Request, payload: MarketplaceModel.ImagineBody) {
    const userId = await resolveUserId(request);
    if (!userId) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const model = MarketplaceModel.MODELS["google/gemini-3-pro-image"];

    const balanceCents = await CreditsService.computeBalanceCents(userId);
    if (balanceCents < model.costCents) {
      return {
        statusCode: 402,
        body: {
          error: "insufficient_balance",
          message: `Insufficient credits. You have $${(balanceCents / 100).toFixed(2)} but this request costs $${(model.costCents / 100).toFixed(2)}.`,
          balanceCents,
          costCents: model.costCents,
        },
      };
    }

    let result: { text: string | null; images: string[] };
    try {
      result = await callOpenRouterImage(model.openRouterId, payload.prompt);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Image generation failed";
      return { statusCode: 502, body: { error: "llm_error", message } };
    }

    const timestamp = TimeService.nowIso();
    await db.insert(creditLedger).values({
      id: newId("ledger"),
      userId,
      direction: "debit",
      amountCents: model.costCents,
      source: "marketplace_imagine",
      referenceId: "google/gemini-3-pro-image",
      createdAt: timestamp,
    });

    const newBalance = await CreditsService.computeBalanceCents(userId);

    return {
      statusCode: 200,
      body: {
        modelId: "google/gemini-3-pro-image",
        modelLabel: model.label,
        text: result.text,
        images: result.images,
        costCents: model.costCents,
        balanceCents: newBalance,
      },
    };
  }
}

// ─── OpenRouter ──────────────────────────────────────────────────────────────

async function callOpenRouter(modelId: string, prompt: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "No response generated.";
}

async function callOpenRouterImage(
  modelId: string,
  prompt: string,
): Promise<{ text: string | null; images: string[] }> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  const message = data?.choices?.[0]?.message;

  const images: string[] = [];
  if (message?.images) {
    for (const img of message.images) {
      if (img?.image_url?.url) {
        images.push(img.image_url.url);
      }
    }
  }

  return {
    text: message?.content ?? null,
    images,
  };
}
