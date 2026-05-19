"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Application } from "@propelt/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/use-session";
import { AppShell } from "@/components/app-shell";

export default function ApplicationsPage() {
  const { loading } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [armedId, setArmedId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    api.listApplications().then(({ applications }) => {
      setApplications(applications);
      setFetched(true);
    }).catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : "Load failed");
      setFetched(true);
    });
  }, [loading]);

  const remove = async (id: string) => {
    if (armedId !== id) {
      setArmedId(id);
      return;
    }
    setBusyId(id);
    setError("");
    try {
      await api.deleteApplication(id);
      setApplications((current) => current.filter((item) => item.id !== id));
      setArmedId(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
    } finally {
      setBusyId(null);
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
          <p className="eyebrow">Application history</p>
          <h1>Applications</h1>
          <p className="muted">Every tailored application you have generated.</p>
        </div>
        <Link className="button" href="/applications/new">
          New application
        </Link>
      </div>

      {error ? <div className="error">{error}</div> : null}

      {!fetched ? (
        <p className="muted">Loading your applications…</p>
      ) : applications.length === 0 ? (
        <div className="card stack app-empty">
          <div>
            <h2>No applications yet</h2>
            <p className="muted">
              Start by pasting a job description into a new application. Your
              tailored result will be saved here for review and reuse.
            </p>
          </div>
          <div className="actions">
            <Link className="button" href="/applications/new">
              Start your first application
            </Link>
          </div>
        </div>
      ) : (
        <ul className="app-list">
          {applications.map((application) => (
            <li className="app-list-row" key={application.id}>
              <Link
                className="app-list-main"
                href={`/applications/${application.id}`}
              >
                <div>
                  <strong>{application.jobTitle || "Untitled role"}</strong>
                  <p className="muted">
                    {application.companyName || "No company"}
                  </p>
                </div>
                <span className="app-list-date">
                  {formatDate(application.createdAt)}
                </span>
              </Link>
              <button
                type="button"
                className={`button ghost app-list-delete${armedId === application.id ? " app-list-delete-armed" : ""}`}
                onClick={() => remove(application.id)}
                onBlur={() =>
                  setArmedId((current) => (current === application.id ? null : current))
                }
                disabled={busyId === application.id}
                aria-label="Delete application"
              >
                {busyId === application.id
                  ? "Deleting…"
                  : armedId === application.id
                    ? "Confirm delete"
                    : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

function formatDate(value: string) {
  try {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}
