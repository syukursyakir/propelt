"use client";

import type { Resume } from "@propelt/shared";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "saving";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

async function getAccessToken() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function resumeRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  if (!token) throw new Error("You need to sign in again.");

  const response = await fetch(`${backendUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Request failed");
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export default function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const preview = useMemo(() => {
    if (!resume?.raw_text) return "";
    return resume.raw_text.length > 1400 ? `${resume.raw_text.slice(0, 1400)}...` : resume.raw_text;
  }, [resume]);

  useEffect(() => {
    let active = true;
    async function loadResume() {
      setStatus("loading");
      setError(null);
      try {
        const data = await resumeRequest<{ resume: Resume | null }>("/api/resume");
        if (active) setResume(data.resume);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Could not load resume.");
      } finally {
        if (active) setStatus("idle");
      }
    }

    void loadResume();
    return () => {
      active = false;
    };
  }, []);

  async function savePaste(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const data = await resumeRequest<{ resume: Resume }>("/api/resume/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText }),
      });
      setResume(data.resume);
      setRawText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save resume.");
    } finally {
      setStatus("idle");
    }
  }

  async function uploadResume(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setStatus("saving");
    setError(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const data = await resumeRequest<{ resume: Resume }>("/api/resume/upload", {
        method: "POST",
        body: formData,
      });
      setResume(data.resume);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload resume.");
    } finally {
      setStatus("idle");
    }
  }

  async function deleteResume() {
    setStatus("saving");
    setError(null);
    try {
      await resumeRequest<void>("/api/resume", { method: "DELETE" });
      setResume(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete resume.");
    } finally {
      setStatus("idle");
    }
  }

  const busy = status === "loading" || status === "saving";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-brand">Resume intake</p>
        <h1 className="text-4xl font-semibold tracking-tight">Start with your current resume</h1>
        <p className="max-w-2xl text-sm opacity-70">
          Paste your resume text or upload a PDF/DOCX. Propelt keeps one active resume for now, and you can delete it anytime.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <form onSubmit={savePaste} className="rounded-md border border-black/10 p-5 dark:border-white/15">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="size-5" />
              <h2 className="text-lg font-semibold">Paste resume text</h2>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              minLength={200}
              maxLength={50000}
              placeholder="Paste your resume here..."
              className="min-h-64 w-full resize-y rounded-md border border-black/10 bg-transparent p-3 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/40"
            />
            <button
              type="submit"
              disabled={busy || rawText.trim().length < 200}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              {status === "saving" ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
              Save pasted resume
            </button>
          </form>

          <form onSubmit={uploadResume} className="rounded-md border border-black/10 p-5 dark:border-white/15">
            <div className="mb-4 flex items-center gap-2">
              <Upload className="size-5" />
              <h2 className="text-lg font-semibold">Upload PDF or DOCX</h2>
            </div>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-md border border-black/10 p-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-background dark:border-white/15"
            />
            <button
              type="submit"
              disabled={busy || !file}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              {status === "saving" ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Upload and parse
            </button>
          </form>
        </div>

        <aside className="rounded-md border border-black/10 p-5 dark:border-white/15">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Active resume</h2>
              <p className="text-sm opacity-70">
                {resume
                  ? `${resume.input_method.toUpperCase()}${resume.file_name ? `: ${resume.file_name}` : ""}`
                  : "No resume saved yet."}
              </p>
            </div>
            {resume && (
              <button
                type="button"
                onClick={deleteResume}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md border border-red-500/30 px-3 py-1.5 text-sm text-red-600 disabled:opacity-50 dark:text-red-300"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            )}
          </div>

          {status === "loading" ? (
            <div className="flex items-center gap-2 text-sm opacity-70">
              <Loader2 className="size-4 animate-spin" />
              Loading resume...
            </div>
          ) : preview ? (
            <pre className="max-h-[34rem] overflow-auto whitespace-pre-wrap rounded-md bg-black/[0.03] p-4 text-xs leading-5 dark:bg-white/[0.06]">
              {preview}
            </pre>
          ) : (
            <div className="rounded-md bg-black/[0.03] p-4 text-sm opacity-70 dark:bg-white/[0.06]">
              Once you save a resume, extracted text will show here.
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
