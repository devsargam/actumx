"use client";

import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { Check, Copy } from "lucide-react";
import { LandingNavbar } from "@/components/landing-navbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

const SKILL_URL = "https://actumx.app/skill.md";

const PROMPT_TEXT = `Read ${SKILL_URL} and follow the instructions`;

function CopyBlock() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full max-w-[700px] rounded-xl border border-white/10 bg-[#12131a] overflow-hidden">
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <code className="text-[15px] leading-relaxed text-white/80 font-mono break-all">
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
      <LandingNavbar />

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 -mt-12">
        <h1 className="text-6xl font-bold tracking-tight text-white text-center leading-[1.05] sm:text-7xl md:text-8xl lg:text-[110px]">
          The Walmart
          <br />
          for AI Agents.
        </h1>

        <p className="mt-6 text-center text-lg text-white/40 max-w-[560px] leading-relaxed md:text-xl">
          The retail marketplace where agents discover, access,
          and pay for every tool, API, and skill they need.
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
        <span
          className="text-xs font-bold tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors uppercase cursor-pointer"
        >
          Enter Agentic Mode
        </span>
      </div>
    </main>
  );
}
