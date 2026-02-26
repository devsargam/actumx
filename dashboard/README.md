# x402 Dashboard (Next.js + shadcn)

Frontend dashboard for managing API keys, dummy credit top-ups, and x402 transaction visibility.

## Stack
- Next.js (App Router)
- shadcn UI components
- Tailwind CSS

## Scripts
- `pnpm dev` - start development server
- `pnpm build` - production build
- `pnpm lint` - lint and type checks

## Setup
1. Copy env: `cp .env.example .env.local`
2. Install deps: `pnpm install`
3. Start: `pnpm dev`

Dashboard runs at `http://localhost:3000` by default.

## Engineering Notes
- React effects guidance: `docs/react-effects-playbook.md`
