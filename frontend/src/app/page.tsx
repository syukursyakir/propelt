import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <nav className="nav">
        <div className="brand">Propelt</div>
        <div className="actions">
          <Link className="button secondary" href="/auth">
            Log in
          </Link>
        </div>
      </nav>
      <section className="hero">
        <div className="stack">
          <h1>Turn a real resume into a sharper job application.</h1>
          <p>
            Propelt helps students, fresh graduates, and early-career candidates
            tailor their resume to a target role while keeping every claim
            truthful and recruiter-ready.
          </p>
          <div className="actions">
            <Link className="button" href="/auth">
              Start tailoring
            </Link>
            <Link className="button secondary" href="/auth">
              I already have an account
            </Link>
          </div>
        </div>
        <aside className="hero-card stack" aria-label="What Propelt generates">
          <strong>Every generation includes</strong>
          <ul className="list">
            <li>Candidate fit analysis</li>
            <li>ATS keyword alignment</li>
            <li>Tailored professional summary</li>
            <li>Truthful rewritten resume</li>
            <li>Reasoning behind the changes</li>
            <li>Practical improvement suggestions</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
