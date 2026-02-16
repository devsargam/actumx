import { Elysia } from "elysia";

import { ActivityService } from "./service";

export const activityModule = new Elysia({ name: "module.activity" })
  .get("/v1/transactions", async ({ request, set }) => {
    const result = await ActivityService.transactions(request);
    set.status = result.statusCode;
    return result.body;
  })
  .get("/v1/usage", async ({ request, set }) => {
    const result = await ActivityService.usage(request);
    set.status = result.statusCode;
    return result.body;
  });
