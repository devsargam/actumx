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
import { clientSetups } from "./client-setup-data";

const CONNECT_AGENT_KEYS_STORAGE = "connect_agent_api_keys";
const DEFAULT_MCP_URL = env.MCP_URL;

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
                const snippets = client.snippet({
                  mcpUrl: mcpUrl ?? "<MCP_URL>",
                  apiKey: apiKey ?? "<API_KEY>",
                });

                return (
                  <AccordionItem key={client.name} value={client.name}>
                    <AccordionTrigger className="**:data-[slot=accordion-trigger-icon]:size-6">
                      <span className="inline-flex items-center gap-3 font-medium text-base">
                        <Icon className="size-4 text-primary" />
                        {client.name}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ol className="space-y-1 rounded-md text-sm">
                        {snippets}
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
