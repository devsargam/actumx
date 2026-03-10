import { z } from "zod";

export namespace ServicesModel {
  export const authMethodEnum = z.enum(["none", "bearer", "x-api-key"]);
  export const httpMethodEnum = z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "WEBSOCKET"]);

  export const createServiceBodySchema = z
    .object({
      name: z.string().trim().min(1).max(120),
      baseUrl: z.string().trim().url(),
      description: z.string().trim().max(500).optional(),
      faviconUrl: z.string().trim().url().optional(),
      websocketUrl: z.string().trim().url().optional(),
      authMethod: authMethodEnum,
      apiKey: z.string().trim().optional(),
      isLive: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.authMethod !== "none" && !data.apiKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "apiKey is required when authMethod is not 'none'",
          path: ["apiKey"],
        });
      }
    });

  export const updateServiceBodySchema = z
    .object({
      name: z.string().trim().min(1).max(120).optional(),
      baseUrl: z.string().trim().url().optional(),
      description: z.string().trim().max(500).nullable().optional(),
      faviconUrl: z.string().trim().url().nullable().optional(),
      websocketUrl: z.string().trim().url().nullable().optional(),
      authMethod: authMethodEnum.optional(),
      apiKey: z.string().trim().nullable().optional(),
      isLive: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.authMethod && data.authMethod !== "none" && data.apiKey === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "apiKey is required when authMethod is not 'none'",
          path: ["apiKey"],
        });
      }
    });

  export const serviceIdParamsSchema = z.object({
    serviceId: z.string().trim().min(1),
  });

  export const endpointIdParamsSchema = z.object({
    serviceId: z.string().trim().min(1),
    endpointId: z.string().trim().min(1),
  });

  export const createEndpointBodySchema = z.object({
    method: httpMethodEnum,
    path: z.string().trim().min(1).startsWith("/"),
    priceCents: z.number().int().min(0),
    isEnabled: z.boolean().optional(),
  });

  export const updateEndpointBodySchema = z.object({
    method: httpMethodEnum.optional(),
    path: z.string().trim().min(1).startsWith("/").optional(),
    priceCents: z.number().int().min(0).optional(),
    isEnabled: z.boolean().optional(),
  });

  export const importEndpointsBodySchema = z.union([
    z.object({ spec: z.string().min(1) }),
    z.object({ url: z.string().url() }),
  ]);

  export type CreateServiceBody = z.infer<typeof createServiceBodySchema>;
  export type UpdateServiceBody = z.infer<typeof updateServiceBodySchema>;
  export type ServiceIdParams = z.infer<typeof serviceIdParamsSchema>;
  export type EndpointIdParams = z.infer<typeof endpointIdParamsSchema>;
  export type CreateEndpointBody = z.infer<typeof createEndpointBodySchema>;
  export type UpdateEndpointBody = z.infer<typeof updateEndpointBodySchema>;
  export type ImportEndpointsBody = z.infer<typeof importEndpointsBodySchema>;
}
