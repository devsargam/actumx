import { Elysia } from "elysia";

import { getZodErrorMessage, ZOD_VALIDATION_ERROR } from "../../lib/zod-validation";
import { X402Model } from "./model";
import { X402Service } from "./service";
import { GatewayService } from "./gateway.service";

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
  .all("/x402/pay/:linkId", async ({ request, params, set }) => {
    const result = await GatewayService.handlePaymentLink(request, params.linkId);
    set.status = result.statusCode;
    return result.body;
  })
  .all("/x402/purchase/:serviceId/*", async ({ request, params, set }) => {
    const serviceId = params.serviceId;
    const wildcardPath = (params as Record<string, string>)["*"] ?? "";
    const path = "/" + wildcardPath;
    const result = await GatewayService.handleGatewayRequest(request, serviceId, path);
    set.status = result.statusCode;
    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        set.headers[key] = value;
      }
    }
    return result.body;
  })
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
