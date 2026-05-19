import cors from "cors";
import express from "express";
import helmet from "helmet";
import multer from "multer";
import { ZodError } from "zod";
import {
  applicationQuestionSchema,
  candidateProfileSchema,
  generateApplicationRequestSchema,
  generatedResultSchema,
  healthCheckSchema,
  updateResumeRequestSchema,
} from "@propelt/shared";
import type { CandidateProfile } from "@propelt/shared";
import { requireUser } from "./auth.js";
import { env } from "./env.js";
import { generateCareerApplication } from "./openai.js";
import { parseResumeBuffer } from "./parsing.js";
import { supabase, supabaseAdmin } from "./supabase.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_request, response) => {
  response.json(
    healthCheckSchema.parse({
      status: "ok",
      service: "backend",
      timestamp: new Date().toISOString(),
    }),
  );
});

app.get("/status", (_request, response) => {
  response.json({
    status: "ok",
    supabaseClientConfigured: Boolean(supabase),
    supabaseAdminConfigured: Boolean(supabaseAdmin),
  });
});

const requireAdmin = () => {
  if (!supabaseAdmin) {
    throw new Error("Supabase service role is not configured");
  }

  return supabaseAdmin;
};

const getProfile = async (userId: string) => {
  const admin = requireAdmin();
  const { data, error } = await admin
    .from("career_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    fullName: data.full_name,
    school: data.school,
    course: data.course,
    graduationYear: data.graduation_year,
    userType: data.user_type,
    targetRole: data.target_role,
    targetIndustry: data.target_industry,
  } satisfies CandidateProfile;
};

const asyncRoute =
  (
    handler: (
      request: express.Request,
      response: express.Response,
    ) => Promise<void>,
  ) =>
  (request: express.Request, response: express.Response) => {
    handler(request, response).catch((error: unknown) => {
      if (error instanceof ZodError) {
        const issue = error.issues[0];
        const message = issue
          ? `${issue.path.join(".") || "request"}: ${issue.message}`
          : "Invalid request body";
        response.status(400).json({ error: message });
        return;
      }
      const message =
        error instanceof Error ? error.message : "Unexpected server error";
      response.status(500).json({ error: message });
    });
  };

app.get(
  "/api/profile",
  requireUser,
  asyncRoute(async (request, response) => {
    const profile = await getProfile(request.userId!);
    response.json({ profile });
  }),
);

app.put(
  "/api/profile",
  requireUser,
  asyncRoute(async (request, response) => {
    const profile = candidateProfileSchema.parse(request.body);
    const admin = requireAdmin();

    const { error } = await admin.from("career_profiles").upsert(
      {
        user_id: request.userId,
        full_name: profile.fullName,
        school: profile.school,
        course: profile.course,
        graduation_year: profile.graduationYear,
        user_type: profile.userType,
        target_role: profile.targetRole,
        target_industry: profile.targetIndustry,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      throw error;
    }

    response.json({ profile });
  }),
);

app.post(
  "/api/resumes/parse",
  requireUser,
  upload.single("resume"),
  asyncRoute(async (request, response) => {
    if (typeof request.body.resumeText === "string" && request.body.resumeText) {
      response.json({ content: request.body.resumeText.trim() });
      return;
    }

    if (!request.file) {
      response.status(400).json({ error: "Upload a PDF/DOCX file or paste text" });
      return;
    }

    const content = await parseResumeBuffer(request.file);
    response.json({ content });
  }),
);

app.get(
  "/api/resumes",
  requireUser,
  asyncRoute(async (request, response) => {
    const admin = requireAdmin();
    const { data, error } = await admin
      .from("resumes")
      .select("id,title,content,created_at,updated_at")
      .eq("user_id", request.userId)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    response.json({
      resumes: (data ?? []).map((resume) => ({
        id: resume.id,
        title: resume.title,
        content: resume.content,
        createdAt: resume.created_at,
        updatedAt: resume.updated_at,
      })),
    });
  }),
);

app.post(
  "/api/resumes",
  requireUser,
  asyncRoute(async (request, response) => {
    const title = String(request.body.title ?? "").trim();
    const content = String(request.body.content ?? "").trim();

    if (!title || content.length < 50) {
      response
        .status(400)
        .json({ error: "Resume title and at least 50 characters are required" });
      return;
    }

    const admin = requireAdmin();
    const { data, error } = await admin
      .from("resumes")
      .insert({ user_id: request.userId, title, content })
      .select("id,title,content,created_at,updated_at")
      .single();

    if (error) {
      throw error;
    }

    response.status(201).json({
      resume: {
        id: data.id,
        title: data.title,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  }),
);

app.patch(
  "/api/resumes/:id",
  requireUser,
  asyncRoute(async (request, response) => {
    const payload = updateResumeRequestSchema.parse(request.body);
    const admin = requireAdmin();

    const { data, error } = await admin
      .from("resumes")
      .update({ title: payload.title, content: payload.content })
      .eq("id", request.params.id)
      .eq("user_id", request.userId)
      .select("id,title,content,created_at,updated_at")
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      response.status(404).json({ error: "Resume not found" });
      return;
    }

    response.json({
      resume: {
        id: data.id,
        title: data.title,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  }),
);

app.delete(
  "/api/resumes/:id",
  requireUser,
  asyncRoute(async (request, response) => {
    const admin = requireAdmin();
    const { error } = await admin
      .from("resumes")
      .delete()
      .eq("id", request.params.id)
      .eq("user_id", request.userId);

    if (error) {
      throw error;
    }

    response.status(204).send();
  }),
);

app.get(
  "/api/applications",
  requireUser,
  asyncRoute(async (request, response) => {
    const admin = requireAdmin();
    const { data, error } = await admin
      .from("applications")
      .select("id,resume_id,job_title,company_name,job_description,questions,result,created_at,updated_at")
      .eq("user_id", request.userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    response.json({
      applications: (data ?? []).map((application) => ({
        id: application.id,
        resumeId: application.resume_id,
        jobTitle: application.job_title,
        companyName: application.company_name,
        jobDescription: application.job_description,
        questions: application.questions,
        result: application.result,
        createdAt: application.created_at,
        updatedAt: application.updated_at,
      })),
    });
  }),
);

app.get(
  "/api/applications/:id",
  requireUser,
  asyncRoute(async (request, response) => {
    const admin = requireAdmin();
    const { data, error } = await admin
      .from("applications")
      .select("id,resume_id,job_title,company_name,job_description,questions,result,created_at,updated_at")
      .eq("id", request.params.id)
      .eq("user_id", request.userId)
      .single();

    if (error) {
      throw error;
    }

    response.json({
      application: {
        id: data.id,
        resumeId: data.resume_id,
        jobTitle: data.job_title,
        companyName: data.company_name,
        jobDescription: data.job_description,
        questions: data.questions,
        result: data.result,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  }),
);

app.post(
  "/api/applications/generate",
  requireUser,
  asyncRoute(async (request, response) => {
    const payload = generateApplicationRequestSchema.parse(request.body);
    const admin = requireAdmin();

    const { data: resume, error: resumeError } = await admin
      .from("resumes")
      .select("id,content")
      .eq("id", payload.resumeId)
      .eq("user_id", request.userId)
      .single();

    if (resumeError) {
      throw resumeError;
    }

    const profile = await getProfile(request.userId!);
    const result = await generateCareerApplication({
      profile,
      resumeText: resume.content,
      jobDescription: payload.jobDescription,
      questions: payload.questions,
    });

    const { data, error } = await admin
      .from("applications")
      .insert({
        user_id: request.userId,
        resume_id: payload.resumeId,
        job_title: payload.jobTitle ?? null,
        company_name: payload.companyName ?? null,
        job_description: payload.jobDescription,
        questions: applicationQuestionSchema.parse(payload.questions),
        result,
      })
      .select("id,resume_id,job_title,company_name,job_description,questions,result,created_at,updated_at")
      .single();

    if (error) {
      throw error;
    }

    response.status(201).json({
      application: {
        id: data.id,
        resumeId: data.resume_id,
        jobTitle: data.job_title,
        companyName: data.company_name,
        jobDescription: data.job_description,
        questions: data.questions,
        result: data.result,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  }),
);

app.patch(
  "/api/applications/:id/result",
  requireUser,
  asyncRoute(async (request, response) => {
    const admin = requireAdmin();
    const result = generatedResultSchema.parse(request.body?.result);

    const { data, error } = await admin
      .from("applications")
      .update({ result })
      .eq("id", request.params.id)
      .eq("user_id", request.userId)
      .select("id,resume_id,job_title,company_name,job_description,questions,result,created_at,updated_at")
      .single();

    if (error) {
      throw error;
    }

    response.json({
      application: {
        id: data.id,
        resumeId: data.resume_id,
        jobTitle: data.job_title,
        companyName: data.company_name,
        jobDescription: data.job_description,
        questions: data.questions,
        result: data.result,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  }),
);

app.delete(
  "/api/applications/:id",
  requireUser,
  asyncRoute(async (request, response) => {
    const admin = requireAdmin();
    const { error } = await admin
      .from("applications")
      .delete()
      .eq("id", request.params.id)
      .eq("user_id", request.userId);

    if (error) {
      throw error;
    }

    response.status(204).send();
  }),
);

app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});
