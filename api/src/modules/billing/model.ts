import { z } from "zod";

export namespace BillingModel {
  export const topUpBodySchema = z.object({
    amountCents: z.number().int().min(100).max(100000),
  });

  export type TopUpBody = z.infer<typeof topUpBodySchema>;
}
