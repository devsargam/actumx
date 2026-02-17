import { defineConfig } from "drizzle-kit";

const url = process.env.BETTER_AUTH_DATABASE_URL;

if (!url) {
  throw new Error("BETTER_AUTH_DATABASE_URL is required");
}

export default defineConfig({
  schema: "./src/db/auth-schema.ts",
  out: "./drizzle/auth",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
  strict: true,
  verbose: true,
});
