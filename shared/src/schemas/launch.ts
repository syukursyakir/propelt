import { z } from "zod";

export const tierSchema = z.enum(["solo", "pro", "founder"]);
export type Tier = z.infer<typeof tierSchema>;

export const launchInputSchema = z.object({
  product_name: z.string().min(1).max(120),
  tagline: z.string().max(240).optional(),
  description: z.string().max(4000).optional(),
  category: z.string().max(80).optional(),
  target_audience: z.string().max(500).optional(),
  features: z.array(z.string().max(240)).max(20).optional(),
  founder_story: z.string().max(4000).optional(),
  launch_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  website_url: z.string().url().optional(),
  demo_url: z.string().url().optional(),
});
export type LaunchInput = z.infer<typeof launchInputSchema>;

export const launchSchema = launchInputSchema.extend({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  tier: tierSchema,
  paid_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Launch = z.infer<typeof launchSchema>;
