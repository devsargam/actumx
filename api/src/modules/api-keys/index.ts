import { Elysia } from "elysia";

import { ApiKeysModel } from "./model";
import { ApiKeysService } from "./service";

export const apiKeysModule = new Elysia({ name: "module.api-keys", prefix: "/v1/api-keys" })
  .get("", async ({ request, set }) => {
    const result = await ApiKeysService.list(request);
    set.status = result.statusCode;
    return result.body;
  })
  .post(
    "",
    async ({ request, body, set }) => {
      const result = await ApiKeysService.create(request, body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: ApiKeysModel.createApiKeyBody }
  )
  .delete("/:id", async ({ request, params, set }) => {
    const result = await ApiKeysService.revoke(request, params.id);
    set.status = result.statusCode;
    return result.body;
  });
