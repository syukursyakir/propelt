import { z } from "zod";

// Sacred IDs — never rename once shipped.
// Pattern: t-{day}_{action}, e.g., t-7_notify_hunters, t-0_post_at_midnight.
export const checklistTaskKeySchema = z
  .string()
  .regex(/^t-\d+_[a-z0-9_]+$/, "must match t-{day}_{snake_action}");

export const checklistProgressSchema = z.object({
  id: z.string().uuid(),
  launch_id: z.string().uuid(),
  task_key: checklistTaskKeySchema,
  completed_at: z.string().datetime().nullable(),
});
export type ChecklistProgress = z.infer<typeof checklistProgressSchema>;
