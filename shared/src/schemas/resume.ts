import { z } from "zod";

export const resumeInputMethodSchema = z.enum(["paste", "pdf", "docx"]);
export type ResumeInputMethod = z.infer<typeof resumeInputMethodSchema>;

export const resumeStatusSchema = z.enum(["draft", "parsed", "failed"]);
export type ResumeStatus = z.infer<typeof resumeStatusSchema>;

export const resumePasteInputSchema = z.object({
  raw_text: z.string().min(200).max(50000),
});
export type ResumePasteInput = z.infer<typeof resumePasteInputSchema>;

export const resumeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  input_method: resumeInputMethodSchema,
  file_name: z.string().max(255).nullable(),
  raw_text: z.string(),
  parsed_sections: z.record(z.unknown()).nullable(),
  status: resumeStatusSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Resume = z.infer<typeof resumeSchema>;
