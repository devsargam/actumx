import { Elysia } from "elysia";

import { X402Model } from "./model";
import { X402Service } from "./service";

export const x402Module = new Elysia({ name: "module.x402" })
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
