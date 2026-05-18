import { z } from "zod";

export const healthCheckSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  timestamp: z.string().datetime(),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;
