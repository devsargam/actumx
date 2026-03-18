"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Search,
  Plus,
  Wallet,
  Copy,
  Bell,
  SlidersHorizontal,
  Play,
  X,
  Loader2,
  Send,
  AlertCircle,
  User,
  Bot,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { apiRequest, formatMoney } from "@/lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────
type Category =
  | "ALL MODELS"
  | "TEXT-TO-VIDEO"
  | "IMAGE GEN"
  | "DATA ANALYSIS"
  | "AUTOMATION";

interface Model {
  id: string;
  apiModelId: string;
  name: string;
  icon: React.ReactNode;
  price: string;
  costCents: number;
  priceColor: string;
  category: Category;
  badgeLabel: string;
  badgeColor: string;
  description: string;
  spec: string;
}

interface ActivityItem {
  user: string;
  action: string;
  target: string;
  time: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  "ALL MODELS",
  "TEXT-TO-VIDEO",
  "IMAGE GEN",
  "DATA ANALYSIS",
  "AUTOMATION",
];

const MODELS: Model[] = [
  {
    id: "google-gemini-2.0-flash",
    apiModelId: "google/gemini-2.0-flash",
    name: "google/gemini-2.0-flash",
    icon: (
      <span className="text-[13px] font-bold text-muted-foreground tracking-tight">
        G.
      </span>
    ),
    price: "$0.02/req",
    costCents: 2,
    priceColor: "text-primary",
    category: "TEXT-TO-VIDEO",
    badgeLabel: "FAST",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    description:
      "Google's fastest multimodal model with real-time streaming and low latency.",
    spec: "1M Context",
  },
  {
    id: "openai-gpt-4o-mini",
    apiModelId: "openai/gpt-4o-mini",
    name: "openai/gpt-4o-mini",
    icon: <span className="text-base text-muted-foreground">◐</span>,
    price: "$0.03/req",
    costCents: 3,
    priceColor: "text-primary",
    category: "DATA ANALYSIS",
    badgeLabel: "EFFICIENT",
    badgeColor:
      "bg-purple-500/20 text-purple-500 dark:text-purple-400 border-purple-500/30",
    description:
      "OpenAI's cost-efficient model with strong reasoning and multimodal capabilities.",
    spec: "128k Context",
  },
  {
    id: "anthropic-claude-3.5-sonnet",
    apiModelId: "anthropic/claude-3.5-sonnet",
    name: "anthropic/claude-3.5-sonnet",
    icon: (
      <span className="text-[13px] font-bold text-muted-foreground tracking-tight">
        A.
      </span>
    ),
    price: "$0.05/req",
    costCents: 5,
    priceColor: "text-primary",
    category: "DATA ANALYSIS",
    badgeLabel: "REASONING",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    description:
      "Anthropic's best balance of intelligence and speed for complex tasks.",
    spec: "200k Context",
  },
  {
    id: "meta-llama-3.1-70b",
    apiModelId: "meta-llama/llama-3.1-70b",
    name: "meta-llama/llama-3.1-70b",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-muted-foreground"
      >
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    price: "$0.01/req",
    costCents: 1,
    priceColor: "text-emerald-500 dark:text-emerald-400",
    category: "AUTOMATION",
    badgeLabel: "OPEN SOURCE",
    badgeColor:
      "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    description:
      "Meta's leading open weights model for broad language tasks.",
    spec: "70B Params",
  },
  {
    id: "mistralai-mistral-large",
    apiModelId: "mistralai/mistral-large",
    name: "mistralai/mistral-large",
    icon: (
      <span className="text-[13px] font-bold text-muted-foreground tracking-tight">
        M.
      </span>
    ),
    price: "$0.04/req",
    costCents: 4,
    priceColor: "text-primary",
    category: "DATA ANALYSIS",
    badgeLabel: "MULTILINGUAL",
    badgeColor:
      "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
    description:
      "Mistral's flagship model with strong multilingual and coding capabilities.",
    spec: "128k Context",
  },
  {
    id: "deepseek-chat",
    apiModelId: "deepseek/deepseek-chat",
    name: "deepseek/deepseek-chat",
    icon: (
      <span className="text-[13px] font-bold text-muted-foreground tracking-tight">
        DS
      </span>
    ),
    price: "$0.01/req",
    costCents: 1,
    priceColor: "text-emerald-500 dark:text-emerald-400",
    category: "AUTOMATION",
    badgeLabel: "VALUE",
    badgeColor:
      "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    description:
      "High-performance model with excellent reasoning at very low cost.",
    spec: "128k Context",
  },
  {
    id: "openai-gpt-4o",
    apiModelId: "openai/gpt-4o",
    name: "openai/gpt-4o",
    icon: <span className="text-base text-muted-foreground">◉</span>,
    price: "$0.08/req",
    costCents: 8,
    priceColor: "text-primary",
    category: "DATA ANALYSIS",
    badgeLabel: "FLAGSHIP",
    badgeColor:
      "bg-purple-500/20 text-purple-500 dark:text-purple-400 border-purple-500/30",
    description:
      "OpenAI's most capable multimodal model for complex reasoning tasks.",
    spec: "128k Context",
  },
  {
    id: "anthropic-claude-3-opus",
    apiModelId: "anthropic/claude-3-opus",
    name: "anthropic/claude-3-opus",
    icon: (
      <span className="text-[13px] font-bold text-muted-foreground tracking-tight">
        A.
      </span>
    ),
    price: "$0.10/req",
    costCents: 10,
    priceColor: "text-primary",
    category: "DATA ANALYSIS",
    badgeLabel: "PREMIUM",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    description:
      "Anthropic's most powerful model for complex analysis and creative work.",
    spec: "200k Context",
  },
  {
    id: "google-gemini-pro-1.5",
    apiModelId: "google/gemini-pro-1.5",
    name: "google/gemini-pro-1.5",
    icon: (
      <span className="text-[13px] font-bold text-muted-foreground tracking-tight">
        G.
      </span>
    ),
    price: "$0.03/req",
    costCents: 3,
    priceColor: "text-primary",
    category: "TEXT-TO-VIDEO",
    badgeLabel: "LONG CONTEXT",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    description:
      "Google's model optimized for long context understanding up to 2M tokens.",
    spec: "2M Context",
  },
  {
    id: "qwen-2.5-72b",
    apiModelId: "qwen/qwen-2.5-72b",
    name: "qwen/qwen-2.5-72b",
    icon: (
      <span className="text-[13px] font-bold text-muted-foreground tracking-tight">
        Q.
      </span>
    ),
    price: "$0.01/req",
    costCents: 1,
    priceColor: "text-emerald-500 dark:text-emerald-400",
    category: "AUTOMATION",
    badgeLabel: "OPEN SOURCE",
    badgeColor:
      "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    description:
      "Alibaba's powerful open model with strong coding and math abilities.",
    spec: "72B Params",
  },
  {
    id: "google-gemini-3-pro-image",
    apiModelId: "google/gemini-3-pro-image",
    name: "google/gemini-3-pro-image",
    icon: (
      <span className="text-[13px] font-bold text-muted-foreground tracking-tight">
        G.
      </span>
    ),
    price: "$0.05/req",
    costCents: 5,
    priceColor: "text-primary",
    category: "IMAGE GEN",
    badgeLabel: "IMAGE GEN",
    badgeColor:
      "bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30",
    description:
      "Gemini 3 Pro with image generation. Send a text prompt, get images back.",
    spec: "Multimodal",
  },
];

const ACTIVITY: ActivityItem[] = [
  { user: "user_992", action: "deployed", target: "veo-3.1", time: "2 minutes ago" },
  { user: "dev_x", action: "using", target: "claude-3", time: "12 minutes ago" },
  { user: "sys_bot", action: "confirmed", target: "top-up", time: "45 minutes ago" },
  { user: "agent_77", action: "deployed", target: "llama-3.1", time: "1 hour ago" },
  { user: "ml_ops", action: "using", target: "sora-v1", time: "2 hours ago" },
];

// ─── Run Modal with AI SDK streaming ────────────────────────────────────────

function RunModal({
  model,
  onClose,
  balanceCents,
  onBalanceChange,
}: {
  model: Model;
  onClose: () => void;
  balanceCents: number;
  onBalanceChange: (newBalance: number) => void;
}) {
  const [balanceError, setBalanceError] = useState("");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const canAfford = balanceCents >= model.costCents;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/marketplace/chat",
        body: { modelId: model.apiModelId },
      }),
    [model.apiModelId]
  );

  const {
    messages,
    sendMessage,
    status,
    error: chatError,
  } = useChat({
    transport,
    onFinish: () => {
      refreshBalance();
    },
    onError: (err: Error) => {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error === "insufficient_balance") {
          setBalanceError(parsed.message);
          return;
        }
      } catch {
        // not JSON
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  async function refreshBalance() {
    try {
      const res = await apiRequest<{ balanceCents: number }>(
        "/v1/marketplace/balance"
      );
      if (res.status === 200) {
        onBalanceChange(res.data.balanceCents);
      }
    } catch {
      // ignore
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault?.();
    if (!input.trim() || isLoading) return;

    if (!canAfford) {
      setBalanceError(
        `Insufficient balance. You have ${formatMoney(balanceCents)} but this costs ${formatMoney(model.costCents)}.`
      );
      return;
    }

    setBalanceError("");
    const text = input;
    setInput("");
    sendMessage({ text });
  }

  const errorMessage =
    balanceError ||
    (chatError
      ? (() => {
          try {
            return JSON.parse(chatError.message)?.message;
          } catch {
            return chatError.message;
          }
        })()
      : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl h-[80vh] max-h-[700px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center border border-border">
              {model.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {model.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-flex items-center h-[18px] px-1.5 rounded text-[9px] font-bold tracking-wider border ${model.badgeColor}`}
                >
                  {model.badgeLabel}
                </span>
                <span className={`text-xs font-semibold ${model.priceColor}`}>
                  {model.price}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Balance
              </div>
              <div
                className={`text-sm font-bold tabular-nums ${
                  canAfford ? "text-foreground" : "text-red-500"
                }`}
              >
                {formatMoney(balanceCents)}
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        >
          {messages.length === 0 && !isLoading && !errorMessage && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Play className="size-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Run {model.name}
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Enter a prompt below to start a conversation.
                {model.costCents > 0
                  ? ` Each message costs ${formatMoney(model.costCents)} from your wallet.`
                  : " This model is free to use."}
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const text = msg.parts
              ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("") ?? "";

            return (
              <div key={msg.id} className="flex gap-3">
                <div
                  className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === "user"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="size-3.5" />
                  ) : (
                    <Bot className="size-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                    {msg.role === "user" ? "You" : model.name}
                  </div>
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed break-words">
                    {text}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3">
              <div className="size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-muted text-muted-foreground">
                <Bot className="size-3.5" />
              </div>
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="size-4 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
                {!canAfford && (
                  <a
                    href="/billing"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary hover:underline"
                  >
                    <Wallet className="size-3" />
                    Top up your wallet
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 border-t border-border shrink-0"
        >
          {messages.length > 0 && model.costCents > 0 && (
            <p className="text-[10px] text-muted-foreground mb-2">
              {messages.filter((m: { role: string }) => m.role === "user").length} messages sent
              — {formatMoney(messages.filter((m: { role: string }) => m.role === "user").length * model.costCents)}{" "}
              charged
            </p>
          )}
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={`Ask ${model.name} anything...`}
              rows={2}
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="shrink-0 size-10 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Components ─────────────────────────────────────────────────────────────

function MarketplaceTopBar({ balanceCents }: { balanceCents: number }) {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-8">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search models or skills..."
          className="w-full h-9 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="hidden sm:flex items-center gap-2 h-9 px-3.5 bg-muted/50 border border-border rounded-lg">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {formatMoney(balanceCents)}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Credits
          </span>
          <a
            href="/billing"
            className="ml-1 size-5 rounded bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="size-3" />
          </a>
        </div>

        <a
          href="/billing"
          className="hidden md:flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg transition-colors"
        >
          <Wallet className="size-4" />
          <span className="tracking-wide">GET WALLET</span>
        </a>

        <button className="hidden md:flex size-9 items-center justify-center border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <Copy className="size-4" />
        </button>

        <button className="hidden lg:flex items-center gap-1.5 h-9 px-4 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <Plus className="size-3.5" />
          Deploy
        </button>

        <button className="size-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="size-[18px]" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full ring-2 ring-background" />
        </button>
      </div>
    </div>
  );
}

function CategoryFilter({
  active,
  onChange,
}: {
  active: Category;
  onChange: (c: Category) => void;
}) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`h-8 px-4 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
            active === cat
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
      <button className="ml-auto size-8 flex items-center justify-center border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
        <SlidersHorizontal className="size-4" />
      </button>
    </div>
  );
}

function ModelCard({
  model,
  onRun,
}: {
  model: Model;
  onRun: (model: Model) => void;
}) {
  return (
    <div className="group relative flex flex-col bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center border border-border">
          {model.icon}
        </div>
        <span className={`text-sm font-semibold ${model.priceColor}`}>
          {model.price}
        </span>
      </div>

      <h3 className="text-[15px] font-bold text-foreground mb-2.5 tracking-tight">
        {model.name}
      </h3>

      <span
        className={`inline-flex items-center w-fit h-[22px] px-2 rounded text-[10px] font-bold tracking-wider border mb-3 ${model.badgeColor}`}
      >
        {model.badgeLabel}
      </span>

      <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">
        {model.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-5">
        <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
          {model.spec}
        </span>
        <button
          onClick={() => onRun(model)}
          className="flex items-center gap-1.5 h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-bold tracking-wider rounded-lg transition-all shadow-lg shadow-primary/20"
        >
          <Play className="size-3 fill-current" />
          RUN
        </button>
      </div>
    </div>
  );
}

function LiveActivity() {
  const [latency, setLatency] = useState(42);
  const [agents, setAgents] = useState(2482);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((prev) =>
        Math.max(
          20,
          Math.min(
            80,
            prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)
          )
        )
      );
      setAgents((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-12">
      <div className="h-px bg-border mb-8" />
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Live Activity
          </h2>
          <span className="inline-flex items-center gap-1.5 h-6 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            NETWORK ONLINE
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold">
              Latency
            </div>
            <div className="text-lg font-bold text-foreground tabular-nums mt-0.5">
              {latency}ms
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold">
              Active Agents
            </div>
            <div className="text-lg font-bold text-foreground tabular-nums mt-0.5">
              {agents.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      <div>
        {ACTIVITY.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-3.5 border-b border-border/50 last:border-0 group/row"
          >
            <span className="size-1.5 rounded-full bg-muted-foreground/30 group-hover/row:bg-primary transition-colors shrink-0" />
            <span className="text-[13px] font-mono font-medium text-foreground w-[90px] shrink-0">
              {item.user}
            </span>
            <span className="text-[13px] text-muted-foreground">
              {item.action}
            </span>
            <span className="text-[13px] font-medium text-foreground">
              {item.target}
            </span>
            <span className="text-[13px] text-muted-foreground/50">—</span>
            <span className="text-[13px] text-muted-foreground">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL MODELS");
  const [runningModel, setRunningModel] = useState<Model | null>(null);
  const [balanceCents, setBalanceCents] = useState(0);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await apiRequest<{ balanceCents: number }>(
        "/v1/marketplace/balance"
      );
      if (res.status === 200) {
        setBalanceCents(res.data.balanceCents);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const filteredModels =
    activeCategory === "ALL MODELS"
      ? MODELS
      : MODELS.filter((m) => m.category === activeCategory);

  return (
    <div>
      <MarketplaceTopBar balanceCents={balanceCents} />

      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight leading-tight">
          Explore Agents & Skills
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          High-performance AI tools and gateways for autonomous workflows
        </p>
      </div>

      <div className="mb-8">
        <CategoryFilter
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onRun={setRunningModel}
          />
        ))}
      </div>

      <LiveActivity />

      {runningModel && (
        <RunModal
          model={runningModel}
          balanceCents={balanceCents}
          onClose={() => setRunningModel(null)}
          onBalanceChange={setBalanceCents}
        />
      )}
    </div>
  );
}
