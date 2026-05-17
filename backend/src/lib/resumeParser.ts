import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export type ResumeFileKind = "pdf" | "docx";

export function detectResumeFileKind(file: Express.Multer.File): ResumeFileKind | null {
  const name = file.originalname.toLowerCase();
  if (file.mimetype === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return "docx";
  }
  return null;
}

export async function extractResumeText(file: Express.Multer.File, kind: ResumeFileKind): Promise<string> {
  if (kind === "pdf") {
    const parser = new PDFParse({ data: file.buffer });
    try {
      const result = await parser.getText();
      return normalizeResumeText(result.text);
    } finally {
      await parser.destroy();
    }
  }

  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return normalizeResumeText(result.value);
}

export function normalizeResumeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
