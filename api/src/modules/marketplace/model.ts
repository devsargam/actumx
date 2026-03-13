import { z } from "zod";

export namespace MarketplaceModel {
  export const runBodySchema = z.object({
    modelId: z.enum(["google-gemini-flash", "openai-gpt-4o-mini", "claude-3-opus", "meta-llama-3.1"]),
    prompt: z.string().min(1).max(4000),
  });

  export type RunBody = z.infer<typeof runBodySchema>;

  export const deductBodySchema = z.object({
    modelId: z.enum(["google-gemini-flash", "openai-gpt-4o-mini", "claude-3-opus", "meta-llama-3.1"]),
  });

  export type DeductBody = z.infer<typeof deductBodySchema>;

  /** Pricing in cents per request */
  export const MODEL_PRICING: Record<string, { costCents: number; label: string }> = {
    "google-gemini-flash": { costCents: 2, label: "google/veo-3.1" },
    "openai-gpt-4o-mini": { costCents: 3, label: "openai/sora-v1" },
    "claude-3-opus": { costCents: 5, label: "claude-3-opus" },
    "meta-llama-3.1": { costCents: 0, label: "meta/llama-3.1" },
  };
}
