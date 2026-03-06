import { Elysia } from "elysia";

import { getZodErrorMessage, ZOD_VALIDATION_ERROR } from "../../lib/zod-validation";
import { BillingModel } from "./model";
import { BillingService } from "./service";

export const billingModule = new Elysia({
  name: "module.billing",
  prefix: "/v1/billing",
})
  .get("/summary", async ({ request, set }) => {
    const result = await BillingService.summary(request);
    set.status = result.statusCode;
    return result.body;
  })
  .post(
    "/top-up",
    async ({ request, body, set }) => {
      const parsedBody = BillingModel.topUpBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await BillingService.topUp(request, parsedBody.data);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .get("/payment-intents", async ({ request, set }) => {
    const result = await BillingService.paymentIntents(request);
    set.status = result.statusCode;
    return result.body;
  });
