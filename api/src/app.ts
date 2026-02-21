import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { env } from "./config/env";
import { openapiPlugin } from "./plugins/openapi";
import { auth } from "./auth";
import { billingModule } from "./modules/billing";
import { apiKeysModule } from "./modules/api-keys";
import { agentsModule } from "./modules/agents";
import { activityModule } from "./modules/activity";
import { x402Module } from "./modules/x402";
import { healthModule } from "./modules/health";

export const app = new Elysia({ name: "x402.api" })
  .use(
    cors({
      origin: env.DASHBOARD_ORIGIN,
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
  .use(agentsModule)
  .use(activityModule)
  .use(x402Module);
