import { z } from "zod";

export const healthCheckSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  timestamp: z.string().datetime(),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;

export const candidateProfileSchema = z.object({
  fullName: z.string().min(1),
  school: z.string().min(1),
  course: z.string().min(1),
  graduationYear: z.string().min(1),
  userType: z.enum([
    "university_student",
    "poly_student",
    "fresh_graduate",
    "early_career",
  ]),
  targetRole: z.string().min(1),
  targetIndustry: z.string().min(1),
});

export type CandidateProfile = z.infer<typeof candidateProfileSchema>;

export const resumeSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Resume = z.infer<typeof resumeSchema>;

export const applicationQuestionSchema = z.object({
  targetRoleOrIndustry: z.string().min(1),
  strongestSkills: z.string().min(1),
  proudestExperiences: z.string().min(1),
  achievementsToHighlight: z.string().min(1),
  guardrails: z.string().min(1),
});

export type ApplicationQuestions = z.infer<typeof applicationQuestionSchema>;

const bulletListSchema = z.array(z.string());

export const generatedResultSchema = z.object({
  sectionA: z.object({
    fitScore: z.number().int().min(0).max(100),
    strongMatches: bulletListSchema,
    potentialGaps: bulletListSchema,
    recommendedFocus: bulletListSchema,
  }),
  sectionB: z.object({
    alreadyDemonstrated: bulletListSchema,
    weaklyDemonstrated: bulletListSchema,
    missing: bulletListSchema,
  }),
  sectionC: z.object({
    professionalSummary: z.string(),
  }),
  sectionD: z.object({
    tailoredResumeMarkdown: z.string(),
  }),
  sectionE: z.object({
    changes: bulletListSchema,
  }),
  sectionF: z.object({
    suggestions: bulletListSchema,
  }),
});

export type GeneratedResult = z.infer<typeof generatedResultSchema>;

export const generateApplicationRequestSchema = z.object({
  resumeId: z.string().uuid(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  jobDescription: z.string().min(50),
  questions: applicationQuestionSchema,
});

export type GenerateApplicationRequest = z.infer<
  typeof generateApplicationRequestSchema
>;

export const applicationSchema = z.object({
  id: z.string().uuid(),
  resumeId: z.string().uuid(),
  jobTitle: z.string().nullable(),
  companyName: z.string().nullable(),
  jobDescription: z.string(),
  questions: applicationQuestionSchema,
  result: generatedResultSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Application = z.infer<typeof applicationSchema>;
