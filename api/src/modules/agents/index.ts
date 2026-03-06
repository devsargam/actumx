import { Elysia } from "elysia";

import { getZodErrorMessage, ZOD_VALIDATION_ERROR } from "../../lib/zod-validation";
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
      const parsedBody = AgentsModel.createAgentBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await AgentsService.create(request, parsedBody.data);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .patch(
    "/:agentId",
    async ({ request, params, body, set }) => {
      const parsedParams = AgentsModel.agentIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const parsedBody = AgentsModel.updateAgentBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await AgentsService.update(
        request,
        parsedParams.data.agentId,
        parsedBody.data
      );
      set.status = result.statusCode;
      return result.body;
    }
  )
  .delete(
    "/:agentId",
    async ({ request, params, set }) => {
      const parsedParams = AgentsModel.agentIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const result = await AgentsService.delete(request, parsedParams.data.agentId);
      set.status = result.statusCode;
      return result.body;
    }
  )
  .post(
    "/:agentId/fund-devnet",
    async ({ request, params, body, set }) => {
      const parsedParams = AgentsModel.agentIdParamsSchema.safeParse(params);
      if (!parsedParams.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedParams.error),
        };
      }

      const parsedBody = AgentsModel.fundDevnetBodySchema.safeParse(body);
      if (!parsedBody.success) {
        set.status = 400;
        return {
          error: ZOD_VALIDATION_ERROR,
          message: getZodErrorMessage(parsedBody.error),
        };
      }

      const result = await AgentsService.fundDevnet(
        request,
        parsedParams.data.agentId,
        parsedBody.data
      );
      set.status = result.statusCode;
      return result.body;
    }
  );
