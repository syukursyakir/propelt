import Link from "next/link";

const stats = [
  { num: "06", label: "Application outputs", note: "Fit, keywords, summary, resume, reasoning, next steps" },
  { num: "05", label: "Guided questions", note: "Surface context your resume does not show" },
  { num: "03", label: "Resume input modes", note: "PDF, DOCX, or pasted plain text" },
  { num: "01", label: "Saved resume library", note: "Reuse the same base across many roles" },
  { num: "00", label: "Invented experience", note: "Nothing added that you did not write" },
];

const marqueeItems = [
  "SQL",
  "Stakeholder communication",
  "Python",
  "Dashboard reporting",
  "Capstone projects",
  "ETL pipelines",
  "Hackathons",
  "Tableau",
  "Business impact",
  "KPI tracking",
  "Internships",
  "CCA leadership",
  "Coursework",
  "Part-time work",
];

type FeatureKind =
  | "evidence"
  | "jdbreak"
  | "fitgap"
  | "ats"
  | "rewrite"
  | "explain";

const features: {
  eyebrow: string;
  title: string;
  body: string;
  kind: FeatureKind;
}[] = [
  {
    eyebrow: "Read the resume",
    title: "Resume evidence mapping",
    body: "Propelt reads your resume the way a recruiter would and pulls the projects, internships, and coursework most relevant to the target role.",
    kind: "evidence",
  },
  {
    eyebrow: "Read the role",
    title: "Job description breakdown",
    body: "Each role is decomposed into responsibilities, must-haves, and the keywords the employer actually uses.",
    kind: "jdbreak",
  },
  {
    eyebrow: "Compare",
    title: "Fit and gap analysis",
    body: "See where your evidence is strong, where it is lightly shown, and where there is a real gap worth addressing.",
    kind: "fitgap",
  },
  {
    eyebrow: "Align",
    title: "ATS keyword alignment",
    body: "Every requirement is matched against your resume with a clear status, so nothing important is silently dropped.",
    kind: "ats",
  },
  {
    eyebrow: "Rewrite",
    title: "Tailored resume rewrite",
    body: "Your bullets are reordered and rewritten around the role — focused on the evidence that actually fits.",
    kind: "rewrite",
  },
  {
    eyebrow: "Improve",
    title: "Explanation & next steps",
    body: "Every change comes with a short note on why, plus specific gaps to address before you apply.",
    kind: "explain",
  },
];

const workflowSteps = [
  {
    n: "01",
    title: "Add your resume",
    body: "PDF, DOCX, or paste plain text. Save it once and reuse across roles.",
  },
  {
    n: "02",
    title: "Paste the job description",
    body: "Propelt reads it like a recruiter — responsibilities, must-haves, and language cues.",
  },
  {
    n: "03",
    title: "Answer guided questions",
    body: "Five short prompts surface context the resume cannot show on its own.",
  },
  {
    n: "04",
    title: "Review fit and gaps",
    body: "Strong, light, missing — clearly marked before you change a single bullet.",
  },
  {
    n: "05",
    title: "Copy a tailored application",
    body: "Take a rewritten resume, a role-specific summary, and a clear set of next steps.",
  },
];

type OutputKind =
  | "fit"
  | "ats"
  | "summary"
  | "resume"
  | "explain"
  | "improve";

const outputs: { title: string; desc: string; kind: OutputKind }[] = [
  {
    title: "Candidate fit analysis",
    desc: "Where your background is strong, where it is light, and which parts of the role to organise the application around.",
    kind: "fit",
  },
  {
    title: "ATS keyword alignment",
    desc: "Each requirement marked as shown, lightly shown, or missing — alongside the exact phrasing from the role.",
    kind: "ats",
  },
  {
    title: "Tailored professional summary",
    desc: "A concise opening paragraph rewritten around the role, in language a recruiter for that position recognises.",
    kind: "summary",
  },
  {
    title: "Tailored resume",
    desc: "Your bullets reordered and rewritten to lead with the evidence the job actually values — without invention.",
    kind: "resume",
  },
  {
    title: "Explanation of changes",
    desc: "Every rewritten bullet comes with a short note on what changed and why, so you can keep or revise with intent.",
    kind: "explain",
  },
  {
    title: "Improvement suggestions",
    desc: "Specific gaps to address before applying — a project to mention, a skill to learn, an answer to prepare.",
    kind: "improve",
  },
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
    desc: "Missing skills and weak evidence are flagged honestly, so you can decide what to address before applying — not papered over with confident filler.",
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

// ---------- Feature mini-previews ----------

function FeaturePreview({ kind }: { kind: FeatureKind }) {
  switch (kind) {
    case "evidence":
      return (
        <div className="lp-fp lp-fp--evidence" aria-hidden="true">
          {[
            ["DSA1101 coursework", "Analytical evidence"],
            ["NUS Fintech capstone", "Stakeholder evidence"],
            ["DataKind hackathon", "Python evidence"],
          ].map(([from, to]) => (
            <div className="lp-fp-evrow" key={from}>
              <span className="lp-fp-from">{from}</span>
              <span className="lp-fp-arrow" aria-hidden="true">→</span>
              <span className="lp-fp-to">{to}</span>
            </div>
          ))}
        </div>
      );

    case "jdbreak":
      return (
        <p className="lp-fp lp-fp--jd" aria-hidden="true">
          We are looking for a candidate with <mark>SQL</mark> expertise,
          strong <mark>stakeholder communication</mark>, and the ability to
          <mark>translate business problems</mark> into clear analysis.
        </p>
      );

    case "fitgap":
      return (
        <div className="lp-fp lp-fp--bars" aria-hidden="true">
          {[
            { label: "Quantitative", v: 82 },
            { label: "Stakeholder", v: 60 },
            { label: "Industry", v: 30 },
          ].map((b) => (
            <div className="lp-fp-barrow" key={b.label}>
              <span className="lp-fp-barlabel">{b.label}</span>
              <div className="lp-bar">
                <div className="lp-bar-fill" style={{ width: `${b.v}%` }} />
              </div>
              <span className="lp-fp-barval">{b.v}</span>
            </div>
          ))}
        </div>
      );

    case "ats":
      return (
        <div className="lp-fp lp-fp--ats" aria-hidden="true">
          {[
            ["SQL", "strong"],
            ["Tableau", "strong"],
            ["Stakeholder", "light"],
            ["Cloud", "missing"],
            ["Python", "strong"],
            ["KPI", "light"],
          ].map(([word, s]) => (
            <span className={`lp-kw lp-kw--${s}`} key={word}>
              {word}
            </span>
          ))}
        </div>
      );

    case "rewrite":
      return (
        <div className="lp-fp lp-fp--rewrite" aria-hidden="true">
          <div className="lp-fp-rewrow">
            <span className="lp-bal lp-bal--before">Before</span>
            <p>School project analysing student data.</p>
          </div>
          <div className="lp-fp-rewrow">
            <span className="lp-bal lp-bal--after">After</span>
            <p>
              Cleaned 18k rows in SQL and Python; surfaced three retention
              drivers used in the faculty review report.
            </p>
          </div>
        </div>
      );

    case "explain":
      return (
        <ul className="lp-fp lp-fp--explain" aria-hidden="true">
          <li>
            <span className="lp-fp-mark lp-fp-mark--why">Why</span>
            Led with the project that matches &ldquo;stakeholder reporting&rdquo; most directly.
          </li>
          <li>
            <span className="lp-fp-mark lp-fp-mark--fix">Fix</span>
            Mention a cloud platform (AWS, GCP) before applying.
          </li>
        </ul>
      );
  }
}

// ---------- Output card mini-previews ----------

function OutputPreview({ kind }: { kind: OutputKind }) {
  switch (kind) {
    case "fit":
      return (
        <div className="lp-op lp-op--fit" aria-hidden="true">
          <div className="lp-op-fit-meta">
            <span className="lp-microlabel">Fit score</span>
            <strong>76<span className="lp-op-fit-of">/100</span></strong>
          </div>
          <div className="lp-bar"><div className="lp-bar-fill" style={{ width: "76%" }} /></div>
        </div>
      );

    case "ats":
      return (
        <div className="lp-op lp-op--ats" aria-hidden="true">
          <span className="lp-kw lp-kw--strong">SQL</span>
          <span className="lp-kw lp-kw--strong">Stakeholder</span>
          <span className="lp-kw lp-kw--light">Python</span>
          <span className="lp-kw lp-kw--missing">Cloud</span>
        </div>
      );

    case "summary":
      return (
        <p className="lp-op lp-op--summary" aria-hidden="true">
          Final-year statistics student with project experience in SQL,
          dashboard reporting, and stakeholder communication — applying for
          data analyst roles in financial services.
        </p>
      );

    case "resume":
      return (
        <ul className="lp-op lp-op--resume" aria-hidden="true">
          <li>Built a Python ETL pipeline over 18k engagement records.</li>
          <li>Presented retention findings to a 6-person faculty panel.</li>
        </ul>
      );

    case "explain":
      return (
        <ul className="lp-op lp-op--explain" aria-hidden="true">
          <li><span className="lp-fp-mark lp-fp-mark--why">Why</span>Promoted because it shows analytical impact.</li>
          <li><span className="lp-fp-mark lp-fp-mark--why">Why</span>Quantified to match the role&apos;s metrics.</li>
        </ul>
      );

    case "improve":
      return (
        <ul className="lp-op lp-op--explain" aria-hidden="true">
          <li><span className="lp-fp-mark lp-fp-mark--fix">Fix</span>Add a cloud platform example.</li>
          <li><span className="lp-fp-mark lp-fp-mark--fix">Fix</span>Prepare a SQL-to-Tableau answer.</li>
        </ul>
      );
  }
}

// ---------- Page ----------

export default function Home() {
  return (
    <main className="lp">
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
              Start your application
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
              For students &amp; fresh graduates in Singapore
            </p>
            <h1 className="lp-h1">
              Stop guessing what to put in your job application.
            </h1>
            <p className="lp-lead">
              Propelt reads the job description, reads your resume, and builds
              the application around what the role actually wants — without
              inventing a thing.
            </p>
            <div className="lp-cta-row">
              <Link className="lp-btn lp-btn--primary" href="/auth">
                Start your first application
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

          <aside className="lp-preview" aria-label="Sample application review">
            <div className="lp-preview-toolbar">
              <span className="lp-eyebrow">Application review</span>
              <span className="lp-preview-role">Data Analyst Intern · DBS</span>
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
                  <li><span className="lp-st lp-st--strong">Strong</span><span>DSA1101 + SQL coursework</span></li>
                  <li><span className="lp-st lp-st--strong">Strong</span><span>Capstone client briefing</span></li>
                  <li><span className="lp-st lp-st--light">Light</span><span>Implied in NUS Fintech project</span></li>
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
                    Cleaned and analysed 18,000 rows of campus engagement data
                    using SQL and Python; surfaced three retention drivers and
                    presented findings to a faculty review panel.
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
            <span className="lp-marquee-item" key={i}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ============ FEATURES ============ */}
      <section className="lp-section lp-features">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">Inside the workspace</p>
            <h2 className="lp-h2">
              Six things Propelt does for every application.
            </h2>
            <p className="lp-section-sub">
              Each one is a small, concrete piece of thinking — the kind a
              good mentor would do with you, in writing, before you apply.
            </p>
          </div>
          <div className="lp-features-grid">
            {features.map((f) => (
              <article className="lp-feat" key={f.title}>
                <div className="lp-feat-preview">
                  <FeaturePreview kind={f.kind} />
                </div>
                <div className="lp-feat-body">
                  <span className="lp-eyebrow">{f.eyebrow}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUCT DEMO ============ */}
      <section className="lp-section lp-demo" id="product">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">A sample review</p>
            <h2 className="lp-h2">
              Job in, resume in, structured thinking out.
            </h2>
            <p className="lp-section-sub">
              Below is a slice of what Propelt produces for a real role — the
              same three columns appear inside the workspace as you build each
              application.
            </p>
          </div>

          <div className="lp-demo-frame">
            <div className="lp-demo-header">
              <div>
                <span className="lp-eyebrow">Role</span>
                <h3 className="lp-demo-role">Data Analyst Intern — DBS</h3>
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
            <p className="lp-kicker">How it works</p>
            <h2 className="lp-h2">Five steps from blank page to tailored draft.</h2>
            <p className="lp-section-sub">
              A guided workspace — not a blank resume editor.
            </p>
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

      {/* ============ OUTPUTS ============ */}
      <section className="lp-section lp-outputs" id="output">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">What you receive</p>
            <h2 className="lp-h2">Six concrete outputs for one target role.</h2>
            <p className="lp-section-sub">
              Each output is structured for review. Read it, revise it, then
              copy it straight into your application.
            </p>
          </div>
          <div className="lp-outputs-grid">
            {outputs.map((o) => (
              <article className="lp-out" key={o.title}>
                <div className="lp-out-preview">
                  <OutputPreview kind={o.kind} />
                </div>
                <h3>{o.title}</h3>
                <p>{o.desc}</p>
              </article>
            ))}
          </div>
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
