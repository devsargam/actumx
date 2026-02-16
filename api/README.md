# x402 API (Elysia + Bun)

Backend for a dummy x402-powered API monetization flow.

## Stack
- Bun runtime
- Elysia HTTP server
- Drizzle ORM
- SQLite database (`api/data/x402.sqlite`)

## Scripts
- `bun run dev` - start dev server (watch mode)
- `bun run start` - start server
- `bun run check` - TypeScript check

## Setup
1. Copy env: `cp .env.example .env`
2. Install deps: `bun install`
3. Start: `bun run dev`

Server runs at `http://localhost:3001` by default.

## Key Endpoints
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/billing/top-up`
- `POST /v1/api-keys`
- `GET /v1/protected/quote` (x402 challenge/paid endpoint)
- `POST /v1/x402/settle` (dummy settlement)
