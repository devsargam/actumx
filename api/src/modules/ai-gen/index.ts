import { Elysia } from "elysia";

import { env } from "../../config/env";
import { getZodErrorMessage, ZOD_VALIDATION_ERROR } from "../../lib/zod-validation";
import { MarketplaceModel } from "../marketplace/model";
import { MarketplaceService } from "../marketplace/service";
import { AiGenModel } from "./model";

const IS_PROD = env.DASHBOARD_ORIGIN.includes("actumx.app");

const getBaseUrl = () =>
  IS_PROD ? "https://api.actumx.app" : `http://localhost:${env.PORT}`;

const getAppUrl = () =>
  IS_PROD ? "https://actumx.app" : env.DASHBOARD_ORIGIN;

function buildSkillMd(baseUrl: string, appUrl: string): string {
  const models = Object.entries(MarketplaceModel.MODELS).map(
    ([id, { costCents, label }]) => ({
      id,
      label,
      price: `$${(costCents / 100).toFixed(2)}/req`,
    })
  );

  const modelsTable = models
    .map((m) => `| ${m.id} | ${m.price} | ${m.label} |`)
    .join("\n");

  return `# ACTUMx AI Generation Service

## Base URL

\`\`\`
${baseUrl}
\`\`\`

## Skill

${appUrl}/skill.md

## Invoke Endpoint

\`\`\`
POST ${baseUrl}/api/service/ai-gen/api/invoke
Content-Type: application/json
x-api-key: xk_live_...
\`\`\`

### Request Body

\`\`\`json
{
  "action": "run",
  "modelId": "google/gemini-2.0-flash",
  "prompt": "Explain quantum computing in one paragraph."
}
\`\`\`

**Actions:**
- \`run\` — text generation using any model
- \`imagine\` — image generation (uses google/gemini-3-pro-image)

### Available Models

| Model ID | Price | Label |
|----------|-------|-------|
${modelsTable}

## Authentication

Include your API key as a header:

\`\`\`
x-api-key: xk_live_...
\`\`\`

Or as a Bearer token:

\`\`\`
Authorization: Bearer xk_live_...
\`\`\`

Get your API key by onboarding at ${appUrl}/skill.md
`;
}

export const aiGenModule = new Elysia({
  name: "module.ai-gen",
  prefix: "/api/service/ai-gen",
})
  .get("/skill.md", () => {
    const baseUrl = getBaseUrl();
    const appUrl = getAppUrl();
    return new Response(buildSkillMd(baseUrl, appUrl), {
      headers: { "Content-Type": "text/markdown" },
    });
  })
  .post("/api/invoke", async ({ request, body, set }) => {
    const parsed = AiGenModel.invokeBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        error: ZOD_VALIDATION_ERROR,
        message: getZodErrorMessage(parsed.error),
      };
    }

    const { action, modelId, prompt } = parsed.data;

    if (action === "imagine") {
      const result = await MarketplaceService.imagine(request, { prompt });
      set.status = result.statusCode;
      return result.body;
    }

    // action === "run"
    const result = await MarketplaceService.run(request, {
      modelId: modelId as MarketplaceModel.ModelId,
      prompt,
    });
    set.status = result.statusCode;
    return result.body;
  });
