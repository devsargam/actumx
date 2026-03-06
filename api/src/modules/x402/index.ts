import { Elysia } from "elysia";

import { getZodErrorMessage, ZOD_VALIDATION_ERROR } from "../../lib/zod-validation";
import { X402Model } from "./model";
import { X402Service } from "./service";

export const x402Module = new Elysia({ name: "module.x402" })
  .get("/mcp", async ({ request, set }) => {
    const result = await X402Service.mcp(request);
    set.status = result.statusCode;
    if (result.body === undefined) {
      return new Response(null, { status: result.statusCode });
    }
    return result.body;
  })
  .post("/mcp", async ({ request, body, set }) => {
    const result = await X402Service.mcp(request, body);
    set.status = result.statusCode;
    if (result.body === undefined) {
      return new Response(null, { status: result.statusCode });
    }
    return result.body;
  })
  .post(
    "/v1/x402/settle",
    async ({ request, body, set }) => {
      const parsedBody = X402Model.settleBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await X402Service.settle(request, parsedBody.data);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .get("/v1/protected/quote", async ({ request, query, set }) => {
    const parsedQuery = X402Model.quoteQuerySchema.safeParse(query);
    if (!parsedQuery.success) {
      set.status = 400;
      return {
        error: ZOD_VALIDATION_ERROR,
        message: getZodErrorMessage(parsedQuery.error),
      };
    }

    const result = await X402Service.quote(request, parsedQuery.data);
    set.status = result.statusCode;
    return result.body;
  });
