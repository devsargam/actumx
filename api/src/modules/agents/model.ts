import { t } from "elysia";

export namespace AgentsModel {
  export const createAgentBody = t.Object({
    name: t.String({ minLength: 2, maxLength: 80 }),
  });

  export const fundDevnetBody = t.Object({
    amountSol: t.Optional(t.Number({ minimum: 0.01, maximum: 2 })),
  });

  export type CreateAgentBody = typeof createAgentBody.static;
  export type FundDevnetBody = typeof fundDevnetBody.static;
}
