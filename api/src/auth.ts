import { betterAuth } from "better-auth";
import { Pool } from "pg";

const authDatabaseURL = process.env.BETTER_AUTH_DATABASE_URL;

if (!authDatabaseURL) {
  throw new Error("BETTER_AUTH_DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: authDatabaseURL,
});

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3001";
const dashboardOrigin = process.env.DASHBOARD_ORIGIN ?? "http://localhost:3000";

export const auth = betterAuth({
  database: pool,
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
