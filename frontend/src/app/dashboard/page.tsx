"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Application, Resume } from "@propelt/shared";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/use-session";

export default function DashboardPage() {
  const { loading } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!loading) {
      Promise.all([api.listResumes(), api.listApplications()]).then(
        ([resumeData, applicationData]) => {
          setResumes(resumeData.resumes);
          setApplications(applicationData.applications);
        },
      );
    }
  }, [loading]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <main className="page">Loading...</main>;
  }

  return (
    <main className="page">
      <section className="workspace stack">
        <div className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p className="muted">Manage reusable resumes and job applications.</p>
          </div>
          <div className="actions">
            <Link className="button secondary" href="/resumes">
              Resumes
            </Link>
            <Link className="button" href="/applications/new">
              New application
            </Link>
            <button className="button ghost" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
        <div className="grid">
          <div className="card stack">
            <h2>Saved resumes</h2>
            <p className="muted">{resumes.length} reusable resume profile(s)</p>
            {resumes.slice(0, 3).map((resume) => (
              <div className="panel" key={resume.id}>
                <strong>{resume.title}</strong>
              </div>
            ))}
          </div>
          <div className="card stack">
            <h2>Recent applications</h2>
            {applications.length === 0 ? (
              <p className="muted">No tailored applications yet.</p>
            ) : (
              applications.slice(0, 5).map((application) => (
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
        </div>
      </section>
    </main>
  );
}
