import Link from "next/link";
import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-home-sans",
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-home-display",
  weight: ["300", "400", "500", "600", "700", "800"],
});

function DotPulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
    </span>
  );
}

function TinyBar({ className }: { className: string }) {
  return <div className={`h-2.5 w-full rounded-sm ${className}`} />;
}

export default function HomePage() {
  return (
    <main
      className={`${inter.variable} ${plusJakarta.variable} min-h-screen bg-white text-slate-800 [font-family:var(--font-home-sans)] selection:bg-[#4f6eff]/20`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(79,110,255,0.05)_1px,transparent_0)] [background-size:40px_40px]" />

      <nav className="relative z-20 flex w-full items-center px-6 py-6 md:px-8">
        <Link href="/" className="flex flex-1 items-center gap-2">
          <Image
            alt="ACTUM Logo"
            className="h-8 w-8 rounded-md object-contain"
            height={32}
            src="/logo.jpg"
            width={32}
          />

          <span className="text-2xl font-bold tracking-tight text-[#1a1c24] [font-family:var(--font-home-display)]">
            ACTUMx
          </span>
        </Link>

        <div className="hidden items-center gap-10 text-sm font-semibold text-slate-600 md:flex">
          <a className="transition-colors hover:text-[#4f6eff]" href="#">
            Wallet
          </a>
          <a className="transition-colors hover:text-[#4f6eff]" href="#">
            Gateway
          </a>
          <a className="transition-colors hover:text-[#4f6eff]" href="#">
            Agent Skill
          </a>
          <a
            className="transition-colors hover:text-[#4f6eff]"
            href="https://t.me/+IugCwFOqngplOGFl"
            rel="noopener noreferrer"
            target="_blank"
          >
            Contact
          </a>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <a
            aria-label="Follow ACTUMx on X"
            className="text-[#1a1c24] transition-opacity hover:opacity-70"
            href="https://x.com/intent/follow?screen_name=Actumx"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              fill="currentColor"
              height="28"
              viewBox="0 0 24 24"
              width="28"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <details className="relative ml-4 md:hidden">
            <summary className="list-none cursor-pointer text-[#1a1c24] [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Open menu</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </summary>

            <div className="absolute right-0 top-10 z-30 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <a className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                Wallet
              </a>
              <a className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                Gateway
              </a>
              <a className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" href="#">
                Agent Skill
              </a>
              <a
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                href="https://t.me/+IugCwFOqngplOGFl"
                rel="noopener noreferrer"
                target="_blank"
              >
                Contact
              </a>
            </div>
          </details>
        </div>
      </nav>

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-8 pt-20 text-center md:px-8 md:pt-24">
        {/* <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm">
          <DotPulse /> x402 infrastructure
        </div> */}

        <h1 className="mb-8 max-w-5xl text-5xl font-bold leading-[1.05] tracking-tighter text-[#1a1c24] md:text-[5.5rem] [font-family:var(--font-home-display)]">
          The Payment Rail for{" "}
          <span className="text-[#4f6eff]">Agentic AI.</span>
        </h1>

        <p className="mb-12 max-w-3xl text-lg leading-relaxed text-slate-500 md:text-xl">
          ACTUMx gives AI agents a native wallet to discover, pay, and transact
          across the internet without human intervention.
        </p>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <Link
            className="flex items-center gap-2 rounded-full bg-[#4f6eff] px-10 py-4 text-lg font-bold text-white shadow-lg shadow-[#4f6eff]/20 transition-all hover:-translate-y-0.5"
            href="/login"
          >
            Launch App →
          </Link>
          <Link
            className="rounded-full border border-slate-200 px-10 py-4 text-lg font-bold text-slate-400 transition-colors hover:bg-slate-50"
            href="/docs"
          >
            View Docs
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-12 md:px-8 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <div className="max-w-xl">
            <h2 className="mb-6 text-5xl font-bold leading-tight text-[#1a1c24] [font-family:var(--font-home-display)]">
              Give your agent <br />
              <span className="text-[#4f6eff]">a wallet.</span>
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-500">
              Let your AI autonomously pay for services, APIs, and compute. If
              an agent can call an endpoint, it can settle instantly with ACTUMx
              Wallet.
            </p>
            <Link href="/dashboard">
              <button
                className="flex items-center gap-2 rounded-full bg-[#4f6eff] px-6 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-[#4f6eff]/20"
                type="button"
              >
                Launch Wallet <span aria-hidden="true">→</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="rounded-3xl border border-[#eef2f6] bg-white p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  ACTUMX WALLET // AGENT ACCOUNT
                </h4>
                <h3 className="mt-1 text-2xl font-bold text-[#1a1c24]">
                  Peter&apos;s Agent Wallet
                </h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold uppercase text-green-600">
                  Auto-pay: Enabled
                </span>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <span className="text-sm font-medium text-slate-500">
                  Current Balance
                </span>
                <div className="mt-2 text-4xl font-bold text-[#1a1c24]">
                  $49.06
                </div>
                <div className="mt-4 flex h-8 items-end gap-1">
                  <TinyBar className="bg-[#4f6eff]/10" />
                  <TinyBar className="h-4 bg-[#4f6eff]/20" />
                  <TinyBar className="h-3 bg-[#4f6eff]/15" />
                  <TinyBar className="h-8 bg-[#4f6eff]" />
                  <TinyBar className="h-5 bg-[#4f6eff]/40" />
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <span className="text-sm font-medium text-slate-500">
                  Last Transaction
                </span>
                <div className="mt-2 text-xl font-bold text-[#1a1c24]">
                  -$1.00
                </div>
                <div className="mt-1 text-xs text-slate-400">WebScrape API</div>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold text-[#1a1c24]">
                Recent Payments
              </h4>
              <div className="space-y-2">
                {[
                  {
                    name: "WebScrape API",
                    amount: "$1.00",
                    tint: "bg-[#4f6eff]/10",
                    symbol: "◈",
                  },
                  {
                    name: "Midjourney",
                    amount: "$0.42",
                    tint: "bg-slate-200",
                    symbol: "◎",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs text-[#4f6eff] ${item.tint}`}
                      >
                        {item.symbol}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#1a1c24]">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl rounded-[3rem] bg-slate-50/50 px-6 py-14 md:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="order-2">
            <div className="max-w-xl">
              <h2 className="mb-6 text-5xl font-bold leading-tight text-[#1a1c24] [font-family:var(--font-home-display)]">
                Sell directly <br />
                <span className="text-[#4f6eff]">to agents.</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-500">
                Turn any API into a programmable revenue stream with x402
                payments. Onboard once, then earn from autonomous agent calls
                without manual billing.
              </p>
              <button
                className="flex items-center gap-2 rounded-full bg-[#4f6eff] px-6 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-[#4f6eff]/20"
                type="button"
              >
                Launch Gateway <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="order-1">
            <div className="overflow-hidden rounded-3xl border border-[#eef2f6] bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  </div>
                  <div className="ml-4 rounded-md border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] text-slate-500">
                    https://api.webscrape.dev/v1/scrape
                  </div>
                </div>
                <div className="rounded bg-[#4f6eff]/10 px-2 py-0.5 text-[10px] font-bold text-[#4f6eff]">
                  LIVE
                </div>
              </div>

              <div className="p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      API MONETIZATION
                    </h4>
                    <div className="mt-1 text-3xl font-bold text-[#1a1c24]">
                      $0.05{" "}
                      <span className="text-sm font-normal italic text-slate-400">
                        / req
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      REVENUE COUNTER
                    </h4>
                    <div className="mt-1 text-3xl font-bold tracking-tighter text-[#4f6eff]">
                      $1,284.45
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Recent Agent Requests
                  </h4>
                  {["Agent #576", "Agent #3301", "Agent #892"].map((agent) => (
                    <div
                      key={agent}
                      className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:border-[#4f6eff]/30"
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-[#1a1c24]">
                          {agent}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          /v1/scrape
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#4f6eff]">
                          $0.05
                        </span>
                        <span className="text-sm text-green-500">●</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <div className="mb-12">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            PROTOCOL
          </h4>
          <h2 className="text-5xl font-black uppercase text-[#1a1c24] [font-family:var(--font-home-display)] md:text-6xl">
            HOW IT <span className="text-[#4f6eff]">WORKS</span>
          </h2>
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] md:grid-cols-4">
          {[
            {
              title: "Agent Requests",
              body: "Agent calls your API endpoint normally.",
            },
            {
              title: "Server Returns 402",
              body: "Response includes price and payment details.",
            },
            {
              title: "Wallet Pays",
              body: "Agent wallet signs and sends payment.",
            },
            {
              title: "Access Granted",
              body: "API returns the paid response instantly.",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col gap-4 border-r border-slate-100 bg-white p-8 last:border-r-0"
            >
              <span className="text-sm font-bold text-[#4f6eff]">{`0${i + 1}`}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#4f6eff]">
                ■
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-[#1a1c24]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 md:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#4f6eff] p-12 text-center shadow-2xl shadow-[#4f6eff]/40 md:p-24">
          <h2 className="mb-6 text-5xl font-bold text-white [font-family:var(--font-home-display)] md:text-6xl">
            Activate Agent Commerce
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-white/90">
            Join the frontier of the agentic economy. Deploy in minutes.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              className="rounded-full bg-white px-10 py-4 text-lg font-bold text-[#4f6eff] shadow-xl transition-all hover:scale-105"
              href="/login"
            >
              Create Wallet →
            </Link>
            <button
              className="rounded-full border-2 border-white/40 bg-transparent px-10 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
              type="button"
            >
              List Your API
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-100 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:px-8">
          <div className="flex items-center gap-2">
            <Image
              alt="ACTUM Logo"
              className="h-8 w-8 rounded-md object-contain"
              height={32}
              src="/logo.jpg"
              width={32}
            />
            <span className="font-bold text-[#1a1c24] [font-family:var(--font-home-display)]">
              ACTUMx
            </span>
          </div>

          <div className="flex gap-8 text-sm font-semibold text-slate-400">
            <a className="transition-colors hover:text-[#4f6eff]" href="#">
              Terms
            </a>
            <a className="transition-colors hover:text-[#4f6eff]" href="#">
              Privacy
            </a>
          </div>

          <div className="text-sm font-medium text-slate-400">
            © 2026 ACTUMx. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
