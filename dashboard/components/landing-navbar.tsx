import Link from "next/link";
import { Copy } from "lucide-react";

const SKILL_URL = "https://actumx.app/skill.md";

export function LandingNavbar() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          ACTUM<span className="font-normal">x</span>
        </Link>
        <Link
          href="/tools"
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
        <a
          href={SKILL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 h-9 px-4 rounded-lg border border-white/15 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
        >
          GET SKILL.MD
          <Copy size={14} />
        </a>
      </div>
    </nav>
  );
}
