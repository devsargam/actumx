import { Elysia } from "elysia";

import { AgentsModel } from "./model";
import { AgentsService } from "./service";

export const agentsModule = new Elysia({ name: "module.agents", prefix: "/v1/agents" })
  .get("", async ({ request, set }) => {
    const result = await AgentsService.list(request);
    set.status = result.statusCode;
    return result.body;
  })
  .post(
    "",
    async ({ request, body, set }) => {
      const result = await AgentsService.create(request, body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: AgentsModel.createAgentBody }
  )
  .post(
    "/:agentId/fund-devnet",
    async ({ request, params, body, set }) => {
      const result = await AgentsService.fundDevnet(request, params.agentId, body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: AgentsModel.fundDevnetBody }
  );
