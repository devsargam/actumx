import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db/client";
import * as schema from "./db/schema";

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3001";
const dashboardOrigin = process.env.DASHBOARD_ORIGIN ?? "http://localhost:3000";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  baseURL,
  basePath: "/api",
  trustedOrigins: [baseURL, dashboardOrigin],
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "dev-only-better-auth-secret-change-me-32-plus-characters",
  emailAndPassword: {
    enabled: true,
  },
});
