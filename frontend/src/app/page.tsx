import Link from "next/link";
import { AuthHashRedirect } from "./auth-hash-redirect";

// ============================================================
//   DATA
// ============================================================

const stats = [
  { num: "06", label: "Application outputs", note: "Fit, keywords, summary, resume, reasoning, next steps" },
  { num: "05", label: "Guided questions", note: "Surface context your resume does not show" },
  { num: "03", label: "Resume input modes", note: "PDF, DOCX, or pasted plain text" },
  { num: "01", label: "Saved resume library", note: "Reuse the same base across many roles" },
  { num: "00", label: "Invented experience", note: "Nothing added that you did not write" },
];

const marqueeItems = [
  "SQL", "Stakeholder communication", "Python", "Dashboard reporting",
  "Capstone projects", "ETL pipelines", "Hackathons", "Tableau",
  "Business impact", "KPI tracking", "Internships", "CCA leadership",
  "Coursework", "Part-time work",
];

type StoryKind = "jd" | "resume" | "map" | "fitgap" | "rewrite" | "explain";

const story: {
  n: string;
  side: "left" | "right";
  eyebrow: string;
  title: string;
  body: string;
  outputTag: string;
  kind: StoryKind;
}[] = [
  {
    n: "01",
    side: "left",
    eyebrow: "Step one",
    title: "Read the role like a recruiter.",
    body: "Propelt decomposes the job description into responsibilities, must-haves, and the exact language the employer uses — not a generic keyword dump.",
    outputTag: "Job description breakdown",
    kind: "jd",
  },
  {
    n: "02",
    side: "right",
    eyebrow: "Step two",
    title: "Pull evidence from your real resume.",
    body: "Your projects, internships, coursework, and clubs become the source material. Nothing is added that you did not write.",
    outputTag: "Resume evidence map",
    kind: "resume",
  },
  {
    n: "03",
    side: "left",
    eyebrow: "Step three",
    title: "Map evidence to what the role wants.",
    body: "Each role signal is connected to the strongest matching piece of your background — and where nothing matches, the gap is named.",
    outputTag: "Evidence-to-requirement mapping",
    kind: "map",
  },
  {
    n: "04",
    side: "right",
    eyebrow: "Step four",
    title: "See fit and gaps before you rewrite.",
    body: "Strong, light, and missing — clearly marked. You know what is worth keeping and what needs work before you change a single bullet.",
    outputTag: "Fit & gap analysis",
    kind: "fitgap",
  },
  {
    n: "05",
    side: "left",
    eyebrow: "Step five",
    title: "Rewrite around the role, not around yourself.",
    body: "Each bullet is reordered and rewritten to lead with the evidence the job actually values — quantified where the source allows.",
    outputTag: "Tailored resume",
    kind: "rewrite",
  },
  {
    n: "06",
    side: "right",
    eyebrow: "Step six",
    title: "Leave with reasoning and next steps.",
    body: "Every change comes with a short note on why. Every gap comes with a concrete fix to consider before you apply.",
    outputTag: "Explanation & improvement",
    kind: "explain",
  },
];

const workflowSteps = [
  { n: "01", title: "Add your resume", body: "PDF, DOCX, or paste plain text. Save it once and reuse across roles." },
  { n: "02", title: "Paste the job description", body: "Propelt reads it like a recruiter — responsibilities and language cues." },
  { n: "03", title: "Answer guided questions", body: "Five short prompts surface context the resume cannot show on its own." },
  { n: "04", title: "Review fit and gaps", body: "Strong, light, missing — clearly marked before you change a bullet." },
  { n: "05", title: "Copy a tailored draft", body: "Take a rewritten resume, a summary, and a clear set of next steps." },
];

const principles = [
  {
    glyph: "N",
    title: "No invented experience",
    desc: "Propelt rewrites what you already have. It never adds employers, internships, skills, certifications, or metrics that were not in your input.",
  },
  {
    glyph: "G",
    title: "Gaps are shown, not hidden",
    desc: "Missing skills and weak evidence are flagged honestly so you can decide what to address before applying — not papered over with confident filler.",
  },
  {
    glyph: "C",
    title: "You stay in control",
    desc: "Every change is explained. You decide what to keep, what to revise, and what to ignore before anything is copied into a real application.",
  },
  {
    glyph: "E",
    title: "Built for early-career",
    desc: "Calibrated for the kinds of evidence students and fresh graduates have — coursework, projects, internships, CCAs, part-time work.",
  },
];

const audiences = [
  "University students",
  "Polytechnic students",
  "Fresh graduates",
  "Internship applicants",
  "Junior role applicants",
];

// ============================================================
//   STORY MINI-PREVIEWS
// ============================================================

function StoryPreview({ kind }: { kind: StoryKind }) {
  switch (kind) {
    case "jd":
      return (
        <div className="lp-sp lp-sp--jd" aria-hidden="true">
          <div className="lp-sp-doc">
            <span className="lp-sp-doc-tab">Job description</span>
            <p>
              We are looking for a candidate with <mark>SQL</mark> expertise,
              strong <mark>stakeholder communication</mark>, and the ability
              to <mark>translate business problems</mark> into clear analysis.
              Familiarity with <mark>Python</mark> for automation is a plus.
            </p>
          </div>
          <div className="lp-sp-chips">
            <span className="lp-chip">SQL</span>
            <span className="lp-chip">Stakeholder</span>
            <span className="lp-chip">Business framing</span>
            <span className="lp-chip">Python</span>
          </div>
        </div>
      );

    case "resume":
      return (
        <div className="lp-sp lp-sp--resume" aria-hidden="true">
          <div className="lp-sp-doc">
            <span className="lp-sp-doc-tab">Your resume</span>
            <ul className="lp-sp-resume-list">
              <li><span className="lp-dot" />Statistics &amp; Data Analytics module</li>
              <li><span className="lp-dot" />University Fintech Capstone (client briefing)</li>
              <li><span className="lp-dot" />Marketing Analytics Internship</li>
              <li><span className="lp-dot" />Data Society CCA, lead 2024</li>
              <li><span className="lp-dot" />Tableau coursework + hackathon</li>
            </ul>
          </div>
        </div>
      );

    case "map": {
      const mapRows: { from: string; to: string; miss?: boolean }[] = [
        { from: "Statistics coursework", to: "SQL reporting" },
        { from: "Capstone briefing", to: "Stakeholder communication" },
        { from: "Fintech project", to: "Business framing" },
        { from: "—  Not in resume", to: "Python automation", miss: true },
      ];
      return (
        <div className="lp-sp lp-sp--map" aria-hidden="true">
          {mapRows.map((row, i) => (
            <div
              className={`lp-sp-mrow${row.miss ? " lp-sp-mrow--miss" : ""}`}
              key={row.from}
              style={{ "--lp-stagger": `${i * 0.08}s` } as React.CSSProperties}
            >
              <span className="lp-sp-mfrom">{row.from}</span>
              <span className="lp-sp-marrow" aria-hidden="true">
                <span className="lp-sp-marrow-line" />
                <span className="lp-sp-marrow-tip">→</span>
              </span>
              <span className="lp-sp-mto">{row.to}</span>
            </div>
          ))}
        </div>
      );
    }

    case "fitgap":
      return (
        <div className="lp-sp lp-sp--bars" aria-hidden="true">
          {[
            { label: "Quantitative", v: 82, tag: "strong" },
            { label: "Stakeholder", v: 60, tag: "light" },
            { label: "Python automation", v: 22, tag: "missing" },
            { label: "Cloud familiarity", v: 10, tag: "missing" },
          ].map((b) => (
            <div className="lp-sp-barrow" key={b.label}>
              <span className="lp-sp-barlabel">{b.label}</span>
              <div className="lp-bar">
                <div
                  className={`lp-bar-fill lp-bar-fill--${b.tag}`}
                  style={{ width: `${b.v}%` }}
                />
              </div>
              <span className={`lp-st lp-st--${b.tag}`}>
                {b.tag === "strong" ? "Strong" : b.tag === "light" ? "Light" : "Missing"}
              </span>
            </div>
          ))}
        </div>
      );

    case "rewrite":
      return (
        <div className="lp-sp lp-sp--rewrite" aria-hidden="true">
          <div className="lp-sp-rewrow">
            <span className="lp-bal lp-bal--before">Before</span>
            <p>School project analysing student engagement data.</p>
          </div>
          <div className="lp-sp-rewarrow" aria-hidden="true">↓</div>
          <div className="lp-sp-rewrow lp-sp-rewrow--after">
            <span className="lp-bal lp-bal--after">After</span>
            <p>
              Cleaned and analysed 18,000 rows of campus engagement data in
              SQL and Python; surfaced three retention drivers used in the
              faculty review report.
            </p>
          </div>
        </div>
      );

    case "explain":
      return (
        <ul className="lp-sp lp-sp--explain" aria-hidden="true">
          <li>
            <span className="lp-fp-mark lp-fp-mark--why">Why</span>
            <div>
              <strong>Promoted capstone to top of resume</strong>
              <p>Closest match to &ldquo;stakeholder reporting&rdquo;.</p>
            </div>
          </li>
          <li>
            <span className="lp-fp-mark lp-fp-mark--fix">Fix</span>
            <div>
              <strong>Add a cloud platform example</strong>
              <p>Even a small AWS / GCP project closes the gap.</p>
            </div>
          </li>
        </ul>
      );
  }
}

// ============================================================
//   OUTPUT TAB PANELS (CSS-only tabs via radio inputs)
// ============================================================

function OutputTabsPanels() {
  return (
    <>
      {/* Tab 1: Fit analysis */}
      <div className="lp-tab-panel" data-tab="1">
        <div className="lp-tabp">
          <div className="lp-tabp-head">
            <div>
              <span className="lp-eyebrow">Fit analysis</span>
              <h4>Quantitative-leaning candidate with project evidence</h4>
            </div>
            <div className="lp-tabp-score">
              <strong>76</strong><span>/100</span>
            </div>
          </div>
          <div className="lp-fitbar lp-fitbar--tab"><div className="lp-fitbar-fill" /></div>
          <div className="lp-tabp-grid">
            <div className="lp-tabp-col">
              <span className="lp-microlabel">Strong</span>
              <ul>
                <li>SQL coursework + dashboard projects</li>
                <li>Capstone client briefing</li>
              </ul>
            </div>
            <div className="lp-tabp-col">
              <span className="lp-microlabel">Light</span>
              <ul>
                <li>Business framing — implied only</li>
                <li>Stakeholder language</li>
              </ul>
            </div>
            <div className="lp-tabp-col">
              <span className="lp-microlabel">Missing</span>
              <ul>
                <li>Python automation</li>
                <li>Cloud familiarity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 2: Keyword alignment */}
      <div className="lp-tab-panel" data-tab="2">
        <div className="lp-tabp">
          <div className="lp-tabp-head">
            <div>
              <span className="lp-eyebrow">ATS keyword alignment</span>
              <h4>Ten role requirements matched against your resume</h4>
            </div>
          </div>
          <div className="lp-tabp-kw">
            <span className="lp-kw lp-kw--strong">SQL</span>
            <span className="lp-kw lp-kw--strong">Dashboards</span>
            <span className="lp-kw lp-kw--strong">Stakeholder communication</span>
            <span className="lp-kw lp-kw--strong">KPIs</span>
            <span className="lp-kw lp-kw--strong">Capstone analytics</span>
            <span className="lp-kw lp-kw--light">Business problem framing</span>
            <span className="lp-kw lp-kw--light">Excel modelling</span>
            <span className="lp-kw lp-kw--missing">Python automation</span>
            <span className="lp-kw lp-kw--missing">Cloud platforms</span>
            <span className="lp-kw lp-kw--missing">A/B testing</span>
          </div>
        </div>
      </div>

      {/* Tab 3: Tailored summary */}
      <div className="lp-tab-panel" data-tab="3">
        <div className="lp-tabp lp-tabp--doc">
          <span className="lp-sp-doc-tab">Professional summary · Tailored</span>
          <p className="lp-doc-body">
            Final-year statistics undergraduate with project experience in
            SQL, dashboard reporting, and stakeholder communication. Applying
            for data analyst internships in financial services, with focus on
            campus analytics, retention modelling, and capstone client work.
          </p>
          <div className="lp-doc-foot">
            <span className="lp-eyebrow">Rewritten for</span>
            <strong>Data Analyst Intern</strong>
            <span className="lp-sample" title="Illustrative sample data">Sample</span>
          </div>
        </div>
      </div>

      {/* Tab 4: Tailored resume */}
      <div className="lp-tab-panel" data-tab="4">
        <div className="lp-tabp lp-tabp--doc">
          <span className="lp-sp-doc-tab">NUS Fintech Capstone · Promoted</span>
          <ul className="lp-doc-list">
            <li>
              Built a Python ETL pipeline over 18,000 engagement records,
              surfacing three retention drivers used in the final report.
            </li>
            <li>
              Presented findings to a 6-person faculty review panel and
              translated quantitative results into a one-page brief.
            </li>
            <li>
              Designed and shipped a Tableau dashboard tracking 11 KPIs
              across the academic year.
            </li>
          </ul>
        </div>
      </div>

      {/* Tab 5: Explanation */}
      <div className="lp-tab-panel" data-tab="5">
        <div className="lp-tabp">
          <div className="lp-tabp-head">
            <span className="lp-eyebrow">Explanation of changes</span>
          </div>
          <ul className="lp-tabp-explain">
            <li>
              <span className="lp-fp-mark lp-fp-mark--why">Why</span>
              <div>
                <strong>Promoted capstone to top of resume</strong>
                <p>Maps directly to the role&apos;s &ldquo;stakeholder reporting&rdquo; requirement and shows quantitative impact.</p>
              </div>
            </li>
            <li>
              <span className="lp-fp-mark lp-fp-mark--why">Why</span>
              <div>
                <strong>Quantified the dashboard work (11 KPIs)</strong>
                <p>The role description emphasises measurable outcomes; specific numbers signal that fit.</p>
              </div>
            </li>
            <li>
              <span className="lp-fp-mark lp-fp-mark--why">Why</span>
              <div>
                <strong>Cut unrelated CCA filler</strong>
                <p>Two lines removed — they did not connect to analytical or stakeholder work.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab 6: Improvement suggestions */}
      <div className="lp-tab-panel" data-tab="6">
        <div className="lp-tabp">
          <div className="lp-tabp-head">
            <span className="lp-eyebrow">Improvement suggestions</span>
          </div>
          <ul className="lp-tabp-explain">
            <li>
              <span className="lp-fp-mark lp-fp-mark--fix">Fix</span>
              <div>
                <strong>Add a cloud-platform example</strong>
                <p>Even a small AWS / GCP / Azure project mention closes the only outright Missing requirement.</p>
              </div>
            </li>
            <li>
              <span className="lp-fp-mark lp-fp-mark--fix">Fix</span>
              <div>
                <strong>Prepare a Python-to-SQL interview answer</strong>
                <p>You have both, but they currently live in different sections of the resume.</p>
              </div>
            </li>
            <li>
              <span className="lp-fp-mark lp-fp-mark--fix">Fix</span>
              <div>
                <strong>Quantify the marketing internship</strong>
                <p>The role values measurable outcomes — even a directional number helps.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

// ============================================================
//   PAGE
// ============================================================

export default function Home() {
  return (
    <main className="lp">
      <AuthHashRedirect />
      <header className="lp-header" aria-label="Site header">
        <div className="lp-header-inner">
          <Link className="lp-brand" href="/" aria-label="Propelt home">
            <span className="lp-brand-mark" aria-hidden="true">P</span>
            <span>Propelt</span>
          </Link>
          <nav className="lp-nav" aria-label="Primary">
            <a href="#product">Product</a>
            <a href="#output">Output</a>
            <a href="#process">Process</a>
            <a href="#principles">Principles</a>
          </nav>
          <div className="lp-header-actions">
            <Link className="lp-textlink" href="/auth">Log in</Link>
            <Link className="lp-btn lp-btn--primary lp-btn--compact" href="/auth">
              Start application
              <span className="lp-btn-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <p className="lp-kicker">
              <span className="lp-kicker-dot" aria-hidden="true" />
              For students &amp; fresh graduates · Built in Singapore
            </p>
            <h1 className="lp-h1">
              Stop guessing what to put in
              <span className="lp-h1-accent"> your job application.</span>
            </h1>
            <p className="lp-lead">
              Propelt reads the job description, reads your resume, and builds
              the application around what the role actually wants — without
              inventing a thing.
            </p>
            <div className="lp-cta-row">
              <Link className="lp-btn lp-btn--primary" href="/auth">
                Start your first application
                <span className="lp-btn-arrow" aria-hidden="true">→</span>
              </Link>
              <a className="lp-btn lp-btn--ghost" href="#product">
                See a sample review
              </a>
            </div>
            <ul className="lp-microproof" aria-label="Product principles">
              <li>Grounded in your real resume — no invented metrics or roles</li>
              <li>Every change is explained, so you stay in control</li>
              <li>Designed for early-career applicants, not senior hires</li>
            </ul>
          </div>

          <aside className="lp-preview" aria-label="Illustrative sample application review">
            <div className="lp-preview-toolbar">
              <span className="lp-eyebrow">Application review</span>
              <span className="lp-preview-meta">
                <span className="lp-preview-role">Data Analyst Intern</span>
                <span className="lp-sample" title="Illustrative sample data — not a real candidate">Sample</span>
              </span>
            </div>

            <div className="lp-preview-fit">
              <div className="lp-preview-fitline">
                <div>
                  <span className="lp-microlabel">Fit direction</span>
                  <p className="lp-preview-fittext">
                    Quantitative-leaning candidate with project evidence and
                    light industry exposure.
                  </p>
                </div>
                <div className="lp-fit-badge" aria-label="Fit score 76 out of 100">
                  <strong>76</strong>
                  <span>/100</span>
                </div>
              </div>
              <div className="lp-fitbar" role="presentation">
                <div className="lp-fitbar-fill" />
              </div>
            </div>

            <div className="lp-preview-split">
              <div className="lp-preview-col">
                <span className="lp-microlabel">Role asks for</span>
                <ul className="lp-preview-list">
                  <li>SQL and dashboard reporting</li>
                  <li>Stakeholder communication</li>
                  <li>Business problem framing</li>
                  <li>Python for automation</li>
                </ul>
              </div>
              <div className="lp-preview-col">
                <span className="lp-microlabel">Your resume shows</span>
                <ul className="lp-preview-list lp-preview-list--status">
                  <li><span className="lp-st lp-st--strong">Strong</span><span>Statistics + SQL coursework</span></li>
                  <li><span className="lp-st lp-st--strong">Strong</span><span>Capstone client briefing</span></li>
                  <li><span className="lp-st lp-st--light">Light</span><span>Implied in fintech project</span></li>
                  <li><span className="lp-st lp-st--missing">Missing</span><span>No Python evidence yet</span></li>
                </ul>
              </div>
            </div>

            <div className="lp-preview-bullet">
              <span className="lp-microlabel">Tailored resume bullet</span>
              <div className="lp-ba">
                <div className="lp-ba-row">
                  <span className="lp-bal lp-bal--before">Before</span>
                  <p>School project analysing student engagement data.</p>
                </div>
                <div className="lp-ba-row">
                  <span className="lp-bal lp-bal--after">After</span>
                  <p>
                    Cleaned and analysed 18,000 rows of campus engagement
                    data in SQL and Python; surfaced three retention drivers
                    and presented findings to a faculty review panel.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="lp-section lp-stats" aria-label="What Propelt provides">
        <div className="lp-section-inner">
          <div className="lp-stats-head">
            <p className="lp-kicker">By the numbers</p>
            <h2 className="lp-h2">A workspace, not a chatbot.</h2>
            <p className="lp-section-sub">
              Concrete, structured outputs for one role at a time. These are
              product facts — not user counts.
            </p>
          </div>
          <div className="lp-stats-grid">
            {stats.map((s) => (
              <div className="lp-stat" key={s.label}>
                <span className="lp-stat-num">{s.num}</span>
                <strong className="lp-stat-label">{s.label}</strong>
                <span className="lp-stat-note">{s.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="lp-marquee" aria-hidden="true">
        <div className="lp-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span className="lp-marquee-item" key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ============ STORY ============ */}
      <section className="lp-section lp-story-section" id="product">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">Inside the workspace</p>
            <h2 className="lp-h2">
              Six pieces of thinking,<br />
              between a job description and your draft.
            </h2>
            <p className="lp-section-sub">
              Each step is concrete — the kind of thinking a good mentor would
              do with you, in writing, before you apply.
            </p>
          </div>

          <ol className="lp-story">
            {story.map((s) => (
              <li
                className={`lp-story-step lp-story-step--${s.side}`}
                key={s.n}
              >
                <div className="lp-story-node">
                  <span className="lp-story-num">{s.n}</span>
                </div>
                <div className="lp-story-copy">
                  <span className="lp-eyebrow">{s.eyebrow}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <span className="lp-story-tag">{s.outputTag}</span>
                </div>
                <div className="lp-story-preview">
                  <div className="lp-story-preview-card">
                    <StoryPreview kind={s.kind} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ DEMO ============ */}
      <section className="lp-section lp-demo">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">A sample review</p>
            <h2 className="lp-h2">
              Job in, resume in, structured thinking out.
            </h2>
            <p className="lp-section-sub">
              The same three columns appear inside the workspace as you build
              each application.
            </p>
          </div>

          <div className="lp-demo-frame">
            <div className="lp-demo-header">
              <div className="lp-demo-role-wrap">
                <span className="lp-eyebrow">Role</span>
                <h3 className="lp-demo-role">
                  Data Analyst Intern
                  <span className="lp-sample" title="Illustrative sample data">Sample</span>
                </h3>
              </div>
              <div className="lp-demo-fit">
                <div className="lp-demo-fit-meta">
                  <span className="lp-microlabel">Overall fit</span>
                  <strong>76<span>/100</span></strong>
                </div>
                <div className="lp-fitbar lp-fitbar--demo">
                  <div className="lp-fitbar-fill" />
                </div>
              </div>
            </div>

            <div className="lp-demo-cols">
              <div className="lp-demo-col">
                <span className="lp-microlabel">Job asks for</span>
                <ul className="lp-demo-list">
                  <li>SQL reporting &amp; dashboards</li>
                  <li>Stakeholder communication</li>
                  <li>Translate business problems</li>
                  <li>Python automation</li>
                  <li>Comfort with ambiguity</li>
                </ul>
              </div>

              <div className="lp-demo-col">
                <span className="lp-microlabel">Your resume shows</span>
                <ul className="lp-demo-list lp-demo-list--status">
                  <li><span className="lp-st lp-st--strong">Strong</span>Dashboard project, 2 internships</li>
                  <li><span className="lp-st lp-st--strong">Strong</span>Capstone client briefing</li>
                  <li><span className="lp-st lp-st--light">Light</span>Implied in fintech project</li>
                  <li><span className="lp-st lp-st--missing">Missing</span>No Python evidence yet</li>
                  <li><span className="lp-st lp-st--light">Light</span>Hackathon retro mentioned</li>
                </ul>
              </div>

              <div className="lp-demo-col">
                <span className="lp-microlabel">Propelt recommends</span>
                <ul className="lp-demo-list lp-demo-list--rec">
                  <li>Lead with the analytics capstone</li>
                  <li>Rewrite bullets around business impact</li>
                  <li>Quantify the dashboard project</li>
                  <li>Flag missing Python — plan a fix</li>
                  <li>Cut unrelated CCA filler</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WORKFLOW ============ */}
      <section className="lp-section lp-process" id="process">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">How you use it</p>
            <h2 className="lp-h2">Five steps from blank page to tailored draft.</h2>
            <p className="lp-section-sub">A guided workspace — not a blank resume editor.</p>
          </div>
          <ol className="lp-flow">
            {workflowSteps.map((s, i) => (
              <li className="lp-flow-step" key={s.n}>
                <div className="lp-flow-head">
                  <span className="lp-flow-num">{s.n}</span>
                  {i < workflowSteps.length - 1 && (
                    <span className="lp-flow-line" aria-hidden="true" />
                  )}
                </div>
                <h3 className="lp-flow-title">{s.title}</h3>
                <p className="lp-flow-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ OUTPUT TABS ============ */}
      <section className="lp-section lp-outputs" id="output">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">What you receive</p>
            <h2 className="lp-h2">Six concrete outputs. One target role.</h2>
            <p className="lp-section-sub">
              Switch between them — read, revise, then copy each one straight
              into your application. <span className="lp-section-note">All previews below use sample data.</span>
            </p>
          </div>

          <fieldset className="lp-tabs">
            <legend className="lp-sr-only">Browse Propelt output samples</legend>
            <input type="radio" name="lp-output-tab" id="lp-ot-1" defaultChecked aria-label="Fit analysis sample" />
            <input type="radio" name="lp-output-tab" id="lp-ot-2" aria-label="Keyword alignment sample" />
            <input type="radio" name="lp-output-tab" id="lp-ot-3" aria-label="Tailored summary sample" />
            <input type="radio" name="lp-output-tab" id="lp-ot-4" aria-label="Tailored resume sample" />
            <input type="radio" name="lp-output-tab" id="lp-ot-5" aria-label="Explanation sample" />
            <input type="radio" name="lp-output-tab" id="lp-ot-6" aria-label="Improvement sample" />

            <div className="lp-tabs-labels">
              <label htmlFor="lp-ot-1"><span className="lp-tabs-n">01</span>Fit analysis</label>
              <label htmlFor="lp-ot-2"><span className="lp-tabs-n">02</span>Keywords</label>
              <label htmlFor="lp-ot-3"><span className="lp-tabs-n">03</span>Summary</label>
              <label htmlFor="lp-ot-4"><span className="lp-tabs-n">04</span>Resume</label>
              <label htmlFor="lp-ot-5"><span className="lp-tabs-n">05</span>Explanation</label>
              <label htmlFor="lp-ot-6"><span className="lp-tabs-n">06</span>Improvement</label>
            </div>

            <div className="lp-tabs-panels">
              <OutputTabsPanels />
            </div>
          </fieldset>
        </div>
      </section>

      {/* ============ PRINCIPLES ============ */}
      <section className="lp-section lp-principles" id="principles">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">Principles</p>
            <h2 className="lp-h2">Professional does not mean inflated.</h2>
            <p className="lp-section-sub">
              These are the rules behind every output Propelt produces.
            </p>
          </div>
          <div className="lp-principles-grid">
            {principles.map((p) => (
              <article className="lp-prin" key={p.title}>
                <span className="lp-prin-glyph" aria-hidden="true">{p.glyph}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
          <ul className="lp-audience-list" aria-label="Built for">
            {audiences.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="lp-final">
        <div className="lp-final-glow" aria-hidden="true" />
        <div className="lp-final-inner">
          <div>
            <p className="lp-kicker lp-kicker--light">
              <span className="lp-kicker-dot" aria-hidden="true" />
              Get started
            </p>
            <h2 className="lp-h2 lp-h2--light">
              Start with one resume and one job description.
            </h2>
            <p className="lp-final-sub">
              Propelt will help you understand the role, focus your evidence,
              and leave with an application that is clearer to the recruiter —
              and to you.
            </p>
          </div>
          <Link className="lp-btn lp-btn--light lp-btn--large" href="/auth">
            Build my first application
            <span className="lp-btn-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="lp-footer" aria-label="Site footer">
        <div className="lp-footer-inner">
          <span className="lp-brand">
            <span className="lp-brand-mark" aria-hidden="true">P</span>
            <span>Propelt</span>
          </span>
          <span className="lp-footer-meta">
            Built for early-career candidates, starting in Singapore.
          </span>
        </div>
      </footer>
    </main>
  );
}
