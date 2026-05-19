"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Application, GeneratedResult } from "@propelt/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/use-session";
import { AppShell } from "@/components/app-shell";

type TabKey = keyof GeneratedResult;

const tabs: Array<{ key: TabKey; label: string; short: string }> = [
  { key: "sectionA", label: "Fit analysis", short: "A" },
  { key: "sectionB", label: "Keyword alignment", short: "B" },
  { key: "sectionC", label: "Tailored summary", short: "C" },
  { key: "sectionD", label: "Tailored resume", short: "D" },
  { key: "sectionE", label: "Explanation", short: "E" },
  { key: "sectionF", label: "Suggestions", short: "F" },
];

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const { loading } = useSession();
  const [application, setApplication] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("sectionA");
  const [draft, setDraft] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
    if (!application) return "";
    return renderSection(application.result, activeTab);
  }, [activeTab, application]);

  useEffect(() => {
    setDraft(activeText);
    setEditMode(false);
  }, [activeText]);

  const flash = (text: string) => {
    setMessage(text);
    setError("");
    window.setTimeout(() => setMessage(""), 1800);
  };

  const copySection = async () => {
    try {
      await navigator.clipboard.writeText(editMode ? draft : activeText);
      flash("Section copied to clipboard.");
    } catch {
      setError("Could not access clipboard.");
    }
  };

  const copyFullResult = async () => {
    if (!application) return;
    const full = tabs
      .map((tab) => `# ${tab.label}\n\n${renderSection(application.result, tab.key)}`)
      .join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(full);
      flash("Full result copied.");
    } catch {
      setError("Could not access clipboard.");
    }
  };

  const saveEdits = async () => {
    if (!application) return;
    setBusy(true);
    setError("");
    try {
      const nextResult = applySectionText(application.result, activeTab, draft);
      const { application: updated } = await api.updateApplicationResult(
        application.id,
        nextResult,
      );
      setApplication(updated);
      setEditMode(false);
      flash("Saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading || !application) {
    return (
      <AppShell>
        <p className="muted">{error || "Loading…"}</p>
      </AppShell>
    );
  }

  const created = formatDate(application.createdAt);

  return (
    <AppShell>
      <div className="app-page-header">
        <div>
          <p className="eyebrow">Application result</p>
          <h1>{application.jobTitle || "Untitled role"}</h1>
          <p className="muted">
            {application.companyName || "No company added"} · Generated {created}
          </p>
        </div>
        <div className="actions">
          <button className="button secondary" type="button" onClick={copyFullResult}>
            Copy full result
          </button>
          <Link className="button" href="/applications/new">
            New application
          </Link>
        </div>
      </div>
      <section className="workspace stack">
        {message ? <div className="success">{message}</div> : null}
        {error ? <div className="error">{error}</div> : null}
        <div className="card stack">
          <div className="tabs result-tabs">
            {tabs.map((tab) => (
              <button
                className={`tab ${activeTab === tab.key ? "active" : ""}`}
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="tab-short">{tab.short}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="result-actions">
            <button className="button secondary" type="button" onClick={copySection}>
              Copy section
            </button>
            {editMode ? (
              <>
                <button
                  className="button ghost"
                  type="button"
                  onClick={() => {
                    setDraft(activeText);
                    setEditMode(false);
                  }}
                >
                  Discard edits
                </button>
                <button
                  className="button"
                  type="button"
                  onClick={saveEdits}
                  disabled={busy}
                >
                  {busy ? "Saving…" : "Save edits"}
                </button>
              </>
            ) : isEditableTab(activeTab) ? (
              <button
                className="button ghost"
                type="button"
                onClick={() => setEditMode(true)}
              >
                Edit section
              </button>
            ) : (
              <span className="muted">Section A and B render as analysis.</span>
            )}
          </div>

          {editMode ? (
            <div className="field">
              <label htmlFor="draft">Editable section</label>
              <textarea
                id="draft"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                style={{ minHeight: 360 }}
              />
            </div>
          ) : (
            <ReadableSection result={application.result} tab={activeTab} />
          )}
        </div>
      </section>
    </AppShell>
  );
}

// ---------------------- Readable display ----------------------

function ReadableSection({
  result,
  tab,
}: {
  result: GeneratedResult;
  tab: TabKey;
}) {
  if (tab === "sectionA") {
    const a = result.sectionA;
    return (
      <div className="result-section">
        <div className="result-score">
          <span className="result-score-label">Fit score</span>
          <span className="result-score-value">{a.fitScore}<small>/100</small></span>
          <div className="result-score-bar">
            <div className="result-score-bar-fill" style={{ width: `${Math.max(0, Math.min(100, a.fitScore))}%` }} />
          </div>
        </div>
        <div className="result-cols">
          <BulletList title="Strong matches" tone="strong" items={a.strongMatches} />
          <BulletList title="Potential gaps" tone="gap" items={a.potentialGaps} />
          <BulletList title="Recommended focus" tone="focus" items={a.recommendedFocus} />
        </div>
      </div>
    );
  }

  if (tab === "sectionB") {
    const b = result.sectionB;
    return (
      <div className="result-section">
        <div className="result-cols">
          <BulletList title="Already demonstrated" tone="strong" items={b.alreadyDemonstrated} />
          <BulletList title="Weakly demonstrated" tone="gap" items={b.weaklyDemonstrated} />
          <BulletList title="Missing" tone="miss" items={b.missing} />
        </div>
      </div>
    );
  }

  if (tab === "sectionC") {
    return (
      <div className="result-prose">{result.sectionC.professionalSummary || <em>No summary generated.</em>}</div>
    );
  }

  if (tab === "sectionD") {
    return (
      <pre className="result-pre">{result.sectionD.tailoredResumeMarkdown || "(empty)"}</pre>
    );
  }

  if (tab === "sectionE") {
    return <SimpleList items={result.sectionE.changes} />;
  }

  return <SimpleList items={result.sectionF.suggestions} />;
}

function BulletList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "strong" | "gap" | "miss" | "focus";
}) {
  return (
    <div className={`result-col result-col--${tone}`}>
      <p className="microlabel">{title}</p>
      {items.length === 0 ? (
        <p className="muted">None.</p>
      ) : (
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SimpleList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="muted">No entries.</p>;
  return (
    <ul className="result-simple-list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

// ---------------------- Helpers ----------------------

function isEditableTab(key: TabKey) {
  return key === "sectionC" || key === "sectionD" || key === "sectionE" || key === "sectionF";
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

  if (key === "sectionC") return result.sectionC.professionalSummary;
  if (key === "sectionD") return result.sectionD.tailoredResumeMarkdown;
  if (key === "sectionE") return result.sectionE.changes.map((item) => `- ${item}`).join("\n");
  return result.sectionF.suggestions.map((item) => `- ${item}`).join("\n");
}

function applySectionText(
  result: GeneratedResult,
  key: TabKey,
  value: string,
): GeneratedResult {
  if (key === "sectionC") return { ...result, sectionC: { professionalSummary: value } };
  if (key === "sectionD") return { ...result, sectionD: { tailoredResumeMarkdown: value } };
  if (key === "sectionE") return { ...result, sectionE: { changes: linesToBullets(value) } };
  if (key === "sectionF") return { ...result, sectionF: { suggestions: linesToBullets(value) } };
  return result;
}

function linesToBullets(value: string) {
  return value
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);
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
