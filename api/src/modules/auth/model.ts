import { t } from "elysia";

export namespace AuthModel {
  export const registerBody = t.Object({
    email: t.String({ minLength: 3 }),
    name: t.String({ minLength: 2 }),
  });

  export type RegisterBody = typeof registerBody.static;

  export const loginBody = t.Object({
    email: t.String({ minLength: 3 }),
  });

  export type LoginBody = typeof loginBody.static;
}
