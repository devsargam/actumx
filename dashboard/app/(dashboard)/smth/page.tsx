import { redirect } from "next/navigation";

import type { AgentRecord } from "@/lib/api";
import { serverApiRequest } from "@/lib/server-api";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const response = await serverApiRequest<{ agents: AgentRecord[] }>("/v1/agents");
  const agents = response.status < 400 ? response.data.agents : [];

  if (agents.length === 0) {
    redirect("/agents");
  }

  return <DashboardClient initialAgents={agents} />;
}
