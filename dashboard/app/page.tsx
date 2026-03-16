import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { ArrowRight } from "lucide-react";
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
          <Link
            className="transition-colors hover:text-[#4f6eff]"
            href="/marketplace"
          >
            Marketplace
          </Link>
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
                href="/marketplace"
              >
                Marketplace
              </Link>
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
            endpoints.
          </Balancer>
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="rounded-full flex items-center justify-center gap-x-3 bg-[#4f6eff] px-7 py-3 text-base font-semibold text-white transition-all hover:opacity-90 md:gap-x-4 md:px-10 md:py-4 md:text-lg"
            href="/marketplace"
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

      {/* Features, Marketplace, Wallet, Gateway, How It Works, and CTA sections commented out */}

      {/* Footer commented out */}
    </main>
  );
}
