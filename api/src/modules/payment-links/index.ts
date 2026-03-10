import { Elysia } from "elysia";

import { getZodErrorMessage, ZOD_VALIDATION_ERROR } from "../../lib/zod-validation";
import { PaymentLinksModel } from "./model";
import { PaymentLinksService } from "./service";

export const paymentLinksModule = new Elysia({ name: "module.payment-links", prefix: "/v1/payment-links" })
  .get("", async ({ request, set }) => {
    const result = await PaymentLinksService.list(request);
    set.status = result.statusCode;
    return result.body;
  })
  .post(
    "",
    async ({ request, body, set }) => {
      const parsedBody = PaymentLinksModel.createPaymentLinkBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await PaymentLinksService.create(request, parsedBody.data);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .delete(
    "/:linkId",
    async ({ request, params, set }) => {
      const parsedParams = PaymentLinksModel.linkIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const result = await PaymentLinksService.delete(request, parsedParams.data.linkId);
      set.status = result.statusCode;
      return result.body;
    }
  );
