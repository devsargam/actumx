import { t } from "elysia";

export namespace AgentsModel {
  export const createAgentBody = t.Object({
    name: t.String({ minLength: 2, maxLength: 80 }),
  });

  export const fundDevnetBody = t.Object({
    amountSol: t.Optional(t.Number({ minimum: 0.01, maximum: 2 })),
  });

  export const sendBody = t.Object({
    toPublicKey: t.String({ minLength: 32, maxLength: 64, pattern: "\\S" }),
    amountSol: t.Number({ exclusiveMinimum: 0 }),
  });

  export const updateAgentBody = t.Object({
    // Prevent empty or whitespace-only names
    name: t.String({ minLength: 2, maxLength: 80, pattern: "\\S" }),
  });

  export type CreateAgentBody = typeof createAgentBody.static;
  export type FundDevnetBody = typeof fundDevnetBody.static;
  export type SendBody = typeof sendBody.static;
  export type UpdateAgentBody = typeof updateAgentBody.static;
}
