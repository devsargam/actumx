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
- [Docker](https://www.docker.com/) for running Postgres
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (for local development)

### Start Postgres

```bash
docker run --name actumx-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=x402 -p 5432:5432 -d postgres:latest
```

This creates a database `x402` accessible at `postgres://postgres:postgres@localhost:5432/x402`.

Update your `api/.env` accordingly (see `.env.example`).

### Start Local Solana Validator

```bash
# Install Solana CLI if needed
brew install solana

# Start the local test validator
solana-test-validator
```

This runs a local Solana node on `http://localhost:8899` with unlimited test SOL. The validator files are stored in `test-ledger/` (added to `.gitignore`).

## Quick Start

### 1) Start the API

```bash
cd api
cp .env.example .env
bun install
bun run db:migrate
bun run dev
```

By default the API runs on `http://localhost:3001`.

Useful API scripts:

- `bun run dev` - run with watch mode
- `bun run dev:validator` - start local Solana validator only
- `bun run dev:all` - start validator + API together
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

## About

[actumx.app](https://actumx.app)
