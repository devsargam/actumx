# x402 Monorepo

This repository contains a small full-stack project for experimenting with an x402-style paid API flow.

At a high level:

- `api/` is the backend (Elysia + Bun + Drizzle + Postgres)
- `dashboard/` is the frontend (Next.js App Router + shadcn/ui)

The dashboard is where you create/manage agents and keys, and the API provides auth, billing-ish flows, API key issuance, and x402-related endpoints.

## Project Structure

```text
x402/
├── api/        # Elysia server, DB schema/migrations, auth, x402 modules
└── dashboard/  # Next.js dashboard UI
```

## Prerequisites

- [Bun](https://bun.sh/) for the API
- [pnpm](https://pnpm.io/) for the dashboard
- Postgres running locally (or a reachable Postgres instance)

## Quick Start

### 1) Start the API

```bash
cd api
cp .env.example .env
bun install
bun run dev
```

By default the API runs on `http://localhost:3001`.

Useful API scripts:

- `bun run dev` - run with watch mode
- `bun run start` - run once
- `bun run check` - type-check
- `bun run db:generate` - generate Drizzle migrations
- `bun run db:migrate` - run migrations
- `bun run db:reset` - reset and re-run migrations

### 2) Start the Dashboard

```bash
cd dashboard
cp .env.example .env.local
pnpm install
pnpm dev
```

By default the dashboard runs on `http://localhost:3000`.
