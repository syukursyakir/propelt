import { resumePasteInputSchema } from "@propelt/shared";
import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { normalizeResumeText, detectResumeFileKind, extractResumeText } from "../lib/resumeParser.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

const resumeRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  input_method: z.enum(["paste", "pdf", "docx"]),
  file_name: z.string().nullable(),
  raw_text: z.string(),
  parsed_sections: z.record(z.unknown()).nullable(),
  status: z.enum(["draft", "parsed", "failed"]),
  created_at: z.string(),
  updated_at: z.string(),
});

export const resumeRouter = Router();

resumeRouter.use(requireAuth);

resumeRouter.get("/", async (req: AuthedRequest, res) => {
  const { data, error } = await req.supabase!
    .from("resumes")
    .select("*")
    .eq("user_id", req.user!.id)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: "resume_fetch_failed" });
    return;
  }

  res.json({ resume: data ? resumeRowSchema.parse(data) : null });
});

resumeRouter.post("/paste", async (req: AuthedRequest, res) => {
  const parsed = resumePasteInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", issues: parsed.error.flatten() });
    return;
  }

  const rawText = normalizeResumeText(parsed.data.raw_text);
  const { data, error } = await req.supabase!
    .from("resumes")
    .upsert(
      {
        user_id: req.user!.id,
        input_method: "paste",
        file_name: null,
        raw_text: rawText,
        parsed_sections: null,
        status: "parsed",
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) {
    res.status(500).json({ error: "resume_save_failed" });
    return;
  }

  res.status(201).json({ resume: resumeRowSchema.parse(data) });
});

resumeRouter.post("/upload", upload.single("resume"), async (req: AuthedRequest, res) => {
  if (!req.file) {
    res.status(400).json({ error: "missing_file" });
    return;
  }

  const kind = detectResumeFileKind(req.file);
  if (!kind) {
    res.status(400).json({ error: "unsupported_file_type" });
    return;
  }

  let rawText: string;
  try {
    rawText = await extractResumeText(req.file, kind);
  } catch {
    res.status(400).json({ error: "resume_parse_failed" });
    return;
  }

  const parsed = resumePasteInputSchema.safeParse({ raw_text: rawText });
  if (!parsed.success) {
    res.status(400).json({ error: "resume_text_too_short", issues: parsed.error.flatten() });
    return;
  }

  const { data, error } = await req.supabase!
    .from("resumes")
    .upsert(
      {
        user_id: req.user!.id,
        input_method: kind,
        file_name: req.file.originalname,
        raw_text: rawText,
        parsed_sections: null,
        status: "parsed",
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) {
    res.status(500).json({ error: "resume_save_failed" });
    return;
  }

  res.status(201).json({ resume: resumeRowSchema.parse(data) });
});

resumeRouter.delete("/", async (req: AuthedRequest, res) => {
  const { error } = await req.supabase!.from("resumes").delete().eq("user_id", req.user!.id);
  if (error) {
    res.status(500).json({ error: "resume_delete_failed" });
    return;
  }

  res.status(204).send();
});
