import { t } from "elysia";

export namespace BillingModel {
  export const topUpBody = t.Object({
    amountCents: t.Number({ minimum: 100 }),
  });

  export type TopUpBody = typeof topUpBody.static;
}
