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

export const notificationModeSchema = z.enum(["instant", "digest"]);

export const digestFrequencySchema = z.enum(["daily", "weekly"]);

export const notificationProfileSchema = z.object({
  notificationMode: notificationModeSchema,
  digestFrequency: digestFrequencySchema,
  watchPoliticians: z.array(z.string()),
  watchTickers: z.array(z.string()),
  sendBuyAlerts: z.boolean(),
  sendSellAlerts: z.boolean()
});

export type NotificationProfile = z.infer<typeof notificationProfileSchema>;

export const signInRequestSchema = z.object({
  email: z.string().email(),
  redirectTo: z.string().url().optional()
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export const signInRequestResponseSchema = z.object({
  ok: z.literal(true),
  email: z.string().email(),
  magicLink: z.string().url(),
  expiresAt: z.string()
});

export type SignInRequestResponse = z.infer<
  typeof signInRequestResponseSchema
>;

export const signInCompleteRequestSchema = z.object({
  token: z.string().min(16)
});

export type SignInCompleteRequest = z.infer<typeof signInCompleteRequestSchema>;

export const authSessionSchema = z.object({
  sessionToken: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
  expiresAt: z.string(),
  profile: notificationProfileSchema
});

export type AuthSession = z.infer<typeof authSessionSchema>;

export const signInCompleteResponseSchema = z.object({
  ok: z.literal(true),
  session: authSessionSchema
});

export type SignInCompleteResponse = z.infer<
  typeof signInCompleteResponseSchema
>;

export const updateNotificationProfileSchema = notificationProfileSchema;

export type UpdateNotificationProfile = z.infer<
  typeof updateNotificationProfileSchema
>;
