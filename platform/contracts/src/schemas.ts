import { z } from "zod";

export const healthResponseSchema = z.object({
  ok: z.literal(true),
  service: z.string()
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const tradeSideSchema = z.enum(["buy", "sell"]);

export const tradeSourceSchema = z.enum(["house", "senate"]);

export const tradeSchema = z.object({
  id: z.string(),
  source: tradeSourceSchema,
  politician: z.string(),
  ticker: z.string(),
  side: tradeSideSchema,
  reportedAt: z.string(),
  estimatedValueLow: z.number().nonnegative().optional(),
  estimatedValueHigh: z.number().nonnegative().optional(),
  disclosedPercent: z.number().min(0).max(100).optional(),
  remainingPercent: z.number().min(0).max(100).optional()
});

export type Trade = z.infer<typeof tradeSchema>;

export const watchRuleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  ticker: z.string().optional(),
  politician: z.string().optional(),
  side: tradeSideSchema.optional(),
  minDisclosedPercent: z.number().min(0).max(100).optional()
});

export type WatchRule = z.infer<typeof watchRuleSchema>;

export const executionRequestSchema = z.object({
  tradeId: z.string(),
  amountPence: z.number().int().positive(),
  confirmed: z.literal(true)
});

export type ExecutionRequest = z.infer<typeof executionRequestSchema>;
