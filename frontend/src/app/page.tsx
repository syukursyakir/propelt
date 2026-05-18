import { ArrowRight, CheckCircle2, FileText, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    title: "Upload your current resume",
    body: "Paste text or upload a PDF/DOCX. Propelt reads the draft you already have.",
    icon: FileText,
  },
  {
    title: "Answer sharper questions",
    body: "The copilot asks what recruiters need to know: impact, metrics, tools, projects, and role fit.",
    icon: MessageSquareText,
  },
  {
    title: "Leave with stronger materials",
    body: "Get improved bullets, a cleaner resume draft, and later job-specific cover letters.",
    icon: Sparkles,
  },
];

const outcomes = [
  "Resume diagnosis without fake ATS scores",
  "Singapore-aware guidance for students and fresh grads",
  "Job description matching when you have a role in mind",
  "Easy delete controls for sensitive resume data",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#151713]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Propelt
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[#4d5547] md:flex">
          <a href="#how-it-works" className="hover:text-[#151713]">
            How it works
          </a>
          <a href="#privacy" className="hover:text-[#151713]">
            Privacy
          </a>
          <a href="#mvp" className="hover:text-[#151713]">
            Roadmap
          </a>
        </nav>
        <Link
          href="/login"
          className="rounded-md bg-[#151713] px-4 py-2 text-sm font-medium text-white hover:bg-[#2b3028]"
        >
          Sign in
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex rounded-full border border-[#d7ded1] bg-white px-3 py-1 text-sm font-medium text-[#52624a]">
            AI job-search copilot for Singapore
          </p>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Turn your resume into a sharper application plan.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#4d5547]">
            Propelt reviews your resume, asks practical follow-up questions, and helps students and fresh grads write stronger job materials.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#151713] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2b3028]"
            >
              Start with your resume
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-md border border-[#cfd8c8] bg-white px-5 py-3 text-sm font-semibold text-[#151713] hover:border-[#aebba4]"
            >
              See how it works
            </a>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-4 text-sm text-[#4d5547]">
            <div>
              <strong className="block text-2xl font-semibold text-[#151713]">PDF/DOCX</strong>
              Upload or paste
            </div>
            <div>
              <strong className="block text-2xl font-semibold text-[#151713]">1 by 1</strong>
              AI coaching questions
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-5 top-8 hidden rounded-md border border-[#d9e3d2] bg-white px-4 py-3 shadow-sm lg:block">
            <p className="text-xs font-medium uppercase text-[#74806d]">Next question</p>
            <p className="mt-1 max-w-48 text-sm font-medium">
              What result did this project create?
            </p>
          </div>
          <div className="overflow-hidden rounded-[8px] border border-[#d9e3d2] bg-white shadow-[0_24px_80px_rgba(31,37,27,0.14)]">
            <Image
              src="/images/landing-hero.png"
              alt="Laptop showing an AI resume review interface"
              width={1536}
              height={864}
              priority
              className="aspect-[16/10] h-auto w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 right-5 rounded-md bg-[#f07f4f] px-4 py-3 text-sm font-semibold text-white shadow-lg">
            Resume draft ready
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-[#dde3d8] bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#52624a]">How it works</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">A resume coach that gets specific.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.title} className="rounded-md border border-[#dde3d8] bg-[#fbfaf7] p-6">
                <step.icon className="size-6 text-[#e76737]" />
                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4d5547]">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="privacy" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="text-sm font-semibold text-[#52624a]">Built for sensitive data</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Your resume is not marketing data.</h2>
        </div>
        <div className="grid gap-3">
          {outcomes.map((outcome) => (
            <div key={outcome} className="flex items-start gap-3 rounded-md bg-white p-4 shadow-sm">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#4f7d3a]" />
              <p className="text-sm leading-6 text-[#3f473b]">{outcome}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="mvp" className="bg-[#151713] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <ShieldCheck className="size-8 text-[#f07f4f]" />
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight">
              Start with your resume. Add job targeting next.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
              The first version focuses on resume intake, AI follow-up questions, and stronger drafts. Job-specific tailoring, cover letters, and export come after the core flow feels right.
            </p>
          </div>
          <div className="rounded-md border border-white/15 p-6">
            <p className="text-sm font-semibold text-white/60">MVP flow</p>
            <ol className="mt-5 space-y-4 text-sm">
              <li>1. Upload or paste your resume</li>
              <li>2. Tell Propelt the role you want</li>
              <li>3. Answer or skip AI coaching questions</li>
              <li>4. Generate a better resume draft</li>
            </ol>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#151713]"
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
