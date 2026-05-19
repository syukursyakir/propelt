"use client";

import { useEffect, useState } from "react";
import type { Resume } from "@propelt/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/use-session";
import { AppShell } from "@/components/app-shell";

type EditDraft = { title: string; content: string };

export default function ResumesPage() {
  const { loading } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumesLoaded, setResumesLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<"parse" | "save" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft>({ title: "", content: "" });
  const [editBusy, setEditBusy] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState<string | null>(null);

  const refresh = async () => {
    const data = await api.listResumes();
    setResumes(data.resumes);
    setResumesLoaded(true);
  };

  useEffect(() => {
    if (!loading) {
      refresh().catch((refreshError) => {
        setError(refreshError instanceof Error ? refreshError.message : "Load failed");
        setResumesLoaded(true);
      });
    }
  }, [loading]);

  const flash = (text: string) => {
    setMessage(text);
    setError("");
    window.setTimeout(() => setMessage(""), 1600);
  };

  const parse = async () => {
    setError("");
    setBusy("parse");
    try {
      const formData = new FormData();
      if (file) {
        formData.append("resume", file);
      } else {
        formData.append("resumeText", content);
      }
      const parsed = await api.parseResume(formData);
      setContent(parsed.content);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "Parse failed");
    } finally {
      setBusy(null);
    }
  };

  const save = async () => {
    setError("");
    if (!title.trim()) {
      setError("Give the resume a short name (e.g. \"Main resume — Apr 2026\").");
      return;
    }
    if (content.trim().length < 50) {
      setError("Resume content needs at least 50 characters.");
      return;
    }
    setBusy("save");
    try {
      await api.createResume({ title, content });
      setTitle("");
      setContent("");
      setFile(null);
      await refresh();
      flash("Resume saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setBusy(null);
    }
  };

  const startEdit = (resume: Resume) => {
    setEditingId(resume.id);
    setEditDraft({ title: resume.title, content: resume.content });
    setError("");
    setDeleteArmed(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ title: "", content: "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editDraft.title.trim()) {
      setError("Resume title cannot be empty.");
      return;
    }
    if (editDraft.content.trim().length < 50) {
      setError("Resume content needs at least 50 characters.");
      return;
    }
    setEditBusy(true);
    setError("");
    try {
      const { resume } = await api.updateResume(editingId, {
        title: editDraft.title,
        content: editDraft.content,
      });
      setResumes((current) =>
        current.map((item) => (item.id === resume.id ? resume : item)),
      );
      cancelEdit();
      flash("Resume updated.");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Update failed");
    } finally {
      setEditBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (deleteArmed !== id) {
      setDeleteArmed(id);
      return;
    }
    setError("");
    try {
      await api.deleteResume(id);
      setResumes((current) => current.filter((item) => item.id !== id));
      setDeleteArmed(null);
      flash("Resume deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
    }
  };

  if (loading) {
    return (
      <AppShell>
        <p className="muted">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="app-page-header">
        <div>
          <p className="eyebrow">Resume library</p>
          <h1>Resumes</h1>
          <p className="muted">Save reusable resume text. Pick one when starting a new application.</p>
        </div>
      </div>
      <section className="workspace stack">
        {message ? <div className="success">{message}</div> : null}
        {error ? <div className="error">{error}</div> : null}
        <div className="grid">
          <div className="card stack">
            <h2>Add resume</h2>
            <div className="field">
              <label htmlFor="title">Resume name</label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Main resume — Apr 2026"
              />
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
            <button className="button secondary" type="button" onClick={parse} disabled={busy === "parse"}>
              {busy === "parse" ? "Parsing…" : "Parse or use pasted text"}
            </button>
            <div className="field">
              <label htmlFor="content">Resume text</label>
              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
            <button className="button" type="button" onClick={save} disabled={busy === "save"}>
              {busy === "save" ? "Saving…" : "Save resume"}
            </button>
          </div>
          <div className="card stack">
            <h2>Saved</h2>
            {!resumesLoaded ? (
              <p className="muted">Loading saved resumes…</p>
            ) : resumes.length === 0 ? (
              <p className="muted">No saved resumes yet. Add one on the left.</p>
            ) : (
              resumes.map((resume) => {
                const editing = editingId === resume.id;
                return (
                  <div className="panel stack" key={resume.id}>
                    {editing ? (
                      <>
                        <div className="field">
                          <label htmlFor={`edit-title-${resume.id}`}>Resume name</label>
                          <input
                            id={`edit-title-${resume.id}`}
                            value={editDraft.title}
                            onChange={(event) =>
                              setEditDraft((draft) => ({ ...draft, title: event.target.value }))
                            }
                          />
                        </div>
                        <div className="field">
                          <label htmlFor={`edit-content-${resume.id}`}>Resume text</label>
                          <textarea
                            id={`edit-content-${resume.id}`}
                            value={editDraft.content}
                            onChange={(event) =>
                              setEditDraft((draft) => ({ ...draft, content: event.target.value }))
                            }
                            style={{ minHeight: 220 }}
                          />
                        </div>
                        <div className="actions">
                          <button className="button" type="button" onClick={saveEdit} disabled={editBusy}>
                            {editBusy ? "Saving…" : "Save changes"}
                          </button>
                          <button className="button ghost" type="button" onClick={cancelEdit} disabled={editBusy}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <strong>{resume.title}</strong>
                        <p className="muted">{resume.content.slice(0, 200)}…</p>
                        <div className="actions">
                          <button
                            className="button secondary"
                            type="button"
                            onClick={() => startEdit(resume)}
                          >
                            Edit
                          </button>
                          <button
                            className={`button ghost${deleteArmed === resume.id ? " resume-delete-armed" : ""}`}
                            type="button"
                            onClick={() => remove(resume.id)}
                            onBlur={() =>
                              setDeleteArmed((current) =>
                                current === resume.id ? null : current,
                              )
                            }
                          >
                            {deleteArmed === resume.id ? "Confirm delete" : "Delete"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
