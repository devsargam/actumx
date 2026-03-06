import { Elysia } from "elysia";

import { getZodErrorMessage, ZOD_VALIDATION_ERROR } from "../../lib/zod-validation";
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
      const parsedBody = ApiKeysModel.createApiKeyBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await ApiKeysService.create(request, parsedBody.data);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .delete("/:id", async ({ request, params, set }) => {
    const parsedParams = ApiKeysModel.idParamsSchema.safeParse(params);
    if (!parsedParams.success) {
      set.status = 400;
      return {
        error: ZOD_VALIDATION_ERROR,
        message: getZodErrorMessage(parsedParams.error),
      };
    }

    const result = await ApiKeysService.revoke(request, parsedParams.data.id);
    set.status = result.statusCode;
    return result.body;
  });
