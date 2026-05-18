"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CandidateProfile } from "@propelt/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/use-session";

const initialProfile: CandidateProfile = {
  fullName: "",
  school: "",
  course: "",
  graduationYear: "",
  userType: "university_student",
  targetRole: "",
  targetIndustry: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { loading } = useSession();
  const [profile, setProfile] = useState<CandidateProfile>(initialProfile);
  const [resumeTitle, setResumeTitle] = useState("Main Resume");
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getProfile().then(({ profile: existing }) => {
      if (existing) {
        setProfile(existing);
      }
    }).catch(() => undefined);
  }, []);

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

  const save = async () => {
    setError("");
    setBusy(true);
    try {
      await api.saveProfile(profile);
      await api.createResume({ title: resumeTitle, content: resumeText });
      router.replace("/dashboard");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
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
        <div>
          <h1>Set up your career profile</h1>
          <p className="muted">
            This gives Propelt reusable context before tailoring each job
            application.
          </p>
        </div>
        {error ? <div className="error">{error}</div> : null}
        <div className="card stack">
          <h2>1. Basic profile</h2>
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
        </div>
        <div className="card stack">
          <h2>2. Save your first resume</h2>
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
          <button className="button secondary" type="button" disabled={busy} onClick={parseResume}>
            Parse resume
          </button>
          <div className="field">
            <label htmlFor="resumeText">Editable resume text preview</label>
            <textarea
              id="resumeText"
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste resume text here if upload parsing fails."
              style={{ minHeight: 300 }}
            />
          </div>
        </div>
        <button className="button" type="button" disabled={busy} onClick={save}>
          Finish onboarding
        </button>
      </section>
    </main>
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
