import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export const parseResumeBuffer = async (file: Express.Multer.File) => {
  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    return parsed.text.trim();
  }

  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.originalname.toLowerCase().endsWith(".docx")
  ) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return parsed.value.trim();
  }

  throw new Error("Unsupported file type. Upload a PDF or DOCX file.");
};
