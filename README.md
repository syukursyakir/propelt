# Propelt

Clean deployable skeleton for the Propelt monorepo.

## Stack

- npm workspaces
- TypeScript
- Next.js frontend in `frontend`
- Express backend in `backend`
- Supabase client placeholders for auth/database
- Shared Zod schemas and inferred TypeScript types in `shared`

## Local Setup

Use Node 20 or newer.

```bash
npm install
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Fill in Supabase values when you have a Supabase project. The app can start without them, but Supabase clients will remain unconfigured.

## Run Locally

```bash
npm run dev:frontend
npm run dev:backend
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
```

Supabase is managed separately through the Supabase dashboard and project environment values. This repository does not include database migrations.

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

When deploying the backend from `backend` as the service root, make sure Railway still installs npm workspaces from the repository root so `@propelt/shared` is available.
