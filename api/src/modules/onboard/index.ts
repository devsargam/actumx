import { Elysia } from "elysia";

import { OnboardService } from "./service";

export const onboardModule = new Elysia({
  name: "module.onboard",
  prefix: "/v1/onboard",
})
  .post("/otp/request", async ({ body, set }) => {
    const { email } = body as { email: string };
    const result = await OnboardService.requestOtp(email);
    set.status = result.statusCode;
    return result.body;
  })
  .post("/otp/verify", async ({ body, set }) => {
    const { email, otp } = body as { email: string; otp: string };
    const result = await OnboardService.verifyOtp(email, otp);
    set.status = result.statusCode;
    return result.body;
  });
