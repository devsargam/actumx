import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { openapiPlugin } from "./plugins/openapi";
import { auth } from "./auth";
import { billingModule } from "./modules/billing";
import { apiKeysModule } from "./modules/api-keys";
import { activityModule } from "./modules/activity";
import { x402Module } from "./modules/x402";
import { healthModule } from "./modules/health";

export const app = new Elysia({ name: "x402.api" })
  .use(
    cors({
      origin: process.env.DASHBOARD_ORIGIN ?? "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "x-payment-id", "x-payment-proof"],
    })
  )
  .use(openapiPlugin)
  .mount("/auth", auth.handler)
  .use(healthModule)
  .use(billingModule)
  .use(apiKeysModule)
  .use(activityModule)
  .use(x402Module);
