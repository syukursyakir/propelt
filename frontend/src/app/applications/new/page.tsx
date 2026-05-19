"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ApplicationQuestions, Resume } from "@propelt/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/use-session";
import { AppShell } from "@/components/app-shell";

const initialQuestions: ApplicationQuestions = {
  targetRoleOrIndustry: "",
  strongestSkills: "",
  proudestExperiences: "",
  achievementsToHighlight: "",
  guardrails: "Do not invent experience, skills, metrics, or certifications.",
};

export default function NewApplicationPage() {
  const router = useRouter();
  const { loading } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumesLoaded, setResumesLoaded] = useState(false);
  const [resumeId, setResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<ApplicationQuestions>(initialQuestions);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading) {
      api.listResumes().then(({ resumes }) => {
        setResumes(resumes);
        setResumeId(resumes[0]?.id ?? "");
        setResumesLoaded(true);
      }).catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Load failed");
        setResumesLoaded(true);
      });
    }
  }, [loading]);

  const validate = (): string | null => {
    if (!resumeId) return "Pick a saved resume before generating.";
    if (!jobDescription.trim())
      return "Paste the job description so Propelt knows what role to target.";
    if (jobDescription.trim().length < 60)
      return "Job description looks too short to tailor against. Paste the full posting.";
    if (!questions.targetRoleOrIndustry.trim())
      return "Tell Propelt the role or industry you're targeting.";
    if (!questions.strongestSkills.trim())
      return "Share your strongest skills so Propelt can lead with them.";
    return null;
  };

  const generate = async () => {
    setError("");
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    try {
      const { application } = await api.generateApplication({
        resumeId,
        jobTitle,
        companyName,
        jobDescription,
        questions,
      });
      router.push(`/applications/${application.id}`);
    } catch (generateError) {
      setError(
        generateError instanceof Error ? generateError.message : "Generation failed",
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <p className="muted">Loading…</p>
      </AppShell>
    );
  }

  if (resumesLoaded && resumes.length === 0) {
    return (
      <AppShell>
        <div className="app-page-header">
          <div>
            <p className="eyebrow">New application</p>
            <h1>Tailor a job application</h1>
            <p className="muted">Choose a resume, paste the JD, answer five questions.</p>
          </div>
        </div>
        <div className="card stack app-empty">
          <div>
            <h2>Add a resume first</h2>
            <p className="muted">
              Propelt tailors applications against a saved resume. Upload a
              PDF/DOCX or paste the text once — you can reuse it for every
              future application.
            </p>
          </div>
          <div className="actions">
            <Link className="button" href="/resumes">
              Go to resume library
            </Link>
            <Link className="button secondary" href="/dashboard">
              Use the dashboard setup
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="app-page-header">
        <div>
          <p className="eyebrow">New application</p>
          <h1>Tailor a job application</h1>
          <p className="muted">Choose a resume, paste the JD, answer five questions.</p>
        </div>
      </div>
      <section className="workspace stack">
        {error ? <div className="error">{error}</div> : null}
        <div className="card stack">
          <div className="grid">
            <div className="field">
              <label htmlFor="resume">Saved resume *</label>
              <select id="resume" value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
                {resumes.map((resume) => (
                  <option value={resume.id} key={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="jobTitle">Job title</label>
              <input id="jobTitle" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="e.g. Data Analyst Intern" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="companyName">Company name</label>
            <input id="companyName" value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="e.g. Acme Bank" />
          </div>
          <div className="field">
            <label htmlFor="jd">Job description *</label>
            <textarea id="jd" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} style={{ minHeight: 200 }} placeholder="Paste the full posting here, including responsibilities and requirements." />
          </div>
        </div>
        <div className="card stack">
          <h2>Candidate questions</h2>
          <p className="muted">Short answers help Propelt position your real experience. Fields marked * are required.</p>
          <Question required label="What role or industry are you targeting? *" value={questions.targetRoleOrIndustry} onChange={(value) => setQuestions({ ...questions, targetRoleOrIndustry: value })} />
          <Question required label="What are your strongest technical or professional skills? *" value={questions.strongestSkills} onChange={(value) => setQuestions({ ...questions, strongestSkills: value })} />
          <Question label="What projects, internships, or experiences are you most proud of?" value={questions.proudestExperiences} onChange={(value) => setQuestions({ ...questions, proudestExperiences: value })} />
          <Question label="Any achievements, results, or metrics to highlight?" value={questions.achievementsToHighlight} onChange={(value) => setQuestions({ ...questions, achievementsToHighlight: value })} />
          <Question label="Anything you do not want changed or exaggerated?" value={questions.guardrails} onChange={(value) => setQuestions({ ...questions, guardrails: value })} />
        </div>
        <div className="actions">
          <button className="button" type="button" disabled={busy || !resumeId} onClick={generate}>
            {busy ? "Generating…" : "Generate tailored application"}
          </button>
          {busy ? (
            <span className="muted">This usually takes 10–30 seconds.</span>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}

function Question({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-required={required}
      />
    </div>
  );
}
