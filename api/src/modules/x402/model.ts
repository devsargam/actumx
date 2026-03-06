import { z } from "zod";

export namespace X402Model {
  const optionalTrimmedTopicSchema = z
    .string()
    .trim()
    .transform((topic) => (topic.length === 0 ? undefined : topic))
    .optional();

  export const settleBodySchema = z.object({
    paymentId: z.string().trim().min(6),
  });

  export const quoteQuerySchema = z
    .object({
      topic: optionalTrimmedTopicSchema,
    })
    .passthrough();

  export const jsonRpcRequestSchema = z
    .object({
      jsonrpc: z.literal("2.0").optional(),
      id: z.union([z.string(), z.number(), z.null()]).optional(),
      method: z.string(),
      params: z.unknown().optional(),
    })
    .strict();

  export const toolCallParamsSchema = z
    .object({
      name: z.string(),
      arguments: z.unknown().optional(),
    })
    .strict();

  export const walletBalanceArgumentsSchema = z
    .object({
      agentId: z.string().trim().min(1).optional(),
    })
    .strict();

  export const walletSendArgumentsSchema = z
    .object({
      agentId: z.string().trim().min(1).optional(),
      toPublicKey: z.string().trim().min(1),
      amountSol: z.number().positive(),
    })
    .strict();

  export type SettleBody = z.infer<typeof settleBodySchema>;
  export type QuoteQuery = z.infer<typeof quoteQuerySchema>;
  export type JsonRpcRequest = z.infer<typeof jsonRpcRequestSchema>;
  export type ToolCallParams = z.infer<typeof toolCallParamsSchema>;
  export type WalletBalanceArguments = z.infer<typeof walletBalanceArgumentsSchema>;
  export type WalletSendArguments = z.infer<typeof walletSendArgumentsSchema>;
}
