import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgentRecord } from "@/lib/api";
import { serverApiRequest } from "@/lib/server-api";

function formatCurrencyFromSol(value: number | null) {
  if (value === null) {
    return "$0.00";
  }

  return `$${value.toFixed(2)}`;
}

export default async function DashboardPage() {
  const response = await serverApiRequest<{ agents: AgentRecord[] }>("/v1/agents");
  const agents = response.status < 400 ? response.data.agents : [];

  if (agents.length === 0) {
    redirect("/agents");
  }

  const totalBalance = agents.reduce((sum, agent) => sum + (agent.balanceSol ?? 0), 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Give your AI agents their own wallets to make payments and transactions autonomously.
        </p>
      </div>

      <Card className="border-white/10 bg-white/[0.03] text-slate-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Agent Wallet Balances</CardTitle>
          <CardDescription className="text-slate-400">Balances may take a few seconds to update.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="font-mono text-5xl font-semibold tracking-tight text-white">
            {formatCurrencyFromSol(totalBalance)} <span className="text-xl text-slate-400">USD</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-md border border-white/15 bg-[#0f1527] p-4">
                <p className="truncate text-base font-medium text-white">{agent.name}</p>
                <p className="mt-2 font-mono text-sm text-slate-400">{agent.publicKey.slice(0, 14)}...{agent.publicKey.slice(-8)}</p>
                <p className="mt-6 font-mono text-3xl text-white">{formatCurrencyFromSol(agent.balanceSol)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-slate-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-60 items-center justify-center rounded-md border border-white/10 bg-[#0f1527] text-slate-500">
            No transactions yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
