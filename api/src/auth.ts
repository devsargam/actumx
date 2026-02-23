import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "./config/env";
import { authDb, authSchema } from "./db/auth-client";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: drizzleAdapter(authDb, {
    provider: "pg",
    schema: authSchema,
    camelCase: true,
  }),
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api",
  trustedOrigins: [env.BETTER_AUTH_URL, env.DASHBOARD_ORIGIN],
  secret: env.BETTER_AUTH_SECRET,
  ...(isProduction
    ? {
        advanced: {
          crossSubDomainCookies: {
            enabled: true,
            domain: ".actumx.app",
          },
          useSecureCookies: true,
        },
      }
    : {}),
  emailAndPassword: {
    enabled: true,
  },
});
