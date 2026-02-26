"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Ellipsis, Plus, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, type AgentRecord } from "@/lib/api";

type CreateAgentResponse = {
  agentId?: string;
  publicKey?: string;
  privateKey?: string;
  error?: string;
};

type AgentDescriptionMap = Record<string, string>;

const AGENT_DESCRIPTIONS_KEY = "agent_descriptions";

function formatSolAmount(value: number | null) {
  if (value === null) {
    return "0.00";
  }

  return value.toFixed(2);
}

function relativeFromNow(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AgentsClient({ initialAgents }: { initialAgents: AgentRecord[] }) {
  const [name, setName] = useState("My First Agent");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Ready");
  const [agents, setAgents] = useState<AgentRecord[]>(initialAgents);
  const [descriptions, setDescriptions] = useState<AgentDescriptionMap>({});
  const [createOpen, setCreateOpen] = useState(initialAgents.length === 0);
  const [latestSecret, setLatestSecret] = useState<string | null>(null);
  const [latestPublic, setLatestPublic] = useState<string | null>(null);

  const loadAgents = useCallback(async () => {
    const response = await apiRequest<{ agents: AgentRecord[] }>("/v1/agents");
    if (response.status < 400) {
      setAgents(response.data.agents);
    }
  }, []);

  useEffect(() => {
    const storedDescriptions = window.localStorage.getItem(AGENT_DESCRIPTIONS_KEY);

    if (storedDescriptions) {
      setDescriptions(JSON.parse(storedDescriptions) as AgentDescriptionMap);
    }
  }, []);

  const isEmpty = agents.length === 0;
  const totalAgents = agents.length;

  async function handleCreateAgent() {
    if (!name.trim()) {
      setStatus("Agent name is required.");
      return;
    }

    setStatus("Creating agent wallet...");

    const response = await apiRequest<CreateAgentResponse>("/v1/agents", {
      method: "POST",
      body: { name: name.trim() },
    });

    if (response.status >= 400 || !response.data.agentId) {
      setStatus(`Failed: ${response.data.error ?? "unknown error"}`);
      return;
    }

    const nextDescriptions = {
      ...descriptions,
      ...(description.trim() ? { [response.data.agentId]: description.trim() } : {}),
    };

    window.localStorage.setItem(AGENT_DESCRIPTIONS_KEY, JSON.stringify(nextDescriptions));

    setDescriptions(nextDescriptions);
    setLatestSecret(response.data.privateKey ?? null);
    setLatestPublic(response.data.publicKey ?? null);
    setName("My First Agent");
    setDescription("");
    setStatus("Agent created.");
    setCreateOpen(false);

    await loadAgents();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Agent Wallets</h1>
          <p className="mt-2 text-base text-muted-foreground">Manage your agents wallets and access them via MCP or skill.</p>
          {!isEmpty ? <p className="mt-1 text-sm text-muted-foreground">{totalAgents} agent wallets</p> : null}
        </div>

        <AlertDialog open={createOpen} onOpenChange={setCreateOpen}>
          <AlertDialogTrigger asChild>
            <Button size="lg">
              <Plus className="size-4" />
              Create Agent
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-xl rounded-xl p-0">
            <AlertDialogHeader className="flex flex-row items-center justify-between border-b px-6 py-5 text-left">
              <AlertDialogTitle className="text-2xl">Create New Agent</AlertDialogTitle>
              <AlertDialogCancel asChild className="p-0">
                <Button variant="ghost" size="icon-sm" aria-label="Close create agent dialog">
                  <X className="size-4" />
                </Button>
              </AlertDialogCancel>
            </AlertDialogHeader>

            <div className="space-y-4 px-6 py-5">
              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="text-base text-muted-foreground">
                  Once created, this agent gets its own wallet and can be used via MCP or your agent tooling.
                </p>

                <div className="mt-4 space-y-1.5">
                  <p className="text-sm text-muted-foreground">Agent Name</p>
                  <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="My First Agent" />
                </div>

                <p className="mt-2 text-sm text-muted-foreground">e.g. Claude, Research Bot, Trading Agent</p>

                <div className="mt-4 space-y-1.5">
                  <p className="text-sm text-muted-foreground">Description (Optional)</p>
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe what this agent will do..."
                  />
                </div>
              </div>

              {latestSecret ? (
                <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                  <p className="font-medium">Latest agent keys (shown once)</p>
                  {latestPublic ? <p className="mt-1 break-all">Public: {latestPublic}</p> : null}
                  <p className="mt-1 break-all">Private: {latestSecret}</p>
                </div>
              ) : null}

              <p className="text-xs text-muted-foreground">{status}</p>
            </div>

            <AlertDialogFooter className="border-t px-6 py-4 sm:justify-end">
              <AlertDialogCancel asChild>
                <Button variant="secondary">Cancel</Button>
              </AlertDialogCancel>
              <Button variant="outline" onClick={() => void handleCreateAgent()}>Create Agent</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {!isEmpty ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="border-primary/25">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex size-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{relativeFromNow(agent.createdAt)}</p>
                    </div>
                  </div>
                  <Ellipsis className="size-4 text-muted-foreground" />
                </div>

                <p className="mt-8 font-mono text-3xl">{formatSolAmount(agent.balanceSol)} <span className="font-sans text-xl text-muted-foreground">SOL</span></p>

                {descriptions[agent.id] ? <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{descriptions[agent.id]}</p> : null}

                <div className="mt-6 flex justify-end">
                  <ChevronRight className="size-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
