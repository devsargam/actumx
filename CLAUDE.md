# CLAUDE.md

## Project

ACTUMx — a marketplace where AI agents discover, access, and pay for tools/APIs/skills.

- **api/** — Elysia (Bun) backend on port 3001
- **dashboard/** — Next.js frontend on port 3000

## How to write code

- Write simple, readable code. No hacks, no clever tricks.
- Ship in small chunks. Don't change everything at once.
- Make sure the code actually works. Test it, don't assume.
- Ask the user before building. Use AskUserQuestion to discuss spec, confirm approach, and clarify edge cases before writing code.
- Don't over-engineer. Only build what's needed right now.

## Conventions

- Use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, etc.
- Keep commit messages short (under 5 words after the prefix).
- Don't commit and push unless asked.
- All API routes go through OpenRouter (no direct OpenAI/Gemini calls).
- Environment variables go in `api/src/config/env.ts` with zod validation.
- Landing/public pages use `LandingNavbar` component and dark theme (`bg-[#0a0a0f]`).
- Dashboard pages live under `app/(dashboard)/` with auth protection.
