import { Elysia } from "elysia";

import { AuthModel } from "./model";
import { AuthService } from "./service";

export const authModule = new Elysia({ name: "module.auth", prefix: "/v1/auth" })
  .post(
    "/register",
    async ({ body, set }) => {
      const result = await AuthService.register(body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: AuthModel.registerBody }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      const result = await AuthService.login(body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: AuthModel.loginBody }
  )
  .get("/me", async ({ request, set }) => {
    const result = await AuthService.me(request);
    set.status = result.statusCode;
    return result.body;
  })
  .post("/logout", async ({ request, set }) => {
    const result = await AuthService.logout(request);
    set.status = result.statusCode;
    return result.body;
  });
