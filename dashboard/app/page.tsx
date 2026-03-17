import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { ArrowRight } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

export default function HomePage() {
  return (
    <main
      className={`${spaceGrotesk.variable} min-h-screen bg-white dark:bg-[#0a0a0f] [font-family:var(--font-space)] flex flex-col`}
    >
      {/* Announcement bar */}
      <Link
        href="/skill.md"
        className="block bg-[#1a1c24] dark:bg-white/10 text-center px-4 py-2.5 text-xs font-medium text-white/80 dark:text-white/70 hover:text-white transition-colors"
      >
        Paste <span className="font-mono font-bold text-white">skill.md</span> in
        any AI client to get started{" "}
        <ArrowRight size={12} className="inline ml-1" />
      </Link>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <h1 className="text-6xl font-bold tracking-tight text-[#1a1c24] dark:text-white sm:text-8xl md:text-9xl">
          ACTUM<span className="font-normal">x</span>
        </h1>
        <p className="mt-4 text-sm text-[#7a7d8a] dark:text-[#94a3b8] md:text-base">
          The AI solution for crypto problems.
        </p>

        {/* Social links */}
        <div className="mt-8 flex items-center gap-5 text-xs font-medium text-[#7a7d8a] dark:text-[#94a3b8]">
          <a
            className="transition-colors hover:text-[#1a1c24] dark:hover:text-white"
            href="https://github.com/devsargam/x402"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <a
            className="transition-colors hover:text-[#1a1c24] dark:hover:text-white"
            href="https://t.me/+IugCwFOqngplOGFl"
            rel="noopener noreferrer"
            target="_blank"
          >
            Telegram
          </a>
          <a
            className="transition-colors hover:text-[#1a1c24] dark:hover:text-white"
            href="https://x.com/Actumx"
            rel="noopener noreferrer"
            target="_blank"
          >
            X
          </a>
        </div>
      </div>
    </main>
  );
}
