import type { AgentRecord } from "@/lib/api";
import { serverApiRequest } from "@/lib/server-api";

import { ConnectAgentClient } from "./connect-agent-client";

export default async function ConnectAgentPage() {
  const agentsResponse = await serverApiRequest<{ agents: AgentRecord[] }>("/v1/agents");
  const agents = agentsResponse.status < 400 ? agentsResponse.data.agents : [];

  return <ConnectAgentClient initialAgents={agents} />;
}
