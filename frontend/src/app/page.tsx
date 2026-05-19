import Link from "next/link";

const proofPoints = [
  "Built for students, fresh graduates, and early-career applicants",
  "Keeps claims grounded in your actual resume and answers",
  "Shows the reasoning behind every tailored output",
];

const workflow = [
  {
    step: "01",
    title: "Bring your real experience",
    body: "Upload a resume or paste your current version. Propelt keeps your projects, internships, coursework, and achievements as the source of truth.",
  },
  {
    step: "02",
    title: "Add the role you want",
    body: "Paste the job description and answer five focused questions so the application has context beyond keywords.",
  },
  {
    step: "03",
    title: "Leave with a clearer application",
    body: "Get a fit analysis, keyword alignment, tailored summary, rewritten resume, change rationale, and next-step suggestions.",
  },
];

export default function Home() {
  return (
    <main className="marketing-page">
      <nav className="marketing-nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          Propelt
        </Link>
        <div className="nav-links">
          <a href="#process">Process</a>
          <a href="#output">Output</a>
          <a href="#principles">Principles</a>
        </div>
        <Link className="button compact secondary" href="/auth">
          Log in
        </Link>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="kicker">Graduate job applications, made clearer</p>
          <h1>Apply with a resume that knows what the role is asking for.</h1>
          <p className="hero-subtitle">
            Propelt helps students and fresh graduates connect their real
            experience to a target job, then turns that thinking into a
            recruiter-ready application.
          </p>
          <div className="actions">
            <Link className="button" href="/auth">
              Start your first application
            </Link>
            <a className="button secondary" href="#output">
              See what you get
            </a>
          </div>
          <div className="proof-strip" aria-label="Product principles">
            {proofPoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
        </div>

        <div className="product-preview" aria-label="Propelt product preview">
          <div className="preview-toolbar">
            <span>Application Review</span>
            <strong>Data Analyst Intern</strong>
          </div>
          <div className="fit-panel">
            <div>
              <span className="small-label">Fit direction</span>
              <strong>Analytical student with project evidence</strong>
            </div>
            <div className="score-ring" aria-label="Fit score 76 out of 100">
              76
            </div>
          </div>
          <div className="preview-grid">
            <div className="preview-block">
              <span className="small-label">Role signals</span>
              <ul>
                <li>SQL and dashboard reporting</li>
                <li>Stakeholder communication</li>
                <li>Business problem framing</li>
              </ul>
            </div>
            <div className="preview-block">
              <span className="small-label">Resume focus</span>
              <ul>
                <li>Lead with analytics coursework</li>
                <li>Move project impact higher</li>
                <li>Cut unrelated filler</li>
              </ul>
            </div>
          </div>
          <div className="resume-preview">
            <span className="small-label">Tailored bullet</span>
            <p>
              Analyzed student engagement data using Python and spreadsheet
              models, translating findings into a concise dashboard and
              presentation for non-technical reviewers.
            </p>
          </div>
        </div>
      </section>

      <section className="section-band intro-band">
        <div className="section-inner two-column">
          <div>
            <p className="kicker">The real problem</p>
            <h2>Most early-career applicants do not lack experience. They lack positioning.</h2>
          </div>
          <p>
            A job description can make a normal project, internship, or CCA
            responsibility suddenly relevant. Propelt helps users understand
            that connection before rewriting anything, so the final application
            is sharper without becoming exaggerated.
          </p>
        </div>
      </section>

      <section className="section-inner process-section" id="process">
        <div className="section-heading">
          <p className="kicker">How it works</p>
          <h2>A guided workspace, not a blank resume editor.</h2>
        </div>
        <div className="process-list">
          {workflow.map((item) => (
            <article className="process-item" key={item.step}>
              <span>{item.step}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band output-band" id="output">
        <div className="section-inner output-layout">
          <div className="section-heading">
            <p className="kicker">What users receive</p>
            <h2>Six practical outputs for one target role.</h2>
            <p>
              The result is built for review, editing, and copying into the
              user’s application workflow.
            </p>
          </div>
          <div className="output-list">
            <div>
              <strong>Candidate fit analysis</strong>
              <span>Where the candidate is strong, weak, and how to focus.</span>
            </div>
            <div>
              <strong>ATS keyword alignment</strong>
              <span>What is already shown, lightly shown, or missing.</span>
            </div>
            <div>
              <strong>Tailored professional summary</strong>
              <span>A concise opening aligned to the role.</span>
            </div>
            <div>
              <strong>Tailored resume</strong>
              <span>Reordered and rewritten around the job description.</span>
            </div>
            <div>
              <strong>Explanation of changes</strong>
              <span>Why certain skills, projects, and bullets were emphasized.</span>
            </div>
            <div>
              <strong>Improvement suggestions</strong>
              <span>Specific gaps to fix before applying.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-inner principles-section" id="principles">
        <div className="principle-card">
          <p className="kicker">Product principles</p>
          <h2>Professional does not mean inflated.</h2>
          <p>
            Propelt is designed to make applications clearer, not louder. It
            preserves truth, avoids fake metrics, and helps users explain the
            value of what they have actually done.
          </p>
        </div>
        <div className="principle-list">
          <div>
            <strong>No invented experience</strong>
            <span>Missing skills are shown as gaps, not quietly added.</span>
          </div>
          <div>
            <strong>Singapore early-career focus</strong>
            <span>Built around students, fresh graduates, internships, and junior roles.</span>
          </div>
          <div>
            <strong>Readable by recruiters</strong>
            <span>Concise bullets, clear structure, and role-specific language.</span>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div>
          <h2>Start with one resume and one job description.</h2>
          <p>
            Propelt will help you understand the role, focus your experience,
            and leave with a more targeted application.
          </p>
        </div>
        <Link className="button" href="/auth">
          Build my application
        </Link>
      </section>
    </main>
  );
}
