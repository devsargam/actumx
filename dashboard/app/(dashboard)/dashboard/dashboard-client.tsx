"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpDown, Check, ChevronRight, Copy, X } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, type AgentRecord } from "@/lib/api";

function formatSolAmount(value: number | null) {
  if (value === null) {
    return "0.00";
  }

  return value.toFixed(2);
}

type FundDevnetResponse = {
  signature?: string;
  explorerUrl?: string;
  error?: string;
  balanceSol?: number | null;
};

export function DashboardClient({ initialAgents }: { initialAgents: AgentRecord[] }) {
  const [agents, setAgents] = useState<AgentRecord[]>(initialAgents);
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(initialAgents[0]?.id ?? "");
  const [fundAmountSol, setFundAmountSol] = useState("1");
  const [fundStatus, setFundStatus] = useState("Ready");
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);

  const totalBalance = useMemo(
    () => agents.reduce((sum, agent) => sum + (agent.balanceSol ?? 0), 0),
    [agents]
  );

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? agents[0],
    [agents, selectedAgentId]
  );

  async function refreshAgents() {
    const response = await apiRequest<{ agents: AgentRecord[] }>("/v1/agents");
    if (response.status < 400) {
      setAgents(response.data.agents);
    }
  }

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
    setFundStatus("Public key copied");
  }

  async function fundSelectedAgent() {
    if (!selectedAgent) {
      setFundStatus("No agent selected");
      return;
    }

    setFundStatus("Funding from Solana Devnet faucet...");
    const response = await apiRequest<FundDevnetResponse>(`/v1/agents/${selectedAgent.id}/fund-devnet`, {
      method: "POST",
      body: { amountSol: Number(fundAmountSol) },
    });

    if (response.status >= 400 || !response.data.signature) {
      setFundStatus(`Failed: ${response.data.error ?? "unknown error"}`);
      return;
    }

    setTxSignature(response.data.signature);
    setExplorerUrl(response.data.explorerUrl ?? null);
    setFundStatus("Funding successful");
    await refreshAgents();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-base text-muted-foreground">
          Give your AI agents their own wallets to make payments and transactions autonomously.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Agent Wallet Balances</CardTitle>
            <CardDescription>Balances may take a few seconds to update.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" asChild>
              <Link href="/agents">Create Agent</Link>
            </Button>

            <AlertDialog open={isFundOpen} onOpenChange={setIsFundOpen}>
              <AlertDialogTrigger asChild>
                <Button>Fund Agent</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-2xl rounded-xl p-0">
                <AlertDialogHeader className="flex flex-row items-center justify-between border-b px-6 py-5 text-left">
                  <AlertDialogTitle className="text-2xl">Fund Agent</AlertDialogTitle>
                  <AlertDialogCancel asChild className="p-0">
                    <Button variant="ghost" size="icon-sm" aria-label="Close fund agent dialog">
                      <X className="size-4" />
                    </Button>
                  </AlertDialogCancel>
                </AlertDialogHeader>

                <div className="space-y-4 px-6 py-5">
                  <div className="border-b px-2 py-2 text-center font-medium">Deposit</div>

                  <div className="rounded-lg border border-amber-300/60 bg-amber-100/40 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-200">
                    <p className="font-semibold">Only send on supported networks</p>
                    <p className="mt-1 text-sm">Use Solana Devnet faucet funding for testing only.</p>
                    <p className="text-sm">Do not send mainnet funds to test addresses.</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Agent</p>
                    <select
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                      value={selectedAgent?.id}
                      onChange={(event) => setSelectedAgentId(event.target.value)}
                    >
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-medium">Solana</p>
                        <p className="mt-1 break-all font-mono text-sm text-muted-foreground">{selectedAgent?.publicKey ?? "-"}</p>
                      </div>
                      {selectedAgent ? (
                        <Button variant="ghost" size="icon-sm" onClick={() => void copyText(selectedAgent.publicKey)}>
                          <Copy className="size-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Amount (SOL)</p>
                    <Input
                      type="number"
                      min={0.01}
                      max={2}
                      step={0.01}
                      value={fundAmountSol}
                      onChange={(event) => setFundAmountSol(event.target.value)}
                    />
                  </div>

                  {txSignature ? (
                    <div className="rounded-lg border border-emerald-300/60 bg-emerald-100/40 p-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-200">
                      <p className="inline-flex items-center gap-1 font-medium">
                        <Check className="size-4" /> Funded successfully
                      </p>
                      {explorerUrl ? (
                        <p className="mt-1">
                          <a href={explorerUrl} target="_blank" rel="noreferrer" className="underline">
                            View transaction on Solana Explorer
                          </a>
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <p className="text-sm text-muted-foreground">{fundStatus}</p>
                </div>

                <AlertDialogFooter className="border-t px-6 py-4 sm:justify-end">
                  <AlertDialogCancel asChild>
                    <Button variant="secondary">Done</Button>
                  </AlertDialogCancel>
                  <Button onClick={() => void fundSelectedAgent()}>Fund from Devnet</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="font-mono text-5xl font-semibold">{formatSolAmount(totalBalance)} SOL</p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent) => (
              <article key={agent.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-3 truncate font-medium">{agent.name}</p>
                <p className="mt-5 font-mono text-2xl">{formatSolAmount(agent.balanceSol)} SOL</p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Recent Transactions</CardTitle>
          <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            View All
            <ChevronRight className="size-4" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            <div className="text-center">
              <ArrowUpDown className="mx-auto size-10" />
              <p className="mt-2 text-sm">No transactions yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
