import { db } from "../../db/client";
import { creditLedger } from "../../db/schema";
import { newId } from "../../lib/crypto";
import { AuthContextService } from "../../services/auth-context.service";
import { CreditsService } from "../../services/credits.service";
import { TimeService } from "../../services/time.service";
import { MarketplaceModel } from "./model";

export abstract class MarketplaceService {
  static async run(request: Request, payload: MarketplaceModel.RunBody) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const pricing = MarketplaceModel.MODEL_PRICING[payload.modelId];
    if (!pricing) {
      return {
        statusCode: 400,
        body: { error: "unknown_model", message: "Model not found." },
      };
    }

    // Check balance
    const balanceCents = await CreditsService.computeBalanceCents(auth.user.id);
    if (balanceCents < pricing.costCents) {
      return {
        statusCode: 402,
        body: {
          error: "insufficient_balance",
          message: `Insufficient credits. You have $${(balanceCents / 100).toFixed(2)} but this request costs $${(pricing.costCents / 100).toFixed(2)}.`,
          balanceCents,
          costCents: pricing.costCents,
        },
      };
    }

    // Call the LLM
    let aiResponse: string;
    try {
      aiResponse = await callLLM(payload.modelId, payload.prompt);
    } catch (err) {
      const message = err instanceof Error ? err.message : "LLM call failed";
      return { statusCode: 502, body: { error: "llm_error", message } };
    }

    // Deduct credits (only after successful LLM call)
    if (pricing.costCents > 0) {
      const timestamp = TimeService.nowIso();
      await db.insert(creditLedger).values({
        id: newId("ledger"),
        userId: auth.user.id,
        direction: "debit",
        amountCents: pricing.costCents,
        source: "marketplace_run",
        referenceId: `${payload.modelId}`,
        createdAt: timestamp,
      });
    }

    const newBalance = await CreditsService.computeBalanceCents(auth.user.id);

    return {
      statusCode: 200,
      body: {
        modelId: payload.modelId,
        modelLabel: pricing.label,
        response: aiResponse,
        costCents: pricing.costCents,
        balanceCents: newBalance,
      },
    };
  }

  static async deduct(request: Request, payload: { modelId: string }) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const pricing = MarketplaceModel.MODEL_PRICING[payload.modelId];
    if (!pricing) {
      return {
        statusCode: 400,
        body: { error: "unknown_model", message: "Model not found." },
      };
    }

    const balanceCents = await CreditsService.computeBalanceCents(auth.user.id);
    if (balanceCents < pricing.costCents) {
      return {
        statusCode: 402,
        body: {
          error: "insufficient_balance",
          message: `Insufficient credits. You have $${(balanceCents / 100).toFixed(2)} but this request costs $${(pricing.costCents / 100).toFixed(2)}.`,
          balanceCents,
          costCents: pricing.costCents,
        },
      };
    }

    if (pricing.costCents > 0) {
      const timestamp = TimeService.nowIso();
      await db.insert(creditLedger).values({
        id: newId("ledger"),
        userId: auth.user.id,
        direction: "debit",
        amountCents: pricing.costCents,
        source: "marketplace_run",
        referenceId: `${payload.modelId}`,
        createdAt: timestamp,
      });
    }

    const newBalance = await CreditsService.computeBalanceCents(auth.user.id);
    return {
      statusCode: 200,
      body: { balanceCents: newBalance, costCents: pricing.costCents },
    };
  }

  static async balance(request: Request) {
    const auth = await AuthContextService.getAuthenticatedUser(request);
    if (!auth) {
      return { statusCode: 401, body: { error: "unauthorized" } };
    }

    const balanceCents = await CreditsService.computeBalanceCents(auth.user.id);
    return { statusCode: 200, body: { balanceCents } };
  }
}

// ─── LLM Caller ─────────────────────────────────────────────────────────────

async function callLLM(modelId: string, prompt: string): Promise<string> {
  // Try real API keys from env first
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (modelId === "google-gemini-flash" && geminiKey) {
    console.log("Calling Gemini API...");
    console.log(geminiKey);
    console.log(prompt);
    return callGemini(geminiKey, prompt);
  }

  if (modelId === "openai-gpt-4o-mini" && openaiKey) {
    return callOpenAI(openaiKey, "gpt-4o-mini", prompt);
  }

  if (modelId === "claude-3-opus" && openaiKey) {
    // Fall back to OpenAI for claude-3-opus in demo mode
    return callOpenAI(openaiKey, "gpt-4o-mini", prompt);
  }

  // If we have at least one key, use it as fallback for any model
  if (geminiKey) {
    return callGemini(geminiKey, prompt);
  }
  if (openaiKey) {
    return callOpenAI(openaiKey, "gpt-4o-mini", prompt);
  }

  // No API keys configured — return a simulated response
  return simulateLLMResponse(modelId, prompt);
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response generated."
  );
}

async function callOpenAI(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "No response generated.";
}

function simulateLLMResponse(modelId: string, prompt: string): string {
  const label = MarketplaceModel.MODEL_PRICING[modelId]?.label ?? modelId;
  return `[Simulated response from ${label}]\n\nYou asked: "${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}"\n\nThis is a demo response. Configure GEMINI_API_KEY or OPENAI_API_KEY in your API .env file to get real AI responses.\n\nThe credit deduction has been applied to your wallet.`;
}
