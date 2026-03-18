import { Elysia } from "elysia";

import { getZodErrorMessage, ZOD_VALIDATION_ERROR } from "../../lib/zod-validation";
import { MarketplaceModel } from "./model";
import { MarketplaceService } from "./service";

export const marketplaceModule = new Elysia({
  name: "module.marketplace",
  prefix: "/v1/marketplace",
})
  .post("/run", async ({ request, body, set }) => {
    const parsedBody = MarketplaceModel.runBodySchema.safeParse(body);
    if (!parsedBody.success) {
      set.status = 400;
      return {
        error: ZOD_VALIDATION_ERROR,
        message: getZodErrorMessage(parsedBody.error),
      };
    }

    const result = await MarketplaceService.run(request, parsedBody.data);
    set.status = result.statusCode;
    return result.body;
  })
  .post("/deduct", async ({ request, body, set }) => {
    const parsed = MarketplaceModel.deductBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { error: ZOD_VALIDATION_ERROR, message: getZodErrorMessage(parsed.error) };
    }
    const result = await MarketplaceService.deduct(request, parsed.data);
    set.status = result.statusCode;
    return result.body;
  })
  .get("/balance", async ({ request, set }) => {
    const result = await MarketplaceService.balance(request);
    set.status = result.statusCode;
    return result.body;
  })
  .post("/imagine", async ({ request, body, set }) => {
    const parsed = MarketplaceModel.imagineBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { error: ZOD_VALIDATION_ERROR, message: getZodErrorMessage(parsed.error) };
    }
    const result = await MarketplaceService.imagine(request, parsed.data);
    set.status = result.statusCode;
    return result.body;
  })
  .get("/models", () => {
    const models = Object.entries(MarketplaceModel.MODELS).map(
      ([id, { costCents, label }]) => ({
        id,
        label,
        costCents,
        price: costCents === 0 ? "Free" : `$${(costCents / 100).toFixed(2)}/req`,
      })
    );
    return { models };
  });
