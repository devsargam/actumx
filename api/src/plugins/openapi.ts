import { openapi } from "@elysiajs/openapi";

export const openapiPlugin = openapi({
  path: "/openapi",
  documentation: {
    info: {
      title: "x402 API",
      version: "1.0.0",
      description:
        "API key issuance, dummy credit top-up, and x402-style challenge/settlement endpoints.",
    },
    tags: [
      { name: "Health", description: "Service status endpoints" },
      { name: "Auth", description: "Authentication and session endpoints" },
      { name: "Billing", description: "Credit top-up and balance endpoints" },
      { name: "API Keys", description: "API key lifecycle endpoints" },
      { name: "Agents", description: "Agent wallet lifecycle and balance endpoints" },
      { name: "Activity", description: "Transaction and usage history endpoints" },
      { name: "x402", description: "x402 settlement and protected paid endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        apiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
  },
});
