import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";

/** Maps our model IDs to OpenRouter model IDs */
const MODELS: Record<string, { costCents: number; openRouterId: string }> = {
  "google/gemini-2.0-flash": { costCents: 2, openRouterId: "google/gemini-2.0-flash-001" },
  "openai/gpt-4o-mini": { costCents: 3, openRouterId: "openai/gpt-4o-mini" },
  "anthropic/claude-3.5-sonnet": { costCents: 5, openRouterId: "anthropic/claude-3.5-sonnet" },
  "meta-llama/llama-3.1-70b": { costCents: 1, openRouterId: "meta-llama/llama-3.1-70b-instruct" },
  "mistralai/mistral-large": { costCents: 4, openRouterId: "mistralai/mistral-large-latest" },
  "deepseek/deepseek-chat": { costCents: 1, openRouterId: "deepseek/deepseek-chat" },
  "openai/gpt-4o": { costCents: 8, openRouterId: "openai/gpt-4o" },
  "anthropic/claude-3-opus": { costCents: 10, openRouterId: "anthropic/claude-3-opus" },
  "google/gemini-pro-1.5": { costCents: 3, openRouterId: "google/gemini-pro-1.5" },
  "qwen/qwen-2.5-72b": { costCents: 1, openRouterId: "qwen/qwen-2.5-72b-instruct" },
  "google/gemini-3-pro-image": { costCents: 5, openRouterId: "google/gemini-3-pro-image-preview" },
};

async function backendFetch(path: string, cookie: string, init?: RequestInit) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      cookie,
      ...(init?.headers ?? {}),
    },
  });
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const body = await req.json();
  const { messages, modelId } = body as {
    messages: UIMessage[];
    modelId: string;
  };

  const modelConfig = MODELS[modelId];
  if (!modelConfig) {
    return Response.json({ error: "Unknown model." }, { status: 400 });
  }

  // ── 1. Check balance ──────────────────────────────────────────────────
  const balanceRes = await backendFetch("/v1/marketplace/balance", cookie);
  if (!balanceRes.ok) {
    return Response.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  const { balanceCents } = (await balanceRes.json()) as {
    balanceCents: number;
  };

  if (balanceCents < modelConfig.costCents) {
    return Response.json(
      {
        error: "insufficient_balance",
        message: `Insufficient credits. You need $${(modelConfig.costCents / 100).toFixed(2)} but have $${(balanceCents / 100).toFixed(2)}.`,
        balanceCents,
        costCents: modelConfig.costCents,
      },
      { status: 402 }
    );
  }

  // ── 2. Deduct credits via backend ─────────────────────────────────────
  if (modelConfig.costCents > 0) {
    const deductRes = await backendFetch("/v1/marketplace/deduct", cookie, {
      method: "POST",
      body: JSON.stringify({ modelId }),
    });

    if (!deductRes.ok) {
      const data = await deductRes.json();
      return Response.json(data, { status: deductRes.status });
    }
  }

  // ── 3. Stream via OpenRouter ──────────────────────────────────────────
  const openrouter = createOpenAI({
    apiKey: OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openrouter(modelConfig.openRouterId),
    messages: modelMessages,
    maxOutputTokens: 1024,
  });

  return result.toUIMessageStreamResponse();
}
