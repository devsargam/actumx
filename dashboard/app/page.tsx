import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 md:px-8 md:pb-24">
        <div className="rounded-md border border-zinc-800/90 bg-zinc-950">
          <div className="border-b border-zinc-900 py-2 text-center text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
            x402 payment relay for agent tools
          </div>

          <div className="flex items-center justify-between border-b border-zinc-900 px-3 py-3 text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase md:px-6">
            <div className="flex items-center gap-5">
              <span className="text-zinc-100">x402 Control Plane</span>
              <span>tools</span>
              <span>activity</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:block">dummy mode</span>
              <ThemeToggle />
            </div>
          </div>

          <section className="border-b border-zinc-900 px-3 py-14 md:px-8 md:py-20">
            <h1 className="mx-auto max-w-4xl text-center text-5xl font-semibold tracking-tight text-zinc-100 md:text-8xl">
              Make clients pay
              <br />
              for premium APIs
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-zinc-400 md:text-base">
              Issue API keys, collect credit top-ups, run x402
              challenge/settlement on behalf of integrations, and monitor usage
              in one place.
            </p>
            <div className="mx-auto mt-10 grid max-w-3xl gap-3 md:grid-cols-2">
              <Button
                asChild
                className="h-12 rounded-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              >
                <Link href="/login">Get Wallet Access</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-sm border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
              >
                <Link href="/overview">View Dashboard</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[11px] tracking-[0.12em] text-zinc-400 uppercase">
              <span>keys 167</span>
              <span>txs 2,488</span>
              <span>volume $4.61k</span>
              <span className="text-emerald-400">top-up settled 0.01 usdc</span>
            </div>
          </section>

          <section className="grid gap-10 border-b border-zinc-900 px-3 py-14 md:grid-cols-2 md:px-8 md:py-20">
            <div className="space-y-7">
              <div>
                <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">
                  Setup in one minute
                </p>
                <h2 className="mt-4 text-3xl leading-tight font-semibold md:text-4xl">
                  Maximize paid API throughput
                </h2>
              </div>
              <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
                <div className="mb-2 flex items-center gap-4 text-[11px] tracking-[0.12em] text-zinc-500 uppercase">
                  <span className="text-zinc-100">prompt</span>
                  <span>pnpm</span>
                  <span>bun</span>
                </div>
                <div className="flex items-center justify-between rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200">
                  <span className="truncate">
                    use x402 relay and settle request pi_23d82a
                  </span>
                  <span className="text-zinc-500">copy</span>
                </div>
              </div>
              <p className="max-w-md text-sm text-zinc-400">
                Works with existing clients and SDKs. You control pricing and
                policy while we handle the payment relay flow.
              </p>
            </div>

            <div className="space-y-8">
              <article className="space-y-2">
                <h3 className="text-2xl font-semibold text-zinc-100">
                  Same clients, now monetized
                </h3>
                <p className="text-zinc-400">
                  Keep your current integrations, add paid routes and x402
                  enforcement in minutes.
                </p>
              </article>
              <article className="space-y-2">
                <h3 className="text-2xl font-semibold text-zinc-100">
                  High quality paid tools
                </h3>
                <p className="text-zinc-400">
                  Bundle premium endpoints behind credits so free traffic never
                  starves paid users.
                </p>
              </article>
              <article className="space-y-2">
                <h3 className="text-2xl font-semibold text-zinc-100">
                  Policy controls
                </h3>
                <p className="text-zinc-400">
                  Set spend ceilings, per-key limits, and revoke compromised
                  keys instantly.
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-8 px-3 py-12 md:grid-cols-3 md:px-8 md:py-16">
            <div>
              <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">
                Works with
              </p>
              <p className="mt-3 text-sm text-zinc-300">
                Any HTTP client that can retry with proof headers.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                <div className="rounded-sm border border-zinc-800 bg-zinc-900/70 px-3 py-4 text-center text-xs tracking-[0.12em] text-zinc-400 uppercase">
                  OpenAPI
                </div>
                <div className="rounded-sm border border-zinc-800 bg-zinc-900/70 px-3 py-4 text-center text-xs tracking-[0.12em] text-zinc-400 uppercase">
                  Next.js
                </div>
                <div className="rounded-sm border border-zinc-800 bg-zinc-900/70 px-3 py-4 text-center text-xs tracking-[0.12em] text-zinc-400 uppercase">
                  Elysia
                </div>
                <div className="rounded-sm border border-zinc-800 bg-zinc-900/70 px-3 py-4 text-center text-xs tracking-[0.12em] text-zinc-400 uppercase">
                  Cursor
                </div>
                <div className="rounded-sm border border-zinc-800 bg-zinc-900/70 px-3 py-4 text-center text-xs tracking-[0.12em] text-zinc-400 uppercase">
                  Codex
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-zinc-900 px-3 py-12 md:px-8 md:py-16">
            <div className="mb-8">
              <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">
                Flow
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-zinc-100 md:text-4xl">
                Challenge and settlement lifecycle
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <article className="rounded-sm border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-[11px] tracking-[0.12em] text-zinc-500 uppercase">
                  Step 01
                </p>
                <h4 className="mt-2 text-lg font-semibold text-zinc-100">Key Issued</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Create scoped API keys per integration and revoke instantly when needed.
                </p>
              </article>
              <article className="rounded-sm border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-[11px] tracking-[0.12em] text-zinc-500 uppercase">
                  Step 02
                </p>
                <h4 className="mt-2 text-lg font-semibold text-zinc-100">402 Challenge</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Protected routes return payment requirements when proof headers are missing.
                </p>
              </article>
              <article className="rounded-sm border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-[11px] tracking-[0.12em] text-zinc-500 uppercase">
                  Step 03
                </p>
                <h4 className="mt-2 text-lg font-semibold text-zinc-100">Settle</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Relay settlement on behalf of clients and generate deterministic receipts.
                </p>
              </article>
              <article className="rounded-sm border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-[11px] tracking-[0.12em] text-zinc-500 uppercase">
                  Step 04
                </p>
                <h4 className="mt-2 text-lg font-semibold text-zinc-100">Track Usage</h4>
                <p className="mt-2 text-sm text-zinc-400">
                  Usage costs and transaction history are visible in one operational dashboard.
                </p>
              </article>
            </div>
          </section>

          <section className="border-t border-zinc-900 px-3 py-12 md:px-8 md:py-16">
            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-sm border border-zinc-800 bg-zinc-900/70 p-5">
                <p className="text-xs tracking-[0.16em] text-zinc-500 uppercase">
                  Security
                </p>
                <h4 className="mt-2 text-2xl font-semibold text-zinc-100">
                  Strict policy boundaries
                </h4>
                <p className="mt-3 text-sm text-zinc-400">
                  Configure spend limits, reject unknown keys, and enforce hard guardrails per endpoint.
                </p>
              </article>
              <article className="rounded-sm border border-zinc-800 bg-zinc-900/70 p-5">
                <p className="text-xs tracking-[0.16em] text-zinc-500 uppercase">
                  Reliability
                </p>
                <h4 className="mt-2 text-2xl font-semibold text-zinc-100">
                  One relational source of truth
                </h4>
                <p className="mt-3 text-sm text-zinc-400">
                  Auth, keys, billing, and x402 events live in one Postgres model for easier audits.
                </p>
              </article>
            </div>
          </section>

          <section className="border-t border-zinc-900 px-3 py-14 md:px-8 md:py-18">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">
                Ready to ship
              </p>
              <h3 className="mt-4 text-4xl leading-tight font-semibold text-zinc-100 md:text-6xl">
                Turn premium API traffic into measurable revenue
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400 md:text-base">
                Start in dummy mode, validate the payment lifecycle, and scale to production-grade monetization.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  className="h-11 rounded-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                >
                  <Link href="/login">Create Workspace</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-sm border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                >
                  <Link href="/overview">Explore Dashboard</Link>
                </Button>
              </div>
            </div>
          </section>

          <div className="border-t border-zinc-900 px-3 py-5 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
              <span>x402 control plane</span>
              <div className="flex items-center gap-4">
                <span>github</span>
                <span>telegram</span>
                <span>x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
