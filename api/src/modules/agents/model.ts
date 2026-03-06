import { z } from "zod";

export namespace AgentsModel {
  export const createAgentBodySchema = z.object({
    name: z.string().trim().min(2).max(80),
  });

  export const updateAgentBodySchema = z.object({
    name: z.string().trim().min(2).max(80),
  });

  export const fundDevnetBodySchema = z.object({
    amountSol: z.number().min(0.01).max(2).optional(),
  });

  export const agentIdParamsSchema = z.object({
    agentId: z.string().trim().min(1),
  });

  export type CreateAgentBody = z.infer<typeof createAgentBodySchema>;
  export type UpdateAgentBody = z.infer<typeof updateAgentBodySchema>;
  export type FundDevnetBody = z.infer<typeof fundDevnetBodySchema>;
  export type AgentIdParams = z.infer<typeof agentIdParamsSchema>;
}
