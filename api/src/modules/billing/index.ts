import { Elysia } from "elysia";

import { BillingModel } from "./model";
import { BillingService } from "./service";

export const billingModule = new Elysia({ name: "module.billing", prefix: "/v1/billing" })
  .get("/summary", async ({ request, set }) => {
    const result = await BillingService.summary(request);
    set.status = result.statusCode;
    return result.body;
  })
  .post(
    "/top-up",
    async ({ request, body, set }) => {
      const result = await BillingService.topUp(request, body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: BillingModel.topUpBody }
  )
  .get("/payment-intents", async ({ request, set }) => {
    const result = await BillingService.paymentIntents(request);
    set.status = result.statusCode;
    return result.body;
  });
