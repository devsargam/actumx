import { redirect } from "next/navigation";

import type { AgentRecord } from "@/lib/api";
import { DashboardLayoutClient } from "@/components/dashboard/layout-client";
import { getServerSession } from "@/lib/server-auth";
import { serverApiRequest } from "@/lib/server-api";
import { DashboardClient } from "@/app/(dashboard)/smth/dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const response = await serverApiRequest<{ agents: AgentRecord[] }>("/v1/agents");
  const agents = response.status < 400 ? response.data.agents : [];

  if (agents.length === 0) {
    redirect("/agents");
  }

  return (
    <DashboardLayoutClient initialUser={session.user}>
      <DashboardClient initialAgents={agents} />
    </DashboardLayoutClient>
  );
}
