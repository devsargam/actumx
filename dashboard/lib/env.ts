import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
});

const parsedEnv = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const mcpHost =
  parsedEnv.NODE_ENV === "development" ? "localhost:3001" : "api.actumx.app";
const mcpProtocol = parsedEnv.NODE_ENV === "development" ? "http" : "https";

const apiBase = `${mcpProtocol}://${mcpHost}`;

export const env = {
  ...parsedEnv,
  MCP_URL: `${apiBase}/mcp`,
  GATEWAY_BASE_URL: apiBase,
};
