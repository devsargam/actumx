"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, formatTimestamp, type AgentRecord } from "@/lib/api";

type CreateAgentResponse = {
  agentId?: string;
  name?: string;
  publicKey?: string;
  privateKey?: string;
  balanceLamports?: number | null;
  balanceSol?: number | null;
  error?: string;
};

export default function AgentsPage() {
  const [name, setName] = useState("Research Agent");
  const [status, setStatus] = useState("Ready");
  const [latestSecret, setLatestSecret] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentRecord[]>([]);

  const loadAgents = useCallback(async () => {
    const response = await apiRequest<{ agents: AgentRecord[] }>("/v1/agents");
    if (response.status < 400) {
      setAgents(response.data.agents);
    }
  }, []);

  useEffect(() => {
    void loadAgents();
  }, [loadAgents]);

  async function handleCreateAgent() {
    setStatus("Creating agent wallet...");
    const response = await apiRequest<CreateAgentResponse>("/v1/agents", {
      method: "POST",
      body: { name },
    });

    if (response.status >= 400 || !response.data.agentId || !response.data.privateKey) {
      setStatus(`Failed: ${response.data.error ?? "unknown error"}`);
      return;
    }

    setLatestSecret(response.data.privateKey);
    setStatus("Agent created. Save private key now.");
    await loadAgents();
  }

  async function copyLatestSecret() {
    if (!latestSecret) return;
    await navigator.clipboard.writeText(latestSecret);
    setStatus("Private key copied");
  }

  async function copyPublicKey(value: string) {
    await navigator.clipboard.writeText(value);
    setStatus("Public key copied");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Agents</CardTitle>
          <CardDescription>Create Solana wallet agents and track live balances.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Agent Wallet</CardTitle>
          <CardDescription>Private key is shown only once and is never stored in dashboard storage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
            <Button onClick={() => void handleCreateAgent()}>Create Agent</Button>
          </div>
          {latestSecret ? (
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs">Latest private key (base64)</p>
              <p className="mt-1 break-all font-mono text-xs">{latestSecret}</p>
              <Button variant="outline" size="sm" onClick={() => void copyLatestSecret()} className="mt-2">
                Copy
              </Button>
            </div>
          ) : null}
          <p className="text-muted-foreground text-xs">{status}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Created Agents</CardTitle>
          <CardDescription>Public keys and current on-chain balance from configured Solana RPC.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Public Key</th>
                <th className="py-2 text-left">Balance (SOL)</th>
                <th className="py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t">
                  <td className="py-2">{agent.name}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="max-w-[280px] truncate font-mono text-xs">{agent.publicKey}</span>
                      <Button size="sm" variant="outline" onClick={() => void copyPublicKey(agent.publicKey)}>
                        Copy
                      </Button>
                    </div>
                  </td>
                  <td className="py-2">
                    {agent.balanceSol === null ? <span className="text-muted-foreground">{agent.error ?? "-"}</span> : agent.balanceSol}
                  </td>
                  <td className="py-2 text-xs">{formatTimestamp(agent.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
