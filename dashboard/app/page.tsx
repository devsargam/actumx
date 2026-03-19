"use client";

import { useState } from "react";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { Copy, Check } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

const SKILL_URL = "https://actumx.app/skill.md";

const TABS = [
  {
    id: "prompt",
    label: "PROMPT",
    content: `Read ${SKILL_URL} and follow the instructions`,
  },
  {
    id: "pnpm",
    label: "pnpm",
    content: `pnpm dlx fetch-md ${SKILL_URL}`,
  },
  {
    id: "npm",
    label: "npm",
    content: `npx fetch-md ${SKILL_URL}`,
  },
  {
    id: "bun",
    label: "bun",
    content: `bunx fetch-md ${SKILL_URL}`,
  },
] as const;

function CopyBlock() {
  const [activeTab, setActiveTab] = useState<string>("prompt");
  const [copied, setCopied] = useState(false);

  const active = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  function handleCopy() {
    navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full max-w-[700px] rounded-xl border border-white/10 bg-[#12131a] overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 pt-4 border-b border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCopied(false);
            }}
            className={`pb-3 text-xs font-semibold tracking-wide transition-colors ${
              activeTab === tab.id
                ? "text-[#6e8efb] border-b-2 border-[#6e8efb]"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <code className="text-[15px] leading-relaxed text-white/80 font-mono break-all">
          {activeTab === "prompt" ? (
            <>
              Read{" "}
              <a
                href={SKILL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6e8efb] hover:underline"
              >
                {SKILL_URL}
              </a>{" "}
              and follow the instructions
            </>
          ) : (
            active.content
          )}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-md text-white/30 hover:text-white/60 transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check size={16} className="text-emerald-400" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main
      className={`${spaceGrotesk.variable} min-h-screen bg-[#0a0a0f] [font-family:var(--font-space)] flex flex-col`}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">
            ACTUM<span className="font-normal">x</span>
          </Link>
          <Link
            href="/marketplace"
            className="text-sm font-medium text-white/50 hover:text-white transition-colors"
          >
            TOOLS
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://x.com/Actumx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors"
            aria-label="X (Twitter)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `Read ${SKILL_URL} and follow the instructions`
              );
            }}
            className="flex items-center gap-2 h-9 px-4 rounded-lg border border-white/15 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          >
            GET SKILL.MD
            <Copy size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 -mt-12">
        <h1 className="text-6xl font-bold tracking-tight text-white text-center leading-[1.05] sm:text-7xl md:text-8xl lg:text-[110px]">
          The Walmart
          <br />
          for AI Agents.
        </h1>

        <p className="mt-6 text-center text-lg text-white/40 max-w-[560px] leading-relaxed md:text-xl">
          One destination where every agent discovers, accesses,
          and pays for the capabilities it needs.
        </p>

        {/* Copy block */}
        <div className="mt-12 w-full flex flex-col items-center gap-4">
          <p className="text-sm text-white/50">
            Paste this prompt to get started with any AI clients.
          </p>
          <CopyBlock />
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <Link
          href="/login"
          className="text-xs font-bold tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors uppercase"
        >
          Enter Agentic Mode
        </Link>
      </div>
    </main>
  );
}
