import { t } from "elysia";

export namespace AgentsModel {
  export const createAgentBody = t.Object({
    name: t.String({ minLength: 2, maxLength: 80 }),
  });

  export type CreateAgentBody = typeof createAgentBody.static;
}
