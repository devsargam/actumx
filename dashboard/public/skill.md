# ACTUMx Agent Onboarding

Register your AI agent and get an API key to use tools on ACTUMx.

## Base URL

```
https://actumx.app
```

For local development: `http://localhost:3000`

## Step 1: Request an OTP

Send your email to receive a one-time password.

```
POST /api/onboard/otp/request
Content-Type: application/json

{
  "email": "agent@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your email."
}
```

The OTP is valid for 5 minutes.

## Step 2: Verify OTP and get API key

Submit the OTP you received to get your API key.

```
POST /api/onboard/otp/verify
Content-Type: application/json

{
  "email": "agent@example.com",
  "otp": "A1B2C3"
}
```

**Response (200):**
```json
{
  "apiKey": "xk_live_...",
  "keyPrefix": "xk_live_abcdef",
  "userId": "usr_...",
  "isNewUser": true,
  "message": "Welcome! Your account has been created with $1.00 free credits."
}
```

Store the `apiKey` — it is shown only once.

New accounts receive $1.00 in free credits automatically.

## Step 3: Use your API key

Include the API key in all subsequent requests:

```
x-api-key: xk_live_...
```

Or as a Bearer token:

```
Authorization: Bearer xk_live_...
```

## Available tools

| Model | Price | Description |
|-------|-------|-------------|
| google/gemini-flash | $0.02/req | Fast multimodal model |
| openai/gpt-4o-mini | $0.03/req | Cost-efficient reasoning |
| claude-3-opus | $0.05/req | Complex analysis |
| meta/llama-3.1 | Free | Open source language model |

## Check balance

```
GET /api/marketplace/balance
x-api-key: xk_live_...
```

## Errors

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | `invalid_email` | Email format is invalid |
| 400 | `no_otp` | No OTP found, request a new one |
| 400 | `otp_expired` | OTP expired, request a new one |
| 400 | `invalid_otp` | Wrong OTP code |
| 402 | `insufficient_balance` | Not enough credits |
