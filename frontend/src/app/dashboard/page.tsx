"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Application, CandidateProfile, Resume } from "@propelt/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/use-session";
import { AppShell } from "@/components/app-shell";

const initialProfile: CandidateProfile = {
  fullName: "",
  school: "",
  course: "",
  graduationYear: "",
  userType: "university_student",
  targetRole: "",
  targetIndustry: "",
};

export default function DashboardPage() {
  const router = useRouter();
  const { loading } = useSession();
  const [profile, setProfile] = useState<CandidateProfile>(initialProfile);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumeTitle, setResumeTitle] = useState("Main Resume");
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading) {
      Promise.all([api.getProfile(), api.listResumes(), api.listApplications()]).then(
        ([profileData, resumeData, applicationData]) => {
          if (profileData.profile) {
            setProfile(profileData.profile);
          }
          setResumes(resumeData.resumes);
          setApplications(applicationData.applications);
        },
      ).catch((loadError) =>
        setError(loadError instanceof Error ? loadError.message : "Load failed"),
      );
    }
  }, [loading]);

  const parseResume = async () => {
    setError("");
    setBusy(true);

    const formData = new FormData();
    if (file) {
      formData.append("resume", file);
    } else {
      formData.append("resumeText", resumeText);
    }

    try {
      const parsed = await api.parseResume(formData);
      setResumeText(parsed.content);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "Parse failed");
    } finally {
      setBusy(false);
    }
  };

  const saveSetup = async () => {
    setError("");
    setBusy(true);

    try {
      await api.saveProfile(profile);

      if (resumeText.trim()) {
        const { resume } = await api.createResume({
          title: resumeTitle.trim() || "Main Resume",
          content: resumeText,
        });
        setResumes((current) => [resume, ...current]);
        setResumeText("");
      }

      router.push("/applications/new");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <p className="muted">Loading workspace…</p>
      </AppShell>
    );
  }

  const hasProfile = Boolean(profile.fullName.trim() || profile.school.trim());
  const hasResume = resumes.length > 0;
  const setupComplete = hasProfile && hasResume;

  let eyebrowLabel: string;
  let heading: string;
  let subhead: string;

  if (setupComplete) {
    eyebrowLabel = "Welcome back";
    heading = "Pick up where you left off.";
    subhead =
      "Your saved resumes and recent applications are in the right rail. Jump into a new application or refine your setup below.";
  } else if (hasResume) {
    eyebrowLabel = "Almost there";
    heading = "Finish your candidate profile.";
    subhead =
      "A few profile details give future applications richer context.";
  } else if (hasProfile) {
    eyebrowLabel = "Almost there";
    heading = "Save your first resume.";
    subhead =
      "Upload a PDF, DOCX, or paste text. You'll reuse this for every application.";
  } else {
    eyebrowLabel = "Get started";
    heading = "Build your first tailored application.";
    subhead =
      "Start in one place: profile context, reusable resume, then the job description you want to apply for.";
  }

  return (
    <AppShell>
      <div className="app-page-header">
        <div>
          <p className="eyebrow">{eyebrowLabel}</p>
          <h1>{heading}</h1>
          <p className="muted">{subhead}</p>
        </div>
        <Link className="button secondary" href="/applications/new">
          New application
        </Link>
      </div>

      {error ? <div className="error">{error}</div> : null}

        <div className="dashboard-layout">
          {setupComplete ? (
            <section className="onboarding-home stack" aria-label="Workspace ready">
              <article className="card setup-cta">
                <div>
                  <p className="eyebrow">Ready to apply</p>
                  <h2>Your workspace is set up.</h2>
                  <p className="muted">
                    Start a tailored application — paste a JD, answer a few
                    questions, and receive a fit analysis, keyword alignment,
                    summary, rewritten resume, explanation, and next steps.
                  </p>
                </div>
                <Link className="button" href="/applications/new">
                  Start new application
                </Link>
              </article>
              <article className="card stack">
                <div className="step-heading">
                  <span className="step-number">+</span>
                  <div>
                    <h2>Refine your setup</h2>
                    <p className="muted">
                      Edit profile in <Link href="/onboarding" className="inline-link">full onboarding</Link> or manage saved resumes in <Link href="/resumes" className="inline-link">the resume library</Link>.
                    </p>
                  </div>
                </div>
              </article>
            </section>
          ) : (
          <section className="onboarding-home stack" aria-label="Guided setup">
            <article className="card stack">
              <div className="step-heading">
                <span className="step-number">1</span>
                <div>
                  <h2>Tell Propelt who you are applying as</h2>
                  <p className="muted">
                    This becomes reusable context for every application.
                  </p>
                </div>
              </div>

              <div className="grid">
                <Field label="Full name" value={profile.fullName} onChange={(fullName) => setProfile({ ...profile, fullName })} />
                <Field label="School" value={profile.school} onChange={(school) => setProfile({ ...profile, school })} />
                <Field label="Course" value={profile.course} onChange={(course) => setProfile({ ...profile, course })} />
                <Field label="Graduation year" value={profile.graduationYear} onChange={(graduationYear) => setProfile({ ...profile, graduationYear })} />
              </div>

              <div className="grid">
                <div className="field">
                  <label htmlFor="userType">User type</label>
                  <select
                    id="userType"
                    value={profile.userType}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        userType: event.target.value as CandidateProfile["userType"],
                      })
                    }
                  >
                    <option value="university_student">University student</option>
                    <option value="poly_student">Poly student</option>
                    <option value="fresh_graduate">Fresh graduate</option>
                    <option value="early_career">Early-career professional</option>
                  </select>
                </div>
                <Field label="Target industry" value={profile.targetIndustry} onChange={(targetIndustry) => setProfile({ ...profile, targetIndustry })} />
              </div>

              <Field label="Target role" value={profile.targetRole} onChange={(targetRole) => setProfile({ ...profile, targetRole })} />
            </article>

            <article className="card stack">
              <div className="step-heading">
                <span className="step-number">2</span>
                <div>
                  <h2>Save your reusable resume</h2>
                  <p className="muted">
                    Upload PDF/DOCX or paste text. You can reuse this resume
                    for many jobs.
                  </p>
                </div>
              </div>

              <Field label="Resume name" value={resumeTitle} onChange={setResumeTitle} />
              <div className="field">
                <label htmlFor="resumeFile">Upload PDF or DOCX</label>
                <input
                  id="resumeFile"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </div>
              <div className="actions">
                <button className="button secondary" type="button" disabled={busy} onClick={parseResume}>
                  {busy ? "Working..." : "Parse resume"}
                </button>
                <span className="muted">{resumes.length} saved resume(s)</span>
              </div>
              <div className="field">
                <label htmlFor="resumeText">Editable resume text preview</label>
                <textarea
                  id="resumeText"
                  value={resumeText}
                  onChange={(event) => setResumeText(event.target.value)}
                  placeholder="Paste resume text here if upload parsing fails."
                  style={{ minHeight: 200 }}
                />
              </div>
            </article>

            <article className="card setup-cta">
              <div>
                <span className="step-number">3</span>
                <h2>Paste a job description next</h2>
                <p className="muted">
                  Once your profile and resume are ready, Propelt can generate
                  the fit analysis, keyword alignment, tailored summary,
                  tailored resume, reasoning, and next steps.
                </p>
              </div>
              <button className="button" type="button" disabled={busy} onClick={saveSetup}>
                {busy ? "Saving..." : "Save and start application"}
              </button>
            </article>
          </section>
          )}

          <aside className="dashboard-rail stack" aria-label="Workspace summary">
            <div className="card stack">
              <h2>Workspace status</h2>
              <StatusRow label="Profile" value={profile.fullName || profile.school ? "Started" : "Not started"} />
              <StatusRow label="Resumes" value={`${resumes.length} saved`} />
              <StatusRow label="Applications" value={`${applications.length} created`} />
            </div>

            <div className="card stack">
              <div className="rail-card-head">
                <h2>Recent applications</h2>
                {applications.length > 0 ? (
                  <Link href="/applications" className="inline-link">View all</Link>
                ) : null}
              </div>
              {applications.length === 0 ? (
                <p className="muted">No tailored applications yet.</p>
              ) : (
                applications.slice(0, 4).map((application) => (
                  <Link
                    className="panel"
                    href={`/applications/${application.id}`}
                    key={application.id}
                  >
                    <strong>{application.jobTitle || "Untitled role"}</strong>
                    <p className="muted">{application.companyName || "No company added"}</p>
                  </Link>
                ))
              )}
            </div>

            <div className="card stack">
              <div className="rail-card-head">
                <h2>Saved resumes</h2>
                {resumes.length > 0 ? (
                  <Link href="/resumes" className="inline-link">View all</Link>
                ) : null}
              </div>
              {resumes.length === 0 ? (
                <p className="muted">Your first resume will appear here.</p>
              ) : (
                resumes.slice(0, 3).map((resume) => (
                  <div className="panel" key={resume.id}>
                    <strong>{resume.title}</strong>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
