import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.url(),
  BETTER_AUTH_URL: z.url().default("http://localhost:3001/auth/api/auth"),
  DASHBOARD_ORIGIN: z.url().default("http://localhost:3000"),
  BETTER_AUTH_SECRET: z.string().min(32),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  SOLANA_RPC_URL: z.url().default("https://api.devnet.solana.com"),
  OPENAI_API_KEY: z.string().min(1),
});

export const env = envSchema.parse({
  PORT: process.env.PORT,
  DATABASE_URL:
    process.env.DATABASE_URL ?? process.env.BETTER_AUTH_DATABASE_URL,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  DASHBOARD_ORIGIN: process.env.DASHBOARD_ORIGIN,
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ??
    "dev-only-better-auth-secret-change-me-32-plus-characters",
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});
