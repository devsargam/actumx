import { z } from "zod";

export namespace ApiKeysModel {
  export const createApiKeyBodySchema = z.object({
    name: z.string().trim().min(2).max(80),
  });

  export const idParamsSchema = z.object({
    id: z.string().trim().min(1),
  });

  export type CreateApiKeyBody = z.infer<typeof createApiKeyBodySchema>;
  export type IdParams = z.infer<typeof idParamsSchema>;
}
