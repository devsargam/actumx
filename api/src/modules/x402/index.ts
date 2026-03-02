import { Elysia } from "elysia";

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
      const result = await X402Service.settle(request, body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: X402Model.settleBody }
  )
  .get("/v1/protected/quote", async ({ request, query, set }) => {
    const result = await X402Service.quote(request, query);
    set.status = result.statusCode;
    return result.body;
  });
