import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

const MODEL_PRICING: Record<string, number> = {
  "google-gemini-flash": 2,
  "openai-gpt-4o-mini": 3,
  "claude-3-opus": 5,
  "meta-llama-3.1": 0,
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

  if (!(modelId in MODEL_PRICING)) {
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
  const cost = MODEL_PRICING[modelId];

  if (balanceCents < cost) {
    return Response.json(
      {
        error: "insufficient_balance",
        message: `Insufficient credits. You need $${(cost / 100).toFixed(2)} but have $${(balanceCents / 100).toFixed(2)}.`,
        balanceCents,
        costCents: cost,
      },
      { status: 402 }
    );
  }

  // ── 2. Deduct credits via backend ─────────────────────────────────────
  if (cost > 0) {
    const deductRes = await backendFetch("/v1/marketplace/deduct", cookie, {
      method: "POST",
      body: JSON.stringify({ modelId }),
    });

    if (!deductRes.ok) {
      const data = await deductRes.json();
      return Response.json(data, { status: deductRes.status });
    }
  }

  // ── 3. Stream the LLM response ────────────────────────────────────────
  const model = resolveModel(modelId);

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model,
    messages: modelMessages,
    maxOutputTokens: 1024,
  });

  return result.toUIMessageStreamResponse();
}

function resolveModel(modelId: string) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (modelId === "google-gemini-flash" && geminiKey) {
    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    return google("gemini-2.0-flash");
  }

  if (
    (modelId === "openai-gpt-4o-mini" || modelId === "claude-3-opus") &&
    openaiKey
  ) {
    const openai = createOpenAI({ apiKey: openaiKey });
    return openai("gpt-4o-mini");
  }

  if (geminiKey) {
    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    return google("gemini-2.0-flash");
  }

  if (openaiKey) {
    const openai = createOpenAI({ apiKey: openaiKey });
    return openai("gpt-4o-mini");
  }

  // No keys configured
  const google = createGoogleGenerativeAI({ apiKey: "not-configured" });
  return google("gemini-2.0-flash");
}
