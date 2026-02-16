import { Elysia } from "elysia";

import { corsPlugin } from "./plugins/cors";
import { authModule } from "./modules/auth";
import { billingModule } from "./modules/billing";
import { apiKeysModule } from "./modules/api-keys";
import { activityModule } from "./modules/activity";
import { x402Module } from "./modules/x402";
import { healthModule } from "./modules/health";

export const app = new Elysia({ name: "x402.api" })
  .use(corsPlugin)
  .use(healthModule)
  .use(authModule)
  .use(billingModule)
  .use(apiKeysModule)
  .use(activityModule)
  .use(x402Module);
