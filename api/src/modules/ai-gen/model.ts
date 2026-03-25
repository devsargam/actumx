import { z } from "zod";
import { MarketplaceModel } from "../marketplace/model";

const MODEL_IDS = Object.keys(MarketplaceModel.MODELS) as [
  MarketplaceModel.ModelId,
  ...MarketplaceModel.ModelId[],
];

export namespace AiGenModel {
  export const invokeBodySchema = z.object({
    action: z.enum(["run", "imagine"]),
    modelId: z.enum(MODEL_IDS).optional(),
    prompt: z.string().min(1).max(4000),
  });

  export type InvokeBody = z.infer<typeof invokeBodySchema>;
}
