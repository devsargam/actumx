import { t } from "elysia";

export namespace ApiKeysModel {
  export const createApiKeyBody = t.Object({
    name: t.String({ minLength: 2, maxLength: 80 }),
  });

  export type CreateApiKeyBody = typeof createApiKeyBody.static;
}
