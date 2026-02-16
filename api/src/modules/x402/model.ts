import { t } from "elysia";

export namespace X402Model {
  export const settleBody = t.Object({
    paymentId: t.String({ minLength: 6 }),
  });

  export type SettleBody = typeof settleBody.static;
}
