import type { AgentRecord } from "@/lib/api";
import { serverApiRequest } from "@/lib/server-api";

import { AgentsClient } from "./agents-client";

export default async function AgentsPage() {
  const response = await serverApiRequest<{ agents: AgentRecord[] }>("/v1/agents");
  const initialAgents = response.status < 400 ? response.data.agents : [];

  return <AgentsClient initialAgents={initialAgents} />;
}
