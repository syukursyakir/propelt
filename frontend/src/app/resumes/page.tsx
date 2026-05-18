"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Resume } from "@propelt/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/use-session";

export default function ResumesPage() {
  const { loading } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const data = await api.listResumes();
    setResumes(data.resumes);
  };

  useEffect(() => {
    if (!loading) {
      refresh().catch((refreshError) =>
        setError(refreshError instanceof Error ? refreshError.message : "Load failed"),
      );
    }
  }, [loading]);

  const parse = async () => {
    setError("");
    const formData = new FormData();
    if (file) {
      formData.append("resume", file);
    } else {
      formData.append("resumeText", content);
    }
    const parsed = await api.parseResume(formData);
    setContent(parsed.content);
  };

  const save = async () => {
    setError("");
    try {
      await api.createResume({ title, content });
      setTitle("");
      setContent("");
      setFile(null);
      await refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    }
  };

  const remove = async (id: string) => {
    await api.deleteResume(id);
    await refresh();
  };

  if (loading) {
    return <main className="page">Loading...</main>;
  }

  return (
    <main className="page">
      <section className="workspace stack">
        <div className="topbar">
          <div>
            <h1>Resumes</h1>
            <p className="muted">Save reusable resume text for future applications.</p>
          </div>
          <Link className="button secondary" href="/dashboard">
            Dashboard
          </Link>
        </div>
        {error ? <div className="error">{error}</div> : null}
        <div className="grid">
          <div className="card stack">
            <h2>Add resume</h2>
            <div className="field">
              <label htmlFor="title">Resume name</label>
              <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="file">PDF or DOCX</label>
              <input
                id="file"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </div>
            <button className="button secondary" type="button" onClick={parse}>
              Parse or use pasted text
            </button>
            <div className="field">
              <label htmlFor="content">Resume text</label>
              <textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} />
            </div>
            <button className="button" type="button" onClick={save}>
              Save resume
            </button>
          </div>
          <div className="card stack">
            <h2>Saved</h2>
            {resumes.map((resume) => (
              <div className="panel stack" key={resume.id}>
                <strong>{resume.title}</strong>
                <p className="muted">{resume.content.slice(0, 160)}...</p>
                <button className="button danger" type="button" onClick={() => remove(resume.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
