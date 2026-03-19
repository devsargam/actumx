import { Space_Grotesk } from "next/font/google";
import { LandingNavbar } from "@/components/landing-navbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

export default function ToolsPage() {
  return (
    <main
      className={`${spaceGrotesk.variable} min-h-screen bg-[#0a0a0f] [font-family:var(--font-space)] flex flex-col`}
    >
      <LandingNavbar />
      <div className="flex-1 flex items-center justify-center px-5">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          The best tools for AI agents.
        </h1>
      </div>
    </main>
  );
}
