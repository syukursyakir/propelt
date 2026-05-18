import OpenAI from "openai";
import { generatedResultSchema } from "@propelt/shared";
import type {
  ApplicationQuestions,
  CandidateProfile,
  GeneratedResult,
} from "@propelt/shared";
import { env } from "./env.js";

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

const generationJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["sectionA", "sectionB", "sectionC", "sectionD", "sectionE", "sectionF"],
  properties: {
    sectionA: {
      type: "object",
      additionalProperties: false,
      required: ["fitScore", "strongMatches", "potentialGaps", "recommendedFocus"],
      properties: {
        fitScore: { type: "integer", minimum: 0, maximum: 100 },
        strongMatches: { type: "array", items: { type: "string" } },
        potentialGaps: { type: "array", items: { type: "string" } },
        recommendedFocus: { type: "array", items: { type: "string" } },
      },
    },
    sectionB: {
      type: "object",
      additionalProperties: false,
      required: ["alreadyDemonstrated", "weaklyDemonstrated", "missing"],
      properties: {
        alreadyDemonstrated: { type: "array", items: { type: "string" } },
        weaklyDemonstrated: { type: "array", items: { type: "string" } },
        missing: { type: "array", items: { type: "string" } },
      },
    },
    sectionC: {
      type: "object",
      additionalProperties: false,
      required: ["professionalSummary"],
      properties: {
        professionalSummary: { type: "string" },
      },
    },
    sectionD: {
      type: "object",
      additionalProperties: false,
      required: ["tailoredResumeMarkdown"],
      properties: {
        tailoredResumeMarkdown: { type: "string" },
      },
    },
    sectionE: {
      type: "object",
      additionalProperties: false,
      required: ["changes"],
      properties: {
        changes: { type: "array", items: { type: "string" } },
      },
    },
    sectionF: {
      type: "object",
      additionalProperties: false,
      required: ["suggestions"],
      properties: {
        suggestions: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;

type GenerateArgs = {
  profile: CandidateProfile | null;
  resumeText: string;
  jobDescription: string;
  questions: ApplicationQuestions;
};

export const generateCareerApplication = async ({
  profile,
  resumeText,
  jobDescription,
  questions,
}: GenerateArgs): Promise<GeneratedResult> => {
  if (!client) {
    throw new Error("OpenAI is not configured");
  }

  const response = await client.responses.create({
    model: env.openaiModel,
    input: [
      {
        role: "system",
        content:
          "You are an elite AI career strategist, recruiter, resume writer, and graduate job application assistant focused on Singapore hiring standards. Never fabricate experience, achievements, skills, employers, technologies, certifications, or metrics. Produce concise, recruiter-quality, ATS-friendly output for early-career candidates. Return only JSON matching the schema.",
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            candidateProfile: profile,
            originalResume: resumeText,
            targetJobDescription: jobDescription,
            candidateAnswers: questions,
            outputRules: [
              "Preserve truthfulness and flag missing skills instead of pretending the candidate has them.",
              "Use modern Singapore resume norms: concise, no NRIC, no age, no marital status, no full address, no photo.",
              "Section D must be a complete tailored resume in Markdown.",
              "Section C must be 2 to 4 sentences.",
              "Section A fit score must be realistic and evidence-based.",
            ],
          },
          null,
          2,
        ),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "career_application_output",
        strict: true,
        schema: generationJsonSchema,
      },
    },
  });

  return generatedResultSchema.parse(JSON.parse(response.output_text));
};
