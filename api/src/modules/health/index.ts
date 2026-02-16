import { Elysia } from "elysia";

export const healthModule = new Elysia({ name: "module.health" }).get("/health", () => ({
  status: "ok",
  service: "x402-api",
}));
