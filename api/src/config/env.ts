import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.url(),
  BETTER_AUTH_URL: z.url().default("http://localhost:3001"),
  DASHBOARD_ORIGIN: z.url().default("http://localhost:3000"),
  BETTER_AUTH_SECRET: z.string().min(32),
  SOLANA_RPC_URL: z.url().default("https://api.devnet.solana.com"),
});

export const env = envSchema.parse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL ?? process.env.BETTER_AUTH_DATABASE_URL,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  DASHBOARD_ORIGIN: process.env.DASHBOARD_ORIGIN,
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ??
    "dev-only-better-auth-secret-change-me-32-plus-characters",
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
});
