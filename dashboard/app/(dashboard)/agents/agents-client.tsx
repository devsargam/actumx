"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, formatTimestamp, type AgentRecord } from "@/lib/api";

type CreateAgentResponse = {
  agentId?: string;
  privateKey?: string;
  error?: string;
};

type AgentDescriptionMap = Record<string, string>;
type AgentSecretMap = Record<string, string>;

const AGENT_DESCRIPTIONS_KEY = "agent_descriptions";
const AGENT_SECRETS_KEY = "agent_private_keys";

function randomKey(prefix: string) {
  const body = Array.from({ length: 44 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return `${prefix}_${body}`;
}

export function AgentsClient({ initialAgents }: { initialAgents: AgentRecord[] }) {
  const [name, setName] = useState("My First Agent");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Ready");
  const [agents, setAgents] = useState<AgentRecord[]>(initialAgents);
  const [descriptions, setDescriptions] = useState<AgentDescriptionMap>({});
  const [secrets, setSecrets] = useState<AgentSecretMap>({});

  const loadAgents = useCallback(async () => {
    const response = await apiRequest<{ agents: AgentRecord[] }>("/v1/agents");
    if (response.status < 400) {
      setAgents(response.data.agents);
    }
  }, []);

  useEffect(() => {
    const storedDescriptions = window.localStorage.getItem(AGENT_DESCRIPTIONS_KEY);
    const storedSecrets = window.localStorage.getItem(AGENT_SECRETS_KEY);

    if (storedDescriptions) {
      setDescriptions(JSON.parse(storedDescriptions) as AgentDescriptionMap);
    }
    if (storedSecrets) {
      setSecrets(JSON.parse(storedSecrets) as AgentSecretMap);
    }
  }, []);

  const isEmpty = agents.length === 0;

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
    const nextSecrets = {
      ...secrets,
      [response.data.agentId]: response.data.privateKey ?? randomKey("priv"),
    };

    window.localStorage.setItem(AGENT_DESCRIPTIONS_KEY, JSON.stringify(nextDescriptions));
    window.localStorage.setItem(AGENT_SECRETS_KEY, JSON.stringify(nextSecrets));

    setDescriptions(nextDescriptions);
    setSecrets(nextSecrets);
    setName("My First Agent");
    setDescription("");
    setStatus("Agent created.");

    await loadAgents();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          {isEmpty ? "Create your first agent to get started" : "Agents"}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Creating an agent gives you individual wallets that you can access via MCP or skill.
        </p>
      </div>

      <Card className="mx-auto max-w-2xl border-white/10 bg-white/[0.03] text-slate-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">Create Agent</CardTitle>
          <CardDescription className="text-slate-400">
            Provide name and optional description. Solana keypair is generated on creation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-sm text-slate-300">Agent Name</p>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="border-white/15 bg-black/20 text-white"
              placeholder="My First Agent"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm text-slate-300">Description (Optional)</p>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="border-white/15 bg-black/20 text-white"
              placeholder="Describe what this agent will do..."
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => void handleCreateAgent()}>
              Create Agent
            </Button>
          </div>

          <p className="text-xs text-slate-400">{status}</p>
        </CardContent>
      </Card>

      {!isEmpty ? (
        <Card className="border-white/10 bg-white/[0.03] text-slate-100 ring-white/10">
          <CardHeader>
            <CardTitle className="text-white">Created Agents</CardTitle>
            <CardDescription className="text-slate-400">Wallets created for this user.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {agents.map((agent) => (
                <div key={agent.id} className="rounded-md border border-white/15 bg-[#0f1527] p-4">
                  <p className="text-base font-semibold text-white">{agent.name}</p>
                  {descriptions[agent.id] ? <p className="mt-2 text-sm text-slate-400">{descriptions[agent.id]}</p> : null}

                  <div className="mt-4 space-y-3 font-mono text-xs">
                    <div>
                      <p className="text-slate-400">Solana Public Key</p>
                      <p className="break-all text-slate-100">{agent.publicKey}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Solana Private Key</p>
                      <p className="break-all text-slate-100">{secrets[agent.id] ?? "Hidden after creation"}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">Created {formatTimestamp(agent.createdAt)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
