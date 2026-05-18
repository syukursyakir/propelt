"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ApplicationQuestions, Resume } from "@propelt/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/use-session";

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
      }).catch((loadError) =>
        setError(loadError instanceof Error ? loadError.message : "Load failed"),
      );
    }
  }, [loading]);

  const generate = async () => {
    setError("");
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
    return <main className="page">Loading...</main>;
  }

  return (
    <main className="page">
      <section className="workspace stack">
        <div className="topbar">
          <div>
            <h1>New application</h1>
            <p className="muted">Choose a resume, paste the JD, answer five questions.</p>
          </div>
          <Link className="button secondary" href="/dashboard">
            Dashboard
          </Link>
        </div>
        {error ? <div className="error">{error}</div> : null}
        <div className="card stack">
          <div className="grid">
            <div className="field">
              <label htmlFor="resume">Saved resume</label>
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
              <input id="jobTitle" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="companyName">Company name</label>
            <input id="companyName" value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="jd">Job description</label>
            <textarea id="jd" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} style={{ minHeight: 260 }} />
          </div>
        </div>
        <div className="card stack">
          <h2>Candidate questions</h2>
          <Question label="What role or industry are you targeting?" value={questions.targetRoleOrIndustry} onChange={(value) => setQuestions({ ...questions, targetRoleOrIndustry: value })} />
          <Question label="What are your strongest technical or professional skills?" value={questions.strongestSkills} onChange={(value) => setQuestions({ ...questions, strongestSkills: value })} />
          <Question label="What projects, internships, or experiences are you most proud of?" value={questions.proudestExperiences} onChange={(value) => setQuestions({ ...questions, proudestExperiences: value })} />
          <Question label="Any achievements, results, or metrics to highlight?" value={questions.achievementsToHighlight} onChange={(value) => setQuestions({ ...questions, achievementsToHighlight: value })} />
          <Question label="Anything you do not want changed or exaggerated?" value={questions.guardrails} onChange={(value) => setQuestions({ ...questions, guardrails: value })} />
        </div>
        <button className="button" type="button" disabled={busy || !resumeId} onClick={generate}>
          {busy ? "Generating..." : "Generate tailored application"}
        </button>
      </section>
    </main>
  );
}

function Question({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
