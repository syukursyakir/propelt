# Propelt Build Plan — Phased

Reorganization of `plan.md` into discrete phases. Each phase is a self-contained chunk with a clear goal, exit criteria, and dependencies. Don't start a phase until the previous one is done.

---

## Phase 0 — Project Scaffold

**Goal:** Empty but runnable monorepo. Both apps boot locally.

**Tasks**
- `git init`, root `package.json` with workspaces (`frontend`, `backend`, `shared`)
- `frontend/`: Next.js 16 (App Router) + React 19 + TypeScript strict
  - Tailwind v4, `next-themes`, `clsx`, `tailwind-merge`, `cn()` helper
  - Inter font via `next/font/google`
  - Path alias `@/*` → `frontend/src/*`
- `backend/`: Express 5 + TypeScript + tsx + ESM, `dist/` build via `tsc`
- `shared/`: Zod schemas package
- Root configs: `.gitignore`, `.editorconfig`, `.nvmrc` (Node 20+)
- `.github/workflows/`: lint + build (FE), tsc (BE)

**Exit criteria**
- `npm run dev` in `frontend/` shows a "Hello Propelt" page
- `npm run dev` in `backend/` boots Express on a port and responds to `GET /health`
- CI green on a dummy PR

**Depends on:** nothing

---

## Phase 1 — Database & Auth Foundation

**Goal:** Supabase project live, schema migrated, magic-link login working end to end.

**Tasks**
- Create new Supabase project (separate from Arabify)
- Write SQL migration in `supabase/migrations/0001_init.sql`:
  - `launches`, `generated_assets`, `checklist_progress`, `purchases`
  - RLS policies on every table (`auth.uid() = user_id`)
- Backend: `lib/supabase.ts` (admin client), `middleware/requireAuth.ts`
- Frontend: Supabase SSR client, `/login` page (magic link only), session middleware
- Backend security setup: Helmet, `express-rate-limit`, CORS, Morgan, `lib/logger.ts`
- Zod helpers: `parseBody`, `parseQuery`

**Exit criteria**
- User can request a magic link, receive it, click through, and land authenticated on `/dashboard`
- `requireAuth` rejects anonymous requests with 401
- RLS verified: a second user cannot read another user's `launches` row

**Depends on:** Phase 0

---

## Phase 2 — Launch Intake

**Goal:** A user can fill out the product intake form and persist a `launches` record.

**Tasks**
- Shared Zod schema for `Launch` in `shared/schemas/launch.ts`
- Frontend: `/launches/new` page with form (product name, tagline, description, category, audience, features, founder story, launch date, URLs)
- Zustand store with persist middleware → key `propelt-draft` (don't lose typed work on refresh)
- Backend: `POST /api/launches`, `GET /api/launches`, `GET /api/launches/:id`, `PATCH /api/launches/:id`
- Frontend: `/dashboard` lists user's launches; `/launches/[id]` overview page (read-only for now)

**Exit criteria**
- Submit the form → row appears in Supabase with the user's `user_id`
- Refresh mid-form → typed data is restored from localStorage
- Dashboard shows the launch

**Depends on:** Phase 1

---

## Phase 3 — AI Generation Engine

**Goal:** All 8 asset types generate from a launch record using Claude. This is the product's core.

**Tasks**
- Backend: `lib/aiGenerator.ts` with one function per asset type:
  - `ph_tagline`, `ph_description`, `ph_first_comment`
  - `hn_post`
  - `reddit_sideproject`, `reddit_indiehackers`, `reddit_saas`
  - `x_thread`, `linkedin_post`, `email_outreach`
- Use `@anthropic-ai/sdk` with Claude Sonnet 4.5
- Endpoint: `POST /api/generate/:launchId/:assetType` → writes `generated_assets` row
- **Strict rate limit on `/api/generate/*`** (e.g., 10/hour/user) — cost protection
- Prompt-tune each asset type against 2-3 real example launches before moving on
- Frontend: trigger generation from launch overview; show loading + generated content

**Exit criteria**
- All 8 asset types produce reasonable output for a real test launch
- Rate limit returns 429 after the threshold
- Cost-per-launch measured and logged (target: ~30k tokens / launch)

**Depends on:** Phase 2

---

## Phase 4 — Asset Display, Edit, Regenerate

**Goal:** Users can view, copy, edit, and regenerate generated assets.

**Tasks**
- Frontend: `/launches/[id]/assets` page — one card per asset type
- Render with `react-markdown` + `remark-gfm`
- Edit: plain `<textarea>` writing to `edited_content` (no TipTap yet)
- Copy-to-clipboard with `react-hot-toast` "Copied!" feedback
- Regenerate button → increments `generation_count`
- Tier-based regeneration limits enforced server-side (Solo / Pro / Founder)

**Exit criteria**
- Edits persist across reloads
- Copy works on every asset card
- Regeneration limit returns a clear error when exceeded

**Depends on:** Phase 3

---

## Phase 5 — Checklist & Reminder Emails

**Goal:** Pre-launch checklist with date-triggered email reminders.

**Tasks**
- Define sacred task keys: `t-{day}_{action}` (e.g., `t-7_notify_hunters`, `t-1_final_review`, `t-0_post_at_midnight`)
- Frontend: `/launches/[id]/checklist` page with completion toggles
- Local cache key `propelt-checklist-{launchId}`; source of truth is `checklist_progress` table
- Backend: `crons/checklistReminders.ts` using `node-cron`
  - Daily job: find launches whose `launch_date - N` matches today, send reminder per task key
- `lib/emailService.ts` — Resend wrapper with templates per reminder type

**Exit criteria**
- Toggling a task marks it complete in DB
- A test launch with `launch_date = today + 7` triggers the T-7 email when the cron runs
- Emails render correctly in Gmail + Apple Mail

**Depends on:** Phase 2 (needs `launches`); independent of Phase 3/4

---

## Phase 6 — Payments (Lemon Squeezy)

**Goal:** Users pay, get marked paid, and access gated features.

**Tasks**
- Lemon Squeezy account + 3 product variants (Solo / Pro / Founder)
- Frontend: `/pricing` page, checkout link per tier
- Backend: `POST /api/webhooks/lemonsqueezy` — verify signature, upsert `purchases`, set `launches.paid_at` and `launches.tier`
- `middleware/requirePaid.ts` — gate `/api/generate/*` behind a paid launch
- Audit trail: every webhook event logged

**Exit criteria**
- Test purchase flows through checkout → webhook → DB → unlocks generation
- Unpaid launch hitting `/api/generate/*` returns 402
- Webhook signature verification rejects forged requests

**Depends on:** Phase 3 (gating the generate endpoint)

---

## Phase 7 — Landing Page & Polish

**Goal:** Marketing site that converts. Plan flags this as the highest-leverage day.

**Tasks**
- `/` landing page: hero, problem statement, asset gallery (real outputs), pricing teaser, FAQ, CTA
- Spend a full day on **copy** — the asset list and value prop are the hook
- SEO: title/description per page, OpenGraph images, sitemap, robots.txt
- Vercel Analytics + PostHog wired up; track funnel: visit → signup → pay → generate
- 404 page, error boundaries, loading states across the app

**Exit criteria**
- Lighthouse > 90 on landing
- Funnel events visible in PostHog
- Real visitors can complete signup → pay → generate without hitting a broken state

**Depends on:** Phases 1-6 (need the product working to demo it)

---

## Phase 8 — Beta & Launch

**Goal:** Ship it.

**Tasks**
- Recruit 5-10 beta founders from IndieHackers / X
- Watch them use it; fix breaks; iterate copy
- **Dogfood:** use Propelt to generate Propelt's own launch assets — screenshot the moment
- Launch day: post on Product Hunt + HN + Reddit + X using your own outputs
- Monitor: Anthropic spend, error rates, signup-to-pay conversion

**Exit criteria**
- Live on PH / HN / Reddit / X
- First paying customer
- No P0 bugs in the 48h after launch

**Depends on:** Phase 7

---

## Cross-cutting (do throughout, not a phase)

- **Sacred IDs** — never rename once shipped:
  - asset type keys (`ph_tagline`, `hn_post`, …)
  - checklist task keys (`t-7_notify_hunters`, …)
  - persistence keys (`propelt-draft`, `propelt-checklist-{launchId}`)
- **RLS on every new table** — no exceptions
- **Rate-limit any new endpoint that calls Claude** before merging it
- **Zod schemas in `shared/`** — import on both sides; no duplicated types

---

## Phase dependency graph

```
0 ─► 1 ─► 2 ─► 3 ─► 4 ─► 7 ─► 8
              │    │
              │    └──► 6 ──┘
              └──► 5 ──────► 7
```

Phase 5 (checklist) and Phase 6 (payments) can run in parallel after Phase 3.
