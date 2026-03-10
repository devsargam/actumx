import { z } from "zod";

export namespace PaymentLinksModel {
  export const createPaymentLinkBodySchema = z.object({
    amountCents: z.number().int().min(1),
    description: z.string().trim().max(500).optional(),
    isReusable: z.boolean(),
  });

  export const linkIdParamsSchema = z.object({
    linkId: z.string().trim().min(1),
  });

  export type CreatePaymentLinkBody = z.infer<typeof createPaymentLinkBodySchema>;
  export type LinkIdParams = z.infer<typeof linkIdParamsSchema>;
}
