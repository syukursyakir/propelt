import { z } from "zod";

export const generatedDocumentTypeSchema = z.enum([
  "resume_diagnosis",
  "resume_bullets",
  "resume_rewrite",
  "targeted_resume",
  "cover_letter",
  "interview_brief",
]);
export type GeneratedDocumentType = z.infer<typeof generatedDocumentTypeSchema>;

export const generatedDocumentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  resume_id: z.string().uuid(),
  job_target_id: z.string().uuid().nullable(),
  document_type: generatedDocumentTypeSchema,
  content: z.string(),
  edited_content: z.string().nullable(),
  generation_count: z.number().int().min(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type GeneratedDocument = z.infer<typeof generatedDocumentSchema>;

export const documentExportFormatSchema = z.enum(["pdf", "docx"]);
export type DocumentExportFormat = z.infer<typeof documentExportFormatSchema>;

export const documentExportSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  document_id: z.string().uuid(),
  export_format: documentExportFormatSchema,
  created_at: z.string().datetime(),
});
export type DocumentExport = z.infer<typeof documentExportSchema>;
