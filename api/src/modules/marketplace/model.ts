import { z } from "zod";

export namespace MarketplaceModel {
  /** OpenRouter model IDs mapped to our internal IDs */
  export const MODELS = {
    "google/gemini-2.0-flash": { costCents: 2, label: "Google Gemini 2.0 Flash", openRouterId: "google/gemini-2.0-flash-001" },
    "openai/gpt-4o-mini": { costCents: 3, label: "OpenAI GPT-4o Mini", openRouterId: "openai/gpt-4o-mini" },
    "anthropic/claude-3.5-sonnet": { costCents: 5, label: "Claude 3.5 Sonnet", openRouterId: "anthropic/claude-3.5-sonnet" },
    "meta-llama/llama-3.1-70b": { costCents: 1, label: "Meta Llama 3.1 70B", openRouterId: "meta-llama/llama-3.1-70b-instruct" },
    "mistralai/mistral-large": { costCents: 4, label: "Mistral Large", openRouterId: "mistralai/mistral-large-latest" },
    "deepseek/deepseek-chat": { costCents: 1, label: "DeepSeek Chat", openRouterId: "deepseek/deepseek-chat" },
    "openai/gpt-4o": { costCents: 8, label: "OpenAI GPT-4o", openRouterId: "openai/gpt-4o" },
    "anthropic/claude-3-opus": { costCents: 10, label: "Claude 3 Opus", openRouterId: "anthropic/claude-3-opus" },
    "google/gemini-pro-1.5": { costCents: 3, label: "Google Gemini Pro 1.5", openRouterId: "google/gemini-pro-1.5" },
    "qwen/qwen-2.5-72b": { costCents: 1, label: "Qwen 2.5 72B", openRouterId: "qwen/qwen-2.5-72b-instruct" },
    "google/gemini-3-pro-image": { costCents: 5, label: "Gemini 3 Pro Image", openRouterId: "google/gemini-3-pro-image-preview" },
  } as const satisfies Record<string, { costCents: number; label: string; openRouterId: string }>;

  export type ModelId = keyof typeof MODELS;

  const MODEL_IDS = Object.keys(MODELS) as [ModelId, ...ModelId[]];

  /** Pricing lookup (backwards-compatible) */
  export const MODEL_PRICING: Record<string, { costCents: number; label: string }> = MODELS;

  export const runBodySchema = z.object({
    modelId: z.enum(MODEL_IDS),
    prompt: z.string().min(1).max(4000),
  });

  export type RunBody = z.infer<typeof runBodySchema>;

  export const deductBodySchema = z.object({
    modelId: z.enum(MODEL_IDS),
  });

  export type DeductBody = z.infer<typeof deductBodySchema>;

  export const imagineBodySchema = z.object({
    prompt: z.string().min(1).max(4000),
  });

  export type ImagineBody = z.infer<typeof imagineBodySchema>;
}
