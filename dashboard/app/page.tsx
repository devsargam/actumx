import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import {
  ArrowRight,
  CircleDollarSign,
  CreditCard,
  Monitor,
  ScanEye,
  Store,
  TrendingUp,
  TwitterIcon,
  Wallet,
  XIcon,
} from "lucide-react";
import Balancer from "react-wrap-balancer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

export default function HomePage() {
  return (
    <main
      className={`${spaceGrotesk.variable} min-h-screen bg-white dark:bg-[#141520] [font-family:var(--font-space)]`}
    >
      {/* Nav */}
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 md:px-8 md:py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            alt="ACTUMx Logo"
            className="rounded-lg object-contain"
            height={36}
            src="/logo.jpg"
            width={36}
          />
          <span className="text-2xl font-bold tracking-tight text-[#1a1c24]">
            {/* ACTUM<span className="font-normal">x</span> */}
          </span>
        </Link>

        <div className="hidden items-center gap-10 text-[15px] font-medium text-[#3a3d4a] dark:text-[#94a3b8] md:flex">
          <Link className="transition-colors hover:text-[#4f6eff]" href="#">
            Wallet
          </Link>
          <Link className="transition-colors hover:text-[#4f6eff]" href="#">
            Gateway
          </Link>
          <Link className="transition-colors hover:text-[#4f6eff]" href="#">
            Agent Skill
          </Link>
          <a
            className="transition-colors hover:text-[#4f6eff]"
            href="https://t.me/+IugCwFOqngplOGFl"
            rel="noopener noreferrer"
            target="_blank"
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <Separator decorative orientation="vertical" />
          <Button
            className="hidden md:inline-flex"
            variant="ghost"
            size="icon"
            asChild
          >
            <Link
              aria-label="Follow ACTUMx on X"
              href="https://x.com/intent/follow?screen_name=Actumx"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-[#1a1c24] fill-[#1a1c24] dark:text-white dark:fill-white"
              >
                <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
              </svg>
            </Link>
          </Button>

          {/* Mobile hamburger */}
          <details className="relative md:hidden">
            <summary className="list-none cursor-pointer text-[#1a1c24] dark:text-white [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Open menu</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </summary>

            <div className="absolute right-0 top-10 z-30 w-52 rounded-xl border border-[#eef0f4] dark:border-white/10 bg-white dark:bg-[#1e2030] p-2 shadow-lg">
              <Link
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#3a3d4a] dark:text-[#94a3b8] hover:bg-[#f8f9fb] dark:hover:bg-white/5"
                href="#"
              >
                Wallet
              </Link>
              <Link
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#3a3d4a] dark:text-[#94a3b8] hover:bg-[#f8f9fb] dark:hover:bg-white/5"
                href="#"
              >
                Gateway
              </Link>
              <Link
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#3a3d4a] dark:text-[#94a3b8] hover:bg-[#f8f9fb] dark:hover:bg-white/5"
                href="#"
              >
                Agent Skill
              </Link>
              <a
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#3a3d4a] dark:text-[#94a3b8] hover:bg-[#f8f9fb] dark:hover:bg-white/5"
                href="https://t.me/+IugCwFOqngplOGFl"
                rel="noopener noreferrer"
                target="_blank"
              >
                Contact
              </a>
              <div className="my-1 border-t border-[#eef0f4] dark:border-white/10" />
              <a
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#3a3d4a] dark:text-[#94a3b8] hover:bg-[#f8f9fb] dark:hover:bg-white/5"
                href="https://x.com/intent/follow?screen_name=Actumx"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5 fill-current"
                >
                  <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                </svg>
                Follow on X
              </a>
            </div>
          </details>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-5 pb-14 pt-16 text-center md:px-8 md:pb-20 md:pt-36">
        <h1 className="mb-6 text-3xl font-bold leading-[1.1] tracking-tight text-[#1a1c24] dark:text-white sm:text-4xl md:mb-8 md:text-7xl">
          <Balancer>
            The marketplace for the{" "}
            <span className="text-[#4f6eff]">agentic economy</span>
          </Balancer>
        </h1>

        <p className="mb-8 max-w-2xl text-base leading-relaxed text-[#7a7d8a] dark:text-[#94a3b8] md:mb-12 md:text-lg">
          <Balancer>
            AI agents can buy and sell skills. Businesses can monetize
            endpoints. ACTUMx brings together the wallet, gateway, and
            marketplace that power machine to machine commerce.
          </Balancer>
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="rounded-full flex items-center justify-center gap-x-3 bg-[#4f6eff] px-7 py-3 text-base font-semibold text-white transition-all hover:opacity-90 md:gap-x-4 md:px-10 md:py-4 md:text-lg"
            href="/dashboard"
          >
            Explore Marketplace <ArrowRight size={18} strokeWidth={2} />
          </Link>
          {/* TODO: To add for docs */}
          {/* <Link
            className="rounded-full border border-[#d9dbe1] px-10 py-4 text-lg font-medium text-[#7a7d8a] transition-colors hover:border-[#b0b3be] hover:text-[#3a3d4a]"
            href="/login"
          >
            Get an Agent Wallet
          </Link> */}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
        <h2 className="mb-3 text-center text-2xl font-bold tracking-tight text-[#1a1c24] dark:text-white sm:text-3xl md:mb-4 md:text-5xl">
          <Balancer>Everything needed to power agentic commerce</Balancer>
        </h2>

        <p className="mx-auto mb-10 text-center text-base text-[#7a7d8a] dark:text-[#94a3b8] md:mb-16 md:text-lg">
          <Balancer>
            ACTUMx brings together the three layers needed for autonomous
            digital trade.
          </Balancer>
        </p>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {[
            {
              icon: <Store size={24} strokeWidth={1.5} color="#4f6eff" />,
              title: "Marketplace",
              description:
                "The discovery layer where AI agents find, access, and buy skills, tools, and endpoints.",
            },
            {
              icon: <Wallet size={24} strokeWidth={1.5} color="#4f6eff" />,
              title: "Agent Wallet",
              description:
                "Purpose-built accounts that allow autonomous agents to hold capital and settle transactions instantly.",
            },
            {
              icon: (
                <CircleDollarSign size={24} strokeWidth={1.5} color="#4f6eff" />
              ),
              title: "Payment Gateway",
              description:
                "The infrastructure for businesses to monetize any API or endpoint for machine-to-machine commerce.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-2xl border border-[#eef0f4] dark:border-white/10 bg-[#f8f9fb] dark:bg-white/[0.03] p-6 md:gap-4 md:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef0f6] dark:bg-white/10 text-[#4f6eff]">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1a1c24] dark:text-white md:text-xl">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#7a7d8a] dark:text-[#94a3b8] md:text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="border-t border-[#eef0f4] dark:border-white/10 bg-[#f8f9fb] dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-14 md:gap-12 md:px-8 md:py-24 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold leading-[1.1] tracking-tight text-[#1a1c24] dark:text-white sm:text-3xl md:mb-6 md:text-5xl">
              The discovery layer{" "}
              <span className="text-[#4f6eff]">for AI agents.</span>
            </h2>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-[#7a7d8a] dark:text-[#94a3b8] md:mb-8 md:text-[15px]">
              A global marketplace where AI agents can find, access, and buy
              skills, tools, and endpoints. Enable your agent to find the exact
              capability it needs to complete its task autonomously.
            </p>
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-[#4f6eff] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 md:px-7 md:py-3"
              href="/dashboard"
            >
              Explore Marketplace &rarr;
            </Link>
          </div>

          {/* Marketplace mock card */}
          <div className="rounded-2xl border border-[#eef0f4] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm md:p-6">
            {/* Search bar */}
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#eef0f4] dark:border-white/10 bg-[#f8f9fb] dark:bg-white/[0.03] px-4 py-2.5 md:mb-5 md:py-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="text-sm text-[#b0b3be] dark:text-[#64748b]">
                Search for skills, tools, APIs...
              </span>
            </div>

            {/* Listing items */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-[#4f6eff]/20 bg-[#4f6eff]/[0.03] dark:bg-[#4f6eff]/[0.06] p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4f6eff] text-xs font-bold text-white md:h-10 md:w-10">
                    JS
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1c24] dark:text-white">
                      NodeJS Executor
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#7a7d8a] dark:text-[#64748b] md:text-[11px]">
                      Agent Skill
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-medium text-[#4f6eff] md:text-sm">
                  $0.02 / call
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#eef0f4] dark:border-white/10 p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef0f6] dark:bg-white/10 text-[#7a7d8a] dark:text-[#94a3b8] md:h-10 md:w-10">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1c24] dark:text-white">
                      PDF Parser
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#7a7d8a] dark:text-[#64748b] md:text-[11px]">
                      Utility
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-medium text-[#7a7d8a] dark:text-[#94a3b8] md:text-sm">
                  $0.01 / call
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Section */}
      <section className="border-t border-[#eef0f4] dark:border-white/10">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-14 md:gap-12 md:px-8 md:py-24 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold leading-[1.1] tracking-tight text-[#1a1c24] dark:text-white sm:text-3xl md:mb-6 md:text-5xl">
              Give your agent{" "}
              <span className="text-[#4f6eff]">an account.</span>
            </h2>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-[#7a7d8a] dark:text-[#94a3b8] md:mb-8 md:text-[15px]">
              Let your AI autonomously pay for services, APIs, and compute. If
              an agent can call an endpoint, it can settle instantly with ACTUMx
              Wallet.
            </p>
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-[#4f6eff] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 md:px-7 md:py-3"
              href="/dashboard"
            >
              Launch Wallet &rarr;
            </Link>
          </div>

          {/* Wallet mock card */}
          <div className="rounded-2xl border border-[#eef0f4] dark:border-white/10 bg-[#f8f9fb] dark:bg-white/[0.03] p-5 shadow-sm md:p-6">
            {/* Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#b0b3be] dark:text-[#64748b] md:text-[10px]">
                  ACTUMx Wallet // Agent Account
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#1a1c24] dark:text-white md:text-xl">
                  Eric&apos;s Agent Wallet
                </h3>
              </div>
              <div className="flex w-fit items-center gap-1.5 rounded-full border border-green-100 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[9px] font-bold uppercase text-green-600 dark:text-green-400 md:text-[10px]">
                  Auto-pay: Enabled
                </span>
              </div>
            </div>

            {/* Balance + Last Transaction */}
            <div className="mb-5 grid grid-cols-2 gap-3 md:mb-6 md:gap-4">
              <div className="rounded-xl border border-[#eef0f4] dark:border-white/10 bg-white dark:bg-black/25 p-4 md:p-5">
                <p className="text-[11px] font-medium text-[#7a7d8a] dark:text-[#94a3b8] md:text-xs">
                  Current Balance
                </p>
                <p className="mt-1.5 text-2xl font-bold text-[#1a1c24] dark:text-white md:mt-2 md:text-3xl">
                  $49.06
                </p>
                {/* Mini bar chart */}
                <div className="mt-3 flex h-5 items-end gap-1 md:mt-4 md:h-6">
                  <div className="h-2.5 w-full rounded-sm bg-[#4f6eff]/10" />
                  <div className="h-4 w-full rounded-sm bg-[#4f6eff]/20" />
                  <div className="h-3 w-full rounded-sm bg-[#4f6eff]/15" />
                  <div className="h-full w-full rounded-sm bg-[#4f6eff]" />
                  <div className="h-4 w-full rounded-sm bg-[#4f6eff]/30" />
                </div>
              </div>
              <div className="flex flex-col justify-center rounded-xl border border-[#eef0f4] dark:border-white/10 bg-white dark:bg-black/25 p-4 md:p-5">
                <p className="text-[11px] font-medium text-[#7a7d8a] dark:text-[#94a3b8] md:text-xs">
                  Last Transaction
                </p>
                <p className="mt-1.5 text-lg font-bold text-[#1a1c24] dark:text-white md:mt-2 md:text-xl">
                  -$1.00
                </p>
                <p className="mt-1 text-[11px] text-[#b0b3be] dark:text-[#64748b] md:text-xs">
                  WebScrape API
                </p>
              </div>
            </div>

            {/* Recent Payments */}
            <div>
              <h4 className="mb-2.5 text-sm font-bold text-[#1a1c24] dark:text-white md:mb-3">
                Recent Payments
              </h4>
              <div className="space-y-2">
                {[
                  { name: "WebScrape API", amount: "$1.00", symbol: "A" },
                  { name: "GPT-4o Inference", amount: "$0.42", symbol: "G" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl border border-[#eef0f4] dark:border-white/10 bg-white dark:bg-black/25 p-2.5 md:p-3"
                  >
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4f6eff]/10 text-[11px] font-bold text-[#4f6eff] md:h-8 md:w-8 md:text-xs">
                        {item.symbol}
                      </div>
                      <span className="text-sm font-semibold text-[#3a3d4a] dark:text-[#e2e8f0]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#1a1c24] dark:text-white md:text-sm">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gateway Section */}
      <section className="border-t border-[#eef0f4] dark:border-white/10 bg-[#f8f9fb] dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-14 md:gap-12 md:px-8 md:py-24 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold leading-[1.1] tracking-tight text-[#1a1c24] dark:text-white sm:text-3xl md:mb-6 md:text-5xl">
              Sell directly <span className="text-[#4f6eff]">to agents.</span>
            </h2>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-[#7a7d8a] dark:text-[#94a3b8] md:mb-8 md:text-[15px]">
              Turn any API into a programmable revenue stream with x402
              payments. Onboard once, then earn from autonomous agent calls
              without manual billing.
            </p>
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-[#4f6eff] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 md:px-7 md:py-3"
              href="/dashboard"
            >
              Launch Gateway &rarr;
            </Link>
          </div>

          {/* Gateway mock card */}
          <div className="overflow-hidden rounded-2xl border border-[#eef0f4] dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-sm">
            {/* Browser chrome */}
            <div className="flex items-center justify-between border-b border-[#eef0f4] dark:border-white/10 bg-[#f8f9fb] dark:bg-white/[0.03] px-4 py-2.5 md:px-5 md:py-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-[#d9dbe1] dark:bg-white/15 md:h-2.5 md:w-2.5" />
                  <div className="h-2 w-2 rounded-full bg-[#d9dbe1] dark:bg-white/15 md:h-2.5 md:w-2.5" />
                  <div className="h-2 w-2 rounded-full bg-[#d9dbe1] dark:bg-white/15 md:h-2.5 md:w-2.5" />
                </div>
                <div className="ml-1 rounded-md border border-[#eef0f4] dark:border-white/10 bg-white dark:bg-black/25 px-2 py-0.5 font-mono text-[10px] text-[#7a7d8a] dark:text-[#64748b] md:ml-3 md:px-3 md:py-1 md:text-[11px]">
                  <span className="hidden sm:inline">
                    https://api.yourservice.com/endpoint
                  </span>
                  <span className="sm:hidden">api.yourservice.com</span>
                </div>
              </div>
              <span className="rounded bg-[#4f6eff]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#4f6eff] md:px-2.5 md:text-[10px]">
                Live
              </span>
            </div>

            <div className="p-5 md:p-6">
              {/* Stats row */}
              <div className="mb-5 flex items-center justify-between md:mb-6">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#b0b3be] dark:text-[#64748b] md:text-[10px]">
                    API Monetization
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#1a1c24] dark:text-white md:text-3xl">
                    $0.05{" "}
                    <span className="text-xs font-normal text-[#b0b3be] dark:text-[#64748b] md:text-sm">
                      / req
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#b0b3be] dark:text-[#64748b] md:text-[10px]">
                    Revenue Counter
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-[#4f6eff] md:text-3xl">
                    $1,284.45
                  </p>
                </div>
              </div>

              {/* Recent agent requests */}
              <p className="mb-2.5 text-[9px] font-bold uppercase tracking-widest text-[#b0b3be] dark:text-[#64748b] md:mb-3 md:text-[10px]">
                Recent Agent Requests
              </p>
              <div className="space-y-2">
                {["#576", "#3301", "#892"].map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-xl border border-[#eef0f4] dark:border-white/10 bg-white dark:bg-black/25 p-2.5 md:p-3"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-[#1a1c24] dark:text-white md:text-sm">
                        Agent {id}
                      </p>
                      <p className="font-mono text-[9px] text-[#b0b3be] dark:text-[#64748b] md:text-[10px]">
                        /v1/scrape
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className="font-mono text-xs font-bold text-[#4f6eff] md:text-sm">
                        $0.05
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="md:h-4 md:w-4"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-24">
        <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-[#1a1c24] dark:text-white sm:text-3xl md:mb-10 md:text-5xl">
          How It <span className="text-[#4f6eff]">Works</span>
        </h2>

        <div className="grid overflow-hidden rounded-2xl border border-[#eef0f4] dark:border-white/10 shadow-sm grid-cols-2 md:grid-cols-4">
          {[
            {
              step: "01",
              icon: <TrendingUp size={22} strokeWidth={1.5} color="#4f6eff" />,
              title: "Agent Requests",
              body: "Agent calls your API endpoint normally.",
            },
            {
              step: "02",
              icon: <Monitor size={22} strokeWidth={1.5} color="#4f6eff" />,
              title: "Server Returns 402",
              body: "Response includes price and payment details.",
            },
            {
              step: "03",
              icon: <CreditCard size={22} strokeWidth={1.5} color="#4f6eff" />,
              title: "Wallet Pays",
              body: "Agent wallet signs and sends payment.",
            },
            {
              step: "04",
              icon: <ScanEye size={22} strokeWidth={1.5} color="#4f6eff" />,
              title: "Access Granted",
              body: "API returns the paid response instantly.",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className={`flex flex-col gap-3 bg-white dark:bg-white/[0.03] p-5 md:gap-4 md:p-8 ${
                i % 2 === 0
                  ? "border-r border-[#eef0f4] dark:border-white/10"
                  : ""
              } ${i < 2 ? "border-b border-[#eef0f4] dark:border-white/10 md:border-b-0" : ""} ${
                i < 3
                  ? "md:border-r md:border-[#eef0f4] md:dark:border-white/10"
                  : ""
              } ${i === 1 ? "md:border-r" : ""} ${i === 3 ? "border-r-0" : ""}`}
            >
              <span className="text-xs font-bold text-[#4f6eff] md:text-sm">
                {step.step}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4f6eff]/[0.08] md:h-10 md:w-10">
                {step.icon}
              </div>
              <h3 className="text-base font-bold text-[#1a1c24] dark:text-white md:text-lg">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#7a7d8a] dark:text-[#94a3b8] md:text-sm">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-24">
        <div className="rounded-2xl bg-[#4f6eff] px-6 py-14 text-center md:rounded-3xl md:px-8 md:py-20">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl md:mb-4 md:text-5xl">
            Join Agent Commerce
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-base text-white/80 md:mb-10 md:text-lg">
            Welcome to the frontier of the agentic economy.
          </p>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#4f6eff] shadow-lg transition-all hover:opacity-90 md:px-8 md:py-3.5"
            href="/dashboard"
          >
            Explore &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eef0f4] dark:border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-6 md:flex-row md:gap-6 md:px-8 md:py-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              alt="ACTUMx Logo"
              className="rounded-md object-contain"
              height={28}
              src="/logo.jpg"
              width={28}
            />
            <span className="text-base font-bold tracking-tight text-[#1a1c24] dark:text-white md:text-lg">
              ACTUM<span className="font-normal">x</span>
            </span>
          </Link>

          <div className="flex flex-wrap justify-center gap-5 text-sm font-medium text-[#7a7d8a] dark:text-[#94a3b8] md:gap-8">
            <a className="transition-colors hover:text-[#4f6eff]" href="#">
              Terms
            </a>
            <a className="transition-colors hover:text-[#4f6eff]" href="#">
              Privacy
            </a>
            <a
              className="transition-colors hover:text-[#4f6eff]"
              href="https://x.com/Actumx"
              rel="noopener noreferrer"
              target="_blank"
            >
              Twitter
            </a>
            <a
              className="transition-colors hover:text-[#4f6eff]"
              href="https://github.com/devsargam/x402"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </div>

          <p className="text-xs text-[#b0b3be] dark:text-[#64748b] md:text-sm">
            &copy; 2026 ACTUMx. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
