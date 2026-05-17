# Propelt Handoff

Propelt has pivoted.

Old product: AI launch toolkit for indie founders.

New product: Singapore-focused AI job-search copilot.

## Current Product Direction

Users sign in, upload or paste one resume, set a target job, answer AI-led coaching questions, then generate improved resume materials and job-specific application documents.

Primary target users:

- Singapore students
- Fresh graduates
- Early-career job seekers
- Career switchers later

MVP promise:

Upload resume -> AI finds gaps -> AI asks questions -> AI rewrites resume -> export.

## Keep

- npm workspace monorepo
- Next.js frontend
- Express backend
- Supabase Auth/Postgres
- Shared Zod schema package
- TypeScript
- CI/typecheck setup
- Email OTP auth flow

## Replace

- Launch-toolkit data model
- Product Hunt/HN/Reddit/X launch asset concepts
- Launch checklist concepts
- Founder launch copy

## New Core Tables

- `profiles`
- `resumes`
- `job_targets`
- `resume_questions`
- `resume_answers`
- `generated_documents`
- `document_exports`

Later:

- `applications`
- billing tables

## Important Product Rules

- One active resume per user for MVP
- Support paste, PDF, and DOCX resume input
- AI chat asks one question at a time
- Questions can be skipped
- Users can delete resume data
- Do not log resume contents or job descriptions
- Track analytics events, not sensitive content
- Avoid fake ATS percentage scores; use "Job Match Review"

## Stack

- Frontend: Next.js 16, React 19, Tailwind v4
- Backend: Express 5, Node 20+, TypeScript ESM
- DB/Auth: Supabase
- Validation: Zod
- AI: Anthropic SDK
- Hosting: Vercel frontend, Railway backend later
- Email: Brevo later
- Payments: Lemon Squeezy later

## Next Work

Follow `phases.md`.

Start with Phase 0 if not complete:

- update schemas
- update migration
- update landing/dashboard copy
- ensure typecheck passes

Then Phase 1:

- resume paste/upload
- resume parsing
- resume delete
- RLS verification
