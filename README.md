# Propelt

AI resume and graduate job application assistant for Singapore-focused early-career candidates.

## Current MVP

- Supabase login with Google and email/password
- Required onboarding with school, course, graduation year, target role, and target industry
- Resume upload parsing for PDF/DOCX plus pasted text fallback
- Saved reusable resume text profiles
- New application flow with a saved resume, pasted job description, and five candidate questions
- OpenAI-backed generation of Sections A-F:
  - Candidate fit analysis
  - ATS keyword analysis
  - Tailored professional summary
  - Tailored resume
  - Explanation of changes
  - Additional suggestions
- Saved generated applications with tabbed result view, copy buttons, and editable sections

## Stack

- npm workspaces
- TypeScript
- Next.js frontend in `frontend`
- Express backend in `backend`
- Supabase Auth/Postgres
- OpenAI API for generation
- Shared Zod schemas and inferred TypeScript types in `shared`

## Local Setup

Use Node 20 or newer.

```bash
npm install
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Create a Supabase project, enable Google auth if you want OAuth locally, and apply the migration in `supabase/migrations/0001_mvp_app.sql`.

## Run Locally

```bash
npm run dev:backend
npm run dev:frontend
```

The frontend defaults to `http://localhost:3000`. The backend defaults to `http://localhost:4000`.

## Build And Typecheck

```bash
npm run typecheck
npm run build
```

## Environment Variables

Frontend / Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BACKEND_URL=
```

Backend / Railway:

```bash
NODE_ENV=production
PORT=
FRONTEND_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
```

Supabase:

- Apply `supabase/migrations/0001_mvp_app.sql`
- Enable email/password auth
- Configure Google OAuth provider
- Add local and deployed frontend URLs to Auth redirect URLs

## Deployment Notes

Vercel frontend:

- Project root: `frontend`
- Build command: `npm run build`
- Output: managed by Next.js
- Add the frontend environment variables listed above.

Railway backend:

- Project root: repository root or `backend`, depending on the Railway service setup.
- Install command from repo root: `npm install`
- Build command from repo root: `npm run build:backend`
- Start command from repo root: `npm run start:backend`
- Add the backend environment variables listed above.

The backend verifies Supabase JWTs on protected endpoints and uses the Supabase service role key for user-owned database writes.
