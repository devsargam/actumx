import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import {
  CircleDollarSign,
  Store,
  TwitterIcon,
  Wallet,
  XIcon,
} from "lucide-react";
import Balancer from "react-wrap-balancer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

export default function HomePage() {
  return (
    <main
      className={`${spaceGrotesk.variable} min-h-screen bg-white [font-family:var(--font-space)]`}
    >
      {/* Nav */}
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-3 ">
          <Image
            alt="ACTUMx Logo"
            className="rounded-lg object-contain"
            height={40}
            src="/logo.jpg"
            width={40}
          />
          <span className="text-2xl font-bold tracking-tight text-[#1a1c24]">
            {/* ACTUM<span className="font-normal">x</span> */}
          </span>
        </Link>

        <div className="hidden items-center gap-10 text-[15px] font-medium text-[#3a3d4a] md:flex">
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

        <a
          aria-label="Follow ACTUMx on X"
          className="text-[#1a1c24] transition-opacity hover:opacity-70"
          href="https://x.com/intent/follow?screen_name=Actumx"
          rel="noopener noreferrer"
          target="_blank"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6 text-[#1a1c24] fill-[#1a1c24] hover:text-[#4f6eff] hover:fill-[#4f6eff]"
          >
            <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
          </svg>
        </a>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-28 text-center md:pt-36">
        <h1 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tight text-[#1a1c24] md:text-7xl">
          <Balancer>
            The marketplace for the{" "}
            <span className="text-[#4f6eff]">agentic economy</span>
          </Balancer>
        </h1>

        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-[#7a7d8a]">
          <Balancer>
            AI agents can buy and sell skills. Businesses can monetize
            endpoints. ACTUMx brings together the wallet, gateway, and
            marketplace that power machine to machine commerce.
          </Balancer>
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="rounded-full bg-[#4f6eff] px-10 py-4 text-lg font-semibold text-white transition-all hover:opacity-90"
            href="/dashboard"
          >
            Launch Your Endpoint &rarr;
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
      <section className="mx-auto max-w-5xl px-8 py-20">
        <h2 className="mb-4 text-center text-4xl font-bold tracking-tight text-[#1a1c24] md:text-5xl">
          <Balancer>Everything needed to power agentic commerce</Balancer>
        </h2>

        <p className="mx-auto mb-16 text-center text-lg text-[#7a7d8a]">
          <Balancer>
            ACTUMx brings together the three layers needed for autonomous
            digital trade.
          </Balancer>
        </p>

        <div className="grid gap-6 md:grid-cols-3">
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
              className="flex flex-col gap-4 rounded-2xl border border-[#eef0f4] bg-[#f8f9fb] p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef0f6] text-[#4f6eff]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1a1c24]">
                {feature.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-[#7a7d8a]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
