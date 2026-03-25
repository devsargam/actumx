"use client";

import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { LandingNavbar } from "@/components/landing-navbar";
import { Search, Grid2x2, List, Check, Copy, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://api.actumx.app"
    : "http://localhost:3001");

const APP_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://actumx.app"
    : "http://localhost:3000";

const SKILL_URL = `${APP_BASE_URL}/skill.md`;

type OutputType = "IMAGE" | "VIDEO";

interface Tool {
  id: string;
  provider: string;
  name: string;
  output: OutputType;
  price: string;
  priceUnit: string;
  maxRes: string;
  maxDur: string;
  capabilities: string[];
  description: string;
  docsPath: string;
  endpointPath: string;
}

const tools: Tool[] = [
  {
    id: "google-nano-banana-pro",
    provider: "google",
    name: "nano-banana-pro",
    output: "IMAGE",
    price: "$0.18/image",
    priceUnit: "image",
    maxRes: "4096x4096",
    maxDur: "—",
    capabilities: ["text-to-image", "image-to-image"],
    description:
      "High quality with multi-image input (up to 14), resolution control",
    docsPath: "/api/service/ai-gen/skill.md",
    endpointPath: "/api/service/ai-gen/api/invoke",
  },
  {
    id: "openai-sora-2-pro",
    provider: "openai",
    name: "sora-2-pro",
    output: "VIDEO",
    price: "$0.36/sec (720p), $0.60/sec (1080p)",
    priceUnit: "second",
    maxRes: "—",
    maxDur: "12s",
    capabilities: ["text-to-video", "image-to-video"],
    description:
      "Higher quality Sora with standard (720p) and high (1024p) resolution modes",
    docsPath: "/api/service/ai-gen/skill.md",
    endpointPath: "/api/service/ai-gen/api/invoke",
  },
  {
    id: "google-veo-3.1",
    provider: "google",
    name: "veo-3.1",
    output: "VIDEO",
    price: "$0.48/sec (audio), $0.24/sec (no audio)",
    priceUnit: "second",
    maxRes: "—",
    maxDur: "8s",
    capabilities: ["text-to-video", "image-to-video"],
    description:
      "Top-tier video with audio, interpolation, and reference-to-video (R2V) support",
    docsPath: "/api/service/ai-gen/skill.md",
    endpointPath: "/api/service/ai-gen/api/invoke",
  },
  {
    id: "openai-sora-2",
    provider: "openai",
    name: "sora-2",
    output: "VIDEO",
    price: "$0.12/sec",
    priceUnit: "second",
    maxRes: "—",
    maxDur: "12s",
    capabilities: ["text-to-video", "image-to-video"],
    description:
      "Text/image-to-video with synchronized audio, dialogue, and sound effects",
    docsPath: "/api/service/ai-gen/skill.md",
    endpointPath: "/api/service/ai-gen/api/invoke",
  },
];

const outputFilters = ["ANY OUTPUT", "IMAGE", "VIDEO"] as const;

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === "google") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" className="shrink-0">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    );
  }
  // OpenAI icon
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" className="shrink-0">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function OutputBadge({ type }: { type: OutputType }) {
  const colors =
    type === "IMAGE"
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : "bg-blue-500/20 text-blue-400 border-blue-500/30";
  return (
    <span
      className={`px-2.5 py-0.5 text-[11px] font-bold tracking-wider rounded border ${colors}`}
    >
      {type}
    </span>
  );
}

function ToolCard({
  tool,
  onRun,
}: {
  tool: Tool;
  onRun: (tool: Tool) => void;
}) {
  return (
    <div className="border border-white/10 rounded-lg p-5 flex flex-col gap-4 bg-white/[0.02] hover:border-white/20 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ProviderIcon provider={tool.provider} />
          <h3 className="text-white text-base font-medium truncate">
            <span className="text-white/60">{tool.provider}/</span>
            <span className="font-bold">{tool.name}</span>
          </h3>
        </div>
        <OutputBadge type={tool.output} />
      </div>

      {/* Specs */}
      <div className="space-y-1.5 text-[13px] font-mono">
        <div className="flex justify-between text-white/50">
          <span>PRICE</span>
          <span className="text-white/90 text-right">
            {tool.price}{" "}
            <span className="text-white/40">{tool.priceUnit}</span>
          </span>
        </div>
        <div className="flex justify-between text-white/50">
          <span>MAX RES</span>
          <span className="text-white/90">{tool.maxRes}</span>
        </div>
        <div className="flex justify-between text-white/50">
          <span>MAX DUR</span>
          <span className="text-white/90">{tool.maxDur}</span>
        </div>
      </div>

      {/* Capabilities */}
      <div>
        <p className="text-[11px] font-mono text-white/40 tracking-wider mb-2">
          CAPABILITIES
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tool.capabilities.map((cap) => (
            <span
              key={cap}
              className="px-2.5 py-1 text-xs font-mono text-white/70 bg-white/5 rounded border border-white/10"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="border-l-2 border-white/10 pl-3 py-1">
        <p className="text-sm text-white/50 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Run button */}
      <button
        onClick={() => onRun(tool)}
        className="w-full py-2.5 text-sm font-bold tracking-widest text-white/80 border border-white/15 rounded hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
      >
        RUN
      </button>
    </div>
  );
}

function ToolModal({
  tool,
  open,
  onClose,
}: {
  tool: Tool | null;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!tool) return null;

  const docsUrl = `${API_BASE_URL}${tool.docsPath}`;
  const endpointUrl = `${API_BASE_URL}${tool.endpointPath}`;

  const promptText = `Skill: ${SKILL_URL}
Docs: ${docsUrl}
Endpoint: POST ${endpointUrl}
Model: ${tool.provider}/${tool.name}
Price: ${tool.price} per ${tool.priceUnit}

${tool.description}. Use x402/fetch from the agentwallet skill to invoke this model. Ask me what to generate.`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-[#0f1117] border border-white/10 text-white sm:max-w-lg rounded-2xl p-6 gap-4"
      >
        <DialogTitle className="sr-only">
          {tool.provider}/{tool.name}
        </DialogTitle>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-medium">
          <span className="text-white/60">{tool.provider}/</span>
          <span className="font-bold">{tool.name}</span>
        </h2>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-bold tracking-widest text-sm transition-colors cursor-pointer ${
            copied
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-teal-600/80 hover:bg-teal-600 text-white"
          }`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? "PROMPT COPIED" : "COPY PROMPT"}
        </button>

        {/* Prompt preview */}
        <div className="bg-white/5 rounded-lg p-4 text-[13px] text-white/60 font-mono leading-relaxed whitespace-pre-wrap">
          {promptText}
        </div>

        {/* Footer info */}
        <div className="space-y-1 text-[11px] font-mono tracking-wider text-white/30">
          <p>
            PASTE THE PROMPT ON ANY CLIENT{" "}
            <span className="text-white/20">(LIKE CLAUDE CODE)</span>
          </p>
          <p>PRICES MAY VARY DEPENDING ON PARAMETERS</p>
        </div>

        {/* Output & Price footer */}
        <div className="border-t border-white/10 pt-3 space-y-2 text-[13px] font-mono">
          <div className="flex justify-between items-center text-white/50">
            <span>OUTPUT</span>
            <OutputBadge type={tool.output} />
          </div>
          <div className="flex justify-between text-white/50">
            <span>PRICE</span>
            <span className="text-white/90">
              {tool.price}{" "}
              <span className="text-white/40">per {tool.priceUnit}</span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [outputFilter, setOutputFilter] = useState<string>("ANY OUTPUT");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const filtered = tools.filter((t) => {
    const matchesSearch =
      search === "" ||
      `${t.provider} ${t.name} ${t.description} ${t.capabilities.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesOutput =
      outputFilter === "ANY OUTPUT" || t.output === outputFilter;
    return matchesSearch && matchesOutput;
  });

  return (
    <main
      className={`${spaceGrotesk.variable} min-h-screen bg-[#0a0a0f] [font-family:var(--font-space)]`}
    >
      <LandingNavbar />

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
          Available tools for AI agents.
        </h1>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors font-mono"
            />
          </div>

          {/* Output filter */}
          <select
            value={outputFilter}
            onChange={(e) => setOutputFilter(e.target.value)}
            className="h-12 px-4 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white/60 font-mono appearance-none cursor-pointer focus:outline-none focus:border-white/25 pr-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            {outputFilters.map((f) => (
              <option key={f} value={f} className="bg-[#0a0a0f]">
                {f}
              </option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              <Grid2x2 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Tool grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {filtered.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onRun={setSelectedTool}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-white/30 font-mono text-sm py-16">
            No tools found.
          </p>
        )}
      </div>

      {/* Modal */}
      <ToolModal
        tool={selectedTool}
        open={!!selectedTool}
        onClose={() => setSelectedTool(null)}
      />
    </main>
  );
}
