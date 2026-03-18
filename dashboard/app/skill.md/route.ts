import { env } from "@/lib/env";

const getBaseUrl = () =>
  env.NODE_ENV === "production"
    ? "https://api.actumx.app"
    : "http://localhost:3001";

interface ModelEntry {
  id: string;
  label: string;
  costCents: number;
  price: string;
}

async function fetchModels(baseUrl: string): Promise<ModelEntry[]> {
  try {
    const res = await fetch(`${baseUrl}/v1/marketplace/models`);
    if (!res.ok) return [];
    const data = (await res.json()) as { models: ModelEntry[] };
    return data.models;
  } catch {
    return [];
  }
}

function buildModelsTable(models: ModelEntry[]): string {
  if (models.length === 0) {
    return `Fetch the list dynamically:\n\n\`\`\`\nGET /v1/marketplace/models\n\`\`\``;
  }

  const header = "| Model ID | Price | Label |\n|----------|-------|-------|";
  const rows = models
    .map((m) => `| ${m.id} | ${m.price} | ${m.label} |`)
    .join("\n");
  return `${header}\n${rows}`;
}

const buildSkillMd = (baseUrl: string, modelsTable: string) => `# ACTUMx Agent Onboarding

Register your AI agent and get an API key to use tools on ACTUMx.

## Base URL

\`\`\`
${baseUrl}
\`\`\`

## Step 1: Request an OTP

Send your email to receive a one-time password.

\`\`\`
POST ${baseUrl}/v1/onboard/otp/request
Content-Type: application/json

{
  "email": "agent@example.com"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "OTP sent to your email."
}
\`\`\`

The OTP is valid for 5 minutes.

## Step 2: Verify OTP and get API key

Submit the OTP you received to get your API key.

\`\`\`
POST ${baseUrl}/v1/onboard/otp/verify
Content-Type: application/json

{
  "email": "agent@example.com",
  "otp": "A1B2C3"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "apiKey": "xk_live_...",
  "keyPrefix": "xk_live_abcdef",
  "userId": "usr_...",
  "isNewUser": true,
  "message": "Welcome! Your account has been created with $1.00 free credits."
}
\`\`\`

Store the \`apiKey\` — it is shown only once.

New accounts receive $1.00 in free credits automatically.

## Step 3: Use your API key

Include the API key in all subsequent requests:

\`\`\`
x-api-key: xk_live_...
\`\`\`

Or as a Bearer token:

\`\`\`
Authorization: Bearer xk_live_...
\`\`\`

## Available models

All models are served via OpenRouter.

${modelsTable}

## Step 4: Run a model

Send a prompt to any model. Pass your API key as the \`x-api-key\` header. That's it.

\`\`\`
POST ${baseUrl}/v1/marketplace/run
Content-Type: application/json
x-api-key: xk_live_...

{
  "modelId": "google/gemini-2.0-flash",
  "prompt": "Explain quantum computing in one paragraph."
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "modelId": "google/gemini-2.0-flash",
  "modelLabel": "Google Gemini 2.0 Flash",
  "response": "Quantum computing uses qubits that can exist in superposition...",
  "costCents": 2,
  "balanceCents": 98
}
\`\`\`

Credits are deducted automatically after a successful response.

## Step 5: Generate an image

Use the \`/v1/marketplace/imagine\` endpoint to generate images. Pass your API key and a prompt.

\`\`\`
POST ${baseUrl}/v1/marketplace/imagine
Content-Type: application/json
x-api-key: xk_live_...

{
  "prompt": "A beautiful sunset over mountains"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "modelId": "google/gemini-3-pro-image",
  "modelLabel": "Gemini 3 Pro Image",
  "text": "Here is a beautiful sunset over mountains.",
  "images": ["data:image/png;base64,iVBOR..."],
  "costCents": 5,
  "balanceCents": 93
}
\`\`\`

The \`images\` array contains base64 data URLs. Costs $0.05 per request.

## Check balance

\`\`\`
GET ${baseUrl}/v1/marketplace/balance
x-api-key: xk_live_...
\`\`\`

**Response (200):**
\`\`\`json
{
  "balanceCents": 98
}
\`\`\`

## List models

\`\`\`
GET ${baseUrl}/v1/marketplace/models
\`\`\`

No auth required. Returns all available models with pricing.

**Response (200):**
\`\`\`json
{
  "models": [
    { "id": "google/gemini-2.0-flash", "label": "Google Gemini 2.0 Flash", "costCents": 2, "price": "$0.02/req" },
    ...
  ]
}
\`\`\`

## Errors

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | \`invalid_email\` | Email format is invalid |
| 400 | \`unknown_model\` | Model ID not found |
| 400 | \`no_otp\` | No OTP found, request a new one |
| 400 | \`otp_expired\` | OTP expired, request a new one |
| 400 | \`invalid_otp\` | Wrong OTP code |
| 401 | \`unauthorized\` | Missing or invalid API key |
| 402 | \`insufficient_balance\` | Not enough credits |
| 502 | \`llm_error\` | Upstream model error |
`;

export const dynamic = "force-dynamic";

export const GET = async () => {
  const baseUrl = getBaseUrl();
  const models = await fetchModels(baseUrl);
  const modelsTable = buildModelsTable(models);
  return new Response(buildSkillMd(baseUrl, modelsTable), {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
};
