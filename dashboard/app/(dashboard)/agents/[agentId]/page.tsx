import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgentRecord } from "@/lib/api";
import { serverApiRequest } from "@/lib/server-api";

function formatSolAmount(value: number | null) {
  if (value === null) {
    return "0.00";
  }

  return value.toFixed(2);
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const response = await serverApiRequest<{ agents: AgentRecord[] }>("/v1/agents");
  const agents = response.status < 400 ? response.data.agents : [];
  const agent = agents.find((item) => item.id === agentId) ?? null;

  if (!agent) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/agents">
            <ArrowLeft className="size-4" />
            Back to Agents
          </Link>
        </Button>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Agent not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link href="/agents">
          <ArrowLeft className="size-4" />
          Back to Agents
        </Link>
      </Button>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <div className="inline-flex size-12 items-center justify-center rounded-md bg-primary text-base font-semibold text-primary-foreground">
            {agent.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{agent.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Solana wallet details</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Solana</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className="rounded-md border p-4">
            <p className="text-xs text-muted-foreground">Public key</p>
            <p className="mt-2 break-all font-mono text-sm">{agent.publicKey}</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="mt-2 font-mono text-3xl">
              {formatSolAmount(agent.balanceSol)}{" "}
              <span className="font-sans text-base text-muted-foreground">SOL</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
