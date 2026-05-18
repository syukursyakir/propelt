"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Application, GeneratedResult } from "@propelt/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/use-session";

type TabKey = keyof GeneratedResult;

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "sectionA", label: "A Fit" },
  { key: "sectionB", label: "B ATS" },
  { key: "sectionC", label: "C Summary" },
  { key: "sectionD", label: "D Resume" },
  { key: "sectionE", label: "E Changes" },
  { key: "sectionF", label: "F Suggestions" },
];

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const { loading } = useSession();
  const [application, setApplication] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("sectionA");
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) {
      api.getApplication(params.id).then(({ application }) => {
        setApplication(application);
      }).catch((loadError) =>
        setError(loadError instanceof Error ? loadError.message : "Load failed"),
      );
    }
  }, [loading, params.id]);

  const activeText = useMemo(() => {
    if (!application) {
      return "";
    }
    return renderSection(application.result, activeTab);
  }, [activeTab, application]);

  useEffect(() => {
    setDraft(activeText);
  }, [activeText]);

  const copy = async () => {
    await navigator.clipboard.writeText(draft);
    setMessage("Copied.");
  };

  const saveEdits = async () => {
    if (!application) {
      return;
    }

    const nextResult = applySectionText(application.result, activeTab, draft);
    const { application: updated } = await api.updateApplicationResult(
      application.id,
      nextResult,
    );
    setApplication(updated);
    setMessage("Saved.");
  };

  if (loading || !application) {
    return <main className="page">{error || "Loading..."}</main>;
  }

  return (
    <main className="page">
      <section className="workspace stack">
        <div className="topbar">
          <div>
            <h1>{application.jobTitle || "Application result"}</h1>
            <p className="muted">
              {application.companyName || "No company added"} · Generated result
            </p>
          </div>
          <div className="actions">
            <Link className="button secondary" href="/dashboard">
              Dashboard
            </Link>
            <Link className="button" href="/applications/new">
              New application
            </Link>
          </div>
        </div>
        {message ? <div className="success">{message}</div> : null}
        {error ? <div className="error">{error}</div> : null}
        <div className="card">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                className={`tab ${activeTab === tab.key ? "active" : ""}`}
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="actions" style={{ marginBottom: 16 }}>
            <button className="button secondary" type="button" onClick={copy}>
              Copy section
            </button>
            <button className="button" type="button" onClick={saveEdits}>
              Save edits
            </button>
          </div>
          <div className="field">
            <label htmlFor="draft">Editable section</label>
            <textarea
              id="draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              style={{ minHeight: 420 }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function renderSection(result: GeneratedResult, key: TabKey) {
  if (key === "sectionA") {
    return [
      `Fit Score: ${result.sectionA.fitScore}/100`,
      "",
      "Strong Matches:",
      ...result.sectionA.strongMatches.map((item) => `- ${item}`),
      "",
      "Potential Gaps:",
      ...result.sectionA.potentialGaps.map((item) => `- ${item}`),
      "",
      "Recommended Focus:",
      ...result.sectionA.recommendedFocus.map((item) => `- ${item}`),
    ].join("\n");
  }

  if (key === "sectionB") {
    return [
      "Already Demonstrated:",
      ...result.sectionB.alreadyDemonstrated.map((item) => `- ${item}`),
      "",
      "Weakly Demonstrated:",
      ...result.sectionB.weaklyDemonstrated.map((item) => `- ${item}`),
      "",
      "Missing:",
      ...result.sectionB.missing.map((item) => `- ${item}`),
    ].join("\n");
  }

  if (key === "sectionC") {
    return result.sectionC.professionalSummary;
  }

  if (key === "sectionD") {
    return result.sectionD.tailoredResumeMarkdown;
  }

  if (key === "sectionE") {
    return result.sectionE.changes.map((item) => `- ${item}`).join("\n");
  }

  return result.sectionF.suggestions.map((item) => `- ${item}`).join("\n");
}

function applySectionText(
  result: GeneratedResult,
  key: TabKey,
  value: string,
): GeneratedResult {
  if (key === "sectionC") {
    return {
      ...result,
      sectionC: { professionalSummary: value },
    };
  }

  if (key === "sectionD") {
    return {
      ...result,
      sectionD: { tailoredResumeMarkdown: value },
    };
  }

  if (key === "sectionE") {
    return {
      ...result,
      sectionE: { changes: linesToBullets(value) },
    };
  }

  if (key === "sectionF") {
    return {
      ...result,
      sectionF: { suggestions: linesToBullets(value) },
    };
  }

  return result;
}

function linesToBullets(value: string) {
  return value
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}
