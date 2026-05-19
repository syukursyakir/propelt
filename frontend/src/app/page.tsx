import Link from "next/link";

const workflowSteps = [
  {
    n: "01",
    title: "Add your resume",
    body: "Upload a PDF or DOCX, or paste the text you already have. Your projects, internships, coursework, and clubs become the source material — nothing is added that you did not write.",
  },
  {
    n: "02",
    title: "Paste the job description",
    body: "Drop in the role you are applying for. Propelt reads it the way a recruiter would — responsibilities, must-haves, nice-to-haves, and the language the employer actually uses.",
  },
  {
    n: "03",
    title: "Answer a few guided questions",
    body: "A short set of questions surfaces context that is not on the page — why you are applying, what you have done that is closest, and where you are still learning.",
  },
  {
    n: "04",
    title: "Review fit and gaps",
    body: "See where your evidence is strong, where it is lightly shown, and where it is missing — before you rewrite a single bullet.",
  },
  {
    n: "05",
    title: "Receive a tailored application",
    body: "Get a rewritten resume, a role-specific summary, keyword alignment, and a short note explaining every change Propelt made.",
  },
];

const outputs = [
  {
    title: "Candidate fit analysis",
    desc: "Where your background is strong, where it is light, and which parts of the role to organise your application around.",
  },
  {
    title: "ATS keyword alignment",
    desc: "Each requirement marked as shown, lightly shown, or missing — alongside the exact phrasing from the job description.",
  },
  {
    title: "Tailored professional summary",
    desc: "A concise opening paragraph rewritten around the role, using the language a recruiter for that position would recognise.",
  },
  {
    title: "Tailored resume",
    desc: "Your bullets reordered and rewritten to lead with the evidence the job actually values — without inventing anything new.",
  },
  {
    title: "Explanation of changes",
    desc: "Every rewritten bullet comes with a short note on what changed and why, so you can keep or revise each one with intent.",
  },
  {
    title: "Improvement suggestions",
    desc: "Specific gaps to address before applying — a project to mention, a skill to learn, or an interview answer to prepare.",
  },
];

const principles = [
  {
    title: "No invented experience",
    desc: "Propelt rewrites what you already have. It never adds employers, internships, skills, certifications, or metrics that were not in your input.",
  },
  {
    title: "Gaps are shown, not hidden",
    desc: "Missing skills and weak evidence are flagged honestly so you can decide what to address — not papered over with confident-sounding filler.",
  },
  {
    title: "You stay in control",
    desc: "Every change is explained. You decide what to keep, what to revise, and what to ignore before anything is copied into an application.",
  },
  {
    title: "Built for early-career applications",
    desc: "Calibrated for the kinds of evidence students and fresh graduates actually have: coursework, projects, internships, CCAs, and part-time work.",
  },
];

const audiences = [
  "University students",
  "Polytechnic students",
  "Fresh graduates",
  "Internship applicants",
  "Junior role applicants",
];

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

      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <p className="lp-kicker">For students, fresh graduates, and early-career applicants</p>
            <h1 className="lp-h1">
              Turn your real experience into a targeted job application.
            </h1>
            <p className="lp-lead">
              Propelt reads the job description, reads your resume, and shows you
              exactly where your evidence already fits the role — then helps you
              rewrite around it without exaggerating anything.
            </p>
            <div className="lp-cta-row">
              <Link className="lp-btn lp-btn--primary" href="/auth">
                Start your first application
              </Link>
              <a className="lp-btn lp-btn--ghost" href="#output">
                See what you get
              </a>
            </div>
            <ul className="lp-microproof" aria-label="Product principles">
              <li>Grounded in your real resume — no invented metrics or roles</li>
              <li>Every change is explained, so you stay in control</li>
              <li>Designed for early-career applications, not senior hires</li>
            </ul>
          </div>

          <div className="lp-preview" id="product" aria-label="Sample application review">
            <div className="lp-preview-toolbar">
              <span className="lp-eyebrow">Application review</span>
              <span className="lp-preview-role">Data Analyst Intern · DBS</span>
            </div>

            <div className="lp-preview-fit">
              <div>
                <span className="lp-microlabel">Fit direction</span>
                <p className="lp-preview-fittext">
                  Quantitative-leaning candidate with project evidence and light industry exposure.
                </p>
              </div>
              <div className="lp-fit-score" aria-label="Fit score 76 out of 100">
                <strong>76</strong>
                <span>/100</span>
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
                  <li><span className="lp-st lp-st--strong">Strong</span><span>DSA1101 plus SQL coursework</span></li>
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
          </div>
        </div>
      </section>

      <section className="lp-section lp-problem">
        <div className="lp-section-inner lp-problem-grid">
          <div>
            <p className="lp-kicker">The real problem</p>
            <h2 className="lp-h2">
              Most graduate applicants do not lack experience. They lack positioning.
            </h2>
          </div>
          <div className="lp-problem-body">
            <p>
              Your evidence is scattered across modules, internships, capstone
              projects, hackathons, and clubs. The job description is written in
              another language entirely — employer shorthand, role-specific
              keywords, and &ldquo;must-haves&rdquo; that are not always must-haves.
            </p>
            <p>
              The hard part is rarely writing the resume. It is figuring out
              which of the things you have actually done are the most useful
              answer to that specific role. Propelt does that thinking first,
              then helps you rewrite.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-section lp-process" id="process">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">How it works</p>
            <h2 className="lp-h2">A guided workspace, not a blank resume editor.</h2>
          </div>
          <ol className="lp-process-list">
            {workflowSteps.map((s) => (
              <li className="lp-process-item" key={s.n}>
                <span className="lp-process-n">{s.n}</span>
                <div>
                  <h3 className="lp-process-title">{s.title}</h3>
                  <p className="lp-process-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="lp-section lp-output" id="output">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">What you receive</p>
            <h2 className="lp-h2">Six concrete outputs for one target role.</h2>
            <p className="lp-section-sub">
              Each output is structured for review — read it, revise it, then
              copy it into your application.
            </p>
          </div>
          <div className="lp-output-grid">
            {outputs.map((o) => (
              <article className="lp-output-item" key={o.title}>
                <h3>{o.title}</h3>
                <p>{o.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-principles" id="principles">
        <div className="lp-section-inner">
          <div className="lp-section-heading">
            <p className="lp-kicker">Principles</p>
            <h2 className="lp-h2">Professional does not mean inflated.</h2>
            <p className="lp-section-sub">
              Propelt is built to make applications clearer, not louder. These
              are the rules behind every output it generates.
            </p>
          </div>
          <div className="lp-principles-grid">
            {principles.map((p) => (
              <article className="lp-principle" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-audience">
        <div className="lp-section-inner lp-audience-inner">
          <div>
            <p className="lp-kicker">Who it is for</p>
            <h2 className="lp-h2">Calibrated for the start of your career.</h2>
            <p className="lp-section-sub">
              Propelt is shaped around the kinds of evidence early-career
              candidates actually have. Senior hires can use other tools.
            </p>
          </div>
          <ul className="lp-audience-list" aria-label="Audiences Propelt is built for">
            {audiences.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lp-final">
        <div className="lp-final-inner">
          <div>
            <p className="lp-kicker lp-kicker--light">Get started</p>
            <h2 className="lp-h2 lp-h2--light">
              Start with one resume and one job description.
            </h2>
            <p className="lp-final-sub">
              Propelt will help you understand the role, focus your evidence,
              and leave with an application that is clearer to the recruiter —
              and to you.
            </p>
          </div>
          <Link className="lp-btn lp-btn--light" href="/auth">
            Start your first application
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
