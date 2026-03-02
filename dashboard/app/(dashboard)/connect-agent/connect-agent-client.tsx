"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bot, Copy, KeyRound, Link2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { env } from "@/lib/env";
import type { AgentRecord } from "@/lib/api";

const CONNECT_AGENT_KEYS_STORAGE = "connect_agent_api_keys";
const DEFAULT_MCP_URL = env.MCP_URL;

type ClientSetup = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  snippet: (mcpUrl: string) => string[];
};

const clientSetups: ClientSetup[] = [
  {
    name: "Codex",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"></path>
      </svg>
    ),
    snippet: (mcpUrl: string) => [
      "Save your Actumx key as an environment variable Codex can use:",
      'export ACTUMX_MCP_API_KEY="<API_KEY>"',
      "Add this line to your shell profile (for example: ~/.zshrc) to keep it across sessions.",
      "Add the MCP server in your Codex project directory:",
      `codex mcp add actumx --url "${mcpUrl}" --bearer-token-env-var ACTUMX_MCP_API_KEY`,
      "Restart Codex by starting a new session.",
      'Try prompts: "Check my Actumx Wallet balance" and "List my wallet balances using Actumx".',
    ],
  },
];

function formatSolAmount(value: number | null) {
  if (value === null) {
    return "0.00";
  }

  return value.toFixed(2);
}

export function ConnectAgentClient({
  initialAgents,
}: {
  initialAgents: AgentRecord[];
}) {
  const [selectedAgentId, setSelectedAgentId] = useState(
    initialAgents[0]?.id ?? "",
  );
  const [expandedClient, setExpandedClient] = useState<string>(
    clientSetups[0]?.name ?? "",
  );
  const [status, setStatus] = useState("Ready");
  const [apiKeysByAgent, setApiKeysByAgent] = useState<Record<string, string>>(
    {},
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const selectedAgent = useMemo(
    () =>
      initialAgents.find((agent) => agent.id === selectedAgentId) ??
      initialAgents[0],
    [initialAgents, selectedAgentId],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(CONNECT_AGENT_KEYS_STORAGE);
    if (stored) {
      setApiKeysByAgent(JSON.parse(stored) as Record<string, string>);
    }
    setIsHydrated(true);
  }, []);

  const apiKey = selectedAgent
    ? (apiKeysByAgent[selectedAgent.id] ?? null)
    : null;
  const mcpUrl = DEFAULT_MCP_URL;

  async function copyText(value: string, message: string) {
    await navigator.clipboard.writeText(value);
    setStatus(message);
  }

  const generateApiKeyForAgent = useCallback(
    async (agent: AgentRecord) => {
      if (isGeneratingKey) {
        return;
      }

      setIsGeneratingKey(true);
      setStatus("Generating API key...");
      const response = await apiRequest<{ apiKey?: string; error?: string }>(
        "/v1/api-keys",
        {
          method: "POST",
          body: {
            name: `${agent.name} MCP Key`,
          },
        },
      );

      if (response.status >= 400 || !response.data.apiKey) {
        setStatus(
          `Failed to generate key: ${response.data.error ?? "unknown error"}`,
        );
        setIsGeneratingKey(false);
        return;
      }

      setApiKeysByAgent((prev) => {
        const next = {
          ...prev,
          [agent.id]: response.data.apiKey ?? "",
        };
        window.localStorage.setItem(
          CONNECT_AGENT_KEYS_STORAGE,
          JSON.stringify(next),
        );
        return next;
      });
      setStatus("API key ready");
      setIsGeneratingKey(false);
    },
    [isGeneratingKey],
  );

  function handleAgentChange(nextAgentId: string) {
    setSelectedAgentId(nextAgentId);
    const nextAgent = initialAgents.find((agent) => agent.id === nextAgentId);
    if (!nextAgent) {
      return;
    }
    if (!apiKeysByAgent[nextAgent.id]) {
      void generateApiKeyForAgent(nextAgent);
    }
  }

  useEffect(() => {
    if (!isHydrated || !selectedAgent || isGeneratingKey) {
      return;
    }
    if (!apiKeysByAgent[selectedAgent.id]) {
      void generateApiKeyForAgent(selectedAgent);
    }
  }, [
    apiKeysByAgent,
    generateApiKeyForAgent,
    isGeneratingKey,
    isHydrated,
    selectedAgent,
  ]);

  if (!selectedAgent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Agent</CardTitle>
          <CardDescription>
            Create an agent first to connect an AI client.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-3xl">Connect Agent</CardTitle>
          <CardDescription>
            Select your agent, connect it to your client, then run high-signal
            wallet workflows.
          </CardDescription>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline">1. Agent selected</Badge>
            <Badge variant="outline">2. Connect via MCP or skill</Badge>
            <Badge variant="outline">3. Run workflows</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Select Agent</CardTitle>
            <CardDescription>Choose which agent to connect.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Agent</p>
              <div className="flex items-center gap-2">
                <select
                  value={selectedAgent.id}
                  onChange={(event) => handleAgentChange(event.target.value)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {initialAgents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  disabled={isGeneratingKey}
                  onClick={() => void generateApiKeyForAgent(selectedAgent)}
                  aria-label="Regenerate API key"
                >
                  <Bot className="size-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <p className="text-xs text-muted-foreground">Current balance</p>
              <p className="font-mono text-3xl">
                {formatSolAmount(selectedAgent.balanceSol)} SOL
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">MCP URL</p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={!mcpUrl}
                  onClick={() =>
                    mcpUrl ? void copyText(mcpUrl, "MCP URL copied") : undefined
                  }
                >
                  <Copy className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2">
                <Link2 className="size-4 text-muted-foreground" />
                <p className="truncate font-mono text-sm">{mcpUrl}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">API Key (Ready)</p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={!apiKey}
                  onClick={() =>
                    apiKey ? void copyText(apiKey, "API key copied") : undefined
                  }
                >
                  <Copy className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2">
                <KeyRound className="size-4 text-muted-foreground" />
                <p className="truncate font-mono text-sm">
                  {apiKey ?? "Preparing API key..."}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Add to Your AI Client</CardTitle>
            <CardDescription>
              Follow the steps below for your preferred client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Accordion
              type="single"
              collapsible
              value={expandedClient}
              onValueChange={setExpandedClient}
              className="rounded-md border"
            >
              {clientSetups.map((client) => {
                const Icon = client.icon;
                const snippets = client
                  .snippet(mcpUrl ?? "<MCP_URL>")
                  .map((line) =>
                    line.replace("<API_KEY>", apiKey ?? "<API_KEY>"),
                  );

                return (
                  <AccordionItem key={client.name} value={client.name}>
                    <AccordionTrigger>
                      <span className="inline-flex items-center gap-3 font-medium text-base">
                        <Icon className="size-4 text-primary" />
                        {client.name}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ol className="space-y-2 rounded-md bg-muted/30 text-sm">
                        {snippets.map((line, index) => (
                          <li
                            key={`${client.name}-${index}`}
                            className="flex gap-2"
                          >
                            <span className="whitespace-pre-wrap text-base">
                              {line}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
