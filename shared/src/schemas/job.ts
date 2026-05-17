import { z } from "zod";

export const experienceLevelSchema = z.enum([
  "internship",
  "fresh_grad",
  "junior",
  "mid_career_switcher",
]);
export type ExperienceLevel = z.infer<typeof experienceLevelSchema>;

export const employmentTypeSchema = z.enum(["internship", "full_time", "contract", "traineeship"]);
export type EmploymentType = z.infer<typeof employmentTypeSchema>;

export const questionStatusSchema = z.enum(["open", "answered", "skipped"]);
export type QuestionStatus = z.infer<typeof questionStatusSchema>;

export const jobTargetInputSchema = z.object({
  target_role: z.string().min(1).max(120),
  industry: z.string().max(120).optional(),
  experience_level: experienceLevelSchema,
  employment_type: employmentTypeSchema,
  job_description: z.string().max(30000).optional(),
  preferences: z.record(z.unknown()).optional(),
});
export type JobTargetInput = z.infer<typeof jobTargetInputSchema>;

export const jobTargetSchema = jobTargetInputSchema.extend({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  resume_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type JobTarget = z.infer<typeof jobTargetSchema>;

export const resumeQuestionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  resume_id: z.string().uuid(),
  job_target_id: z.string().uuid().nullable(),
  question: z.string(),
  reason: z.string().nullable(),
  status: questionStatusSchema,
  order_index: z.number().int().min(0),
  created_at: z.string().datetime(),
});
export type ResumeQuestion = z.infer<typeof resumeQuestionSchema>;

export const resumeAnswerInputSchema = z.object({
  answer: z.string().max(4000).optional(),
  skipped: z.boolean().optional(),
});
export type ResumeAnswerInput = z.infer<typeof resumeAnswerInputSchema>;

export const resumeAnswerSchema = z.object({
  id: z.string().uuid(),
  question_id: z.string().uuid(),
  user_id: z.string().uuid(),
  answer: z.string().nullable(),
  skipped: z.boolean(),
  created_at: z.string().datetime(),
});
export type ResumeAnswer = z.infer<typeof resumeAnswerSchema>;
