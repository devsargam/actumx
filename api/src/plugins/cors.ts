import { cors } from "@elysiajs/cors";

export const corsPlugin = cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "x-payment-id", "x-payment-proof"],
});
