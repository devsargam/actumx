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
  .patch(
    "/:agentId",
    async ({ request, params, body, set }) => {
      const result = await AgentsService.update(request, params.agentId, body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: AgentsModel.updateAgentBody }
  )
  .delete(
    "/:agentId",
    async ({ request, params, set }) => {
      const result = await AgentsService.delete(request, params.agentId);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .post(
    "/:agentId/fund-devnet",
    async ({ request, params, body, set }) => {
      const result = await AgentsService.fundDevnet(request, params.agentId, body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: AgentsModel.fundDevnetBody }
  )
  .post(
    "/:agentId/send",
    async ({ request, params, body, set }) => {
      const result = await AgentsService.send(request, params.agentId, body);
      set.status = result.statusCode;
      return result.body;
    },
    { body: AgentsModel.sendBody }
  );
