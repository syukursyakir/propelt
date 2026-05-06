Solid stack — clean and modern. Let's adapt the Propelt build plan to match exactly what you already know. This way you're not learning anything new, just shipping.

## Propelt Tech Stack (mirroring Arabify)

### Frontend (`frontend/`)

| Layer | Tech | Notes for Propelt |
|-------|------|-------------------|
| Framework | Next.js 16 (App Router), React 19 | Same as Arabify |
| Language | TypeScript (strict) | Same |
| Styling | Tailwind CSS v4 + custom CSS tokens | New palette — see below |
| Fonts | Inter (Latin) via `next/font/google` | Drop Tajawal/Noto Arabic — not needed here |
| State | Zustand 5 (persist middleware) | Persist draft form data + checklist progress |
| Animations | Framer Motion 12 | Same |
| Auth | Supabase SSR (`@supabase/ssr`) | Same |
| Icons | Lucide-react (only) | Skip the custom SVG set, ship faster |
| Validation | Zod (shared with backend) | Same |
| Class merging | `clsx` + `tailwind-merge` via `cn()` | Same |
| Theming | `next-themes` (light/dark) | Same |
| Tests | Vitest 4 + JSDOM | Skip until post-launch |
| Analytics | Vercel Analytics + PostHog | Same — track funnel: visit → signup → pay → generate |

**New Propelt-specific frontend additions:**
- **`react-markdown`** + **`remark-gfm`** — for rendering generated launch copy with formatting
- **`react-hot-toast`** — for "Copied!" feedback (people will copy a *lot*)
- **No editor library yet** — use plain `<textarea>` for asset editing in MVP. Add TipTap only if users complain.

### Backend (`backend/`)

| Layer | Tech | Notes for Propelt |
|-------|------|-------------------|
| Runtime | Node 20+ (ESM) | Same |
| Framework | Express 5 + TypeScript | Same |
| Dev runner | tsx | Same |
| Auth | Supabase admin SDK + `requireAuth` middleware | Same — copy this directly from Arabify |
| Validation | Zod via `parseBody`/`parseQuery` | Same |
| AI | **Anthropic SDK (`@anthropic-ai/sdk`)** | NEW — Claude Sonnet 4.5 for asset generation |
| Email | **Resend** (instead of Brevo) | Switch — simpler API, free tier covers MVP. Or keep Brevo if you have it set up |
| Payments | **Lemon Squeezy SDK** | NEW — handles tax globally, easier for SG founders than Stripe |
| Security | Helmet + express-rate-limit + cors | Same — *critical* on the AI generation endpoint (cost protection) |
| Logging | Morgan + structured `lib/logger.ts` | Same |
| Cron | node-cron (in-process) | NEW use case: send checklist reminder emails (T-7, T-3, T-1, etc.) |
| Build | `tsc` to `dist/` | Same |

**New Propelt-specific backend additions:**
- **Rate limiting on `/api/generate/*`** — strict (e.g., 10 generations per user per hour) to control Claude API costs
- **A `lib/aiGenerator.ts` module** — wraps Claude prompts for each asset type (PH copy, HN post, Reddit posts, X thread, LinkedIn, email)
- **Webhook endpoint** for Lemon Squeezy — `POST /api/webhooks/lemonsqueezy` to mark users as paid

### Database / Infra

| Layer | Tech | Notes for Propelt |
|-------|------|-------------------|
| Database | Supabase Postgres | Same |
| Auth provider | Supabase Auth (email magic link) | Use magic link only — skip password to reduce friction |
| Schema | SQL migrations in `supabase/migrations/` | New schema — see below |
| RLS | Enabled on every table; `auth.uid() = user_id` | Same pattern |

**Propelt schema (V1):**

```sql
-- users handled by Supabase Auth

-- A "launch project" — one product the user is launching
create table launches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  product_name text not null,
  tagline text,
  description text,
  category text,
  target_audience text,
  features jsonb,
  founder_story text,
  launch_date date,
  website_url text,
  demo_url text,
  tier text not null default 'solo', -- 'solo' | 'pro' | 'founder'
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Generated assets per launch
create table generated_assets (
  id uuid primary key default gen_random_uuid(),
  launch_id uuid references launches on delete cascade not null,
  asset_type text not null, -- 'ph_tagline', 'ph_description', 'ph_first_comment', 'hn_post', 'reddit_sideproject', 'reddit_indiehackers', 'reddit_saas', 'x_thread', 'linkedin_post', 'email_outreach'
  content text not null,
  edited_content text, -- user's edits
  generation_count int default 1, -- for regeneration limits per tier
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Checklist completion state
create table checklist_progress (
  id uuid primary key default gen_random_uuid(),
  launch_id uuid references launches on delete cascade not null,
  task_key text not null, -- e.g., 't-7_notify_hunters'
  completed_at timestamptz,
  unique (launch_id, task_key)
);

-- Lemon Squeezy purchase records (audit trail)
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  launch_id uuid references launches,
  ls_order_id text unique not null,
  tier text not null,
  amount_cents int not null,
  created_at timestamptz default now()
);

-- RLS policies (apply auth.uid() = user_id pattern to all)
```

**Hot tables:** `launches`, `generated_assets`, `checklist_progress`, `purchases`

### Hosting / Deploy

| Layer | Where |
|-------|-------|
| Frontend | Vercel (auto-deploy from `main` + PR previews) |
| Backend | Railway |
| Database + Auth | Supabase project (new one — don't share with Arabify) |
| Domain | propelt.com → Vercel |
| CI | GitHub Actions (Frontend: lint + build; Backend: tsc) |

### Tooling / Conventions (mirror your Arabify habits)

- **Path aliases:** `@/*` → `frontend/src/*`
- **Persistence keys (sacred):**
  - `propelt-draft` — unsaved form data so users don't lose work
  - `propelt-checklist-{launchId}` — local checklist state cache
- **Asset type IDs (sacred):** see schema above — `ph_tagline`, `hn_post`, etc. Don't rename them once shipped (will break old records)
- **Checklist task keys (sacred):** `t-{day}_{action}` pattern, e.g., `t-7_notify_hunters`, `t-1_final_review`, `t-0_post_at_midnight`

### What's NOT in the Propelt stack (deliberately)

- No mobile build — web-only, founders launch from laptops
- No GraphQL — REST + Supabase client only
- No CDN beyond Vercel
- No background job queue — cron in-process is enough for reminder emails
- No feature flags
- No paid analytics beyond PostHog
- **No internationalization** — English only for MVP, indie hacker market is English-first
- **No team accounts** — solo founders only, save multi-user for v2
- **No Google/Twitter login** — magic link email only
- **No custom rich text editor** — `<textarea>` ships in 1 day, TipTap takes a week
- **No image upload/hosting** — users link to their own assets in MVP

---

## Project structure

Mirror Arabify's monorepo:

```
propelt/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── page.tsx            # Landing
│   │   │   ├── pricing/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx  # User's launches
│   │   │   ├── launches/
│   │   │   │   ├── new/page.tsx    # Intake form
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # Launch overview
│   │   │   │       ├── assets/page.tsx
│   │   │   │       └── checklist/page.tsx
│   │   │   └── api/
│   │   ├── components/
│   │   │   ├── ui/                 # Buttons, inputs, etc.
│   │   │   ├── forms/
│   │   │   ├── assets/             # Asset cards, editors
│   │   │   └── checklist/
│   │   ├── lib/
│   │   │   ├── supabase/           # Client, server, middleware
│   │   │   ├── api.ts              # Backend client
│   │   │   └── cn.ts
│   │   ├── stores/                 # Zustand stores
│   │   └── types/
│   └── ...
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── launches.ts
│   │   │   ├── assets.ts
│   │   │   ├── generate.ts         # AI generation endpoints
│   │   │   ├── checklist.ts
│   │   │   └── webhooks.ts         # Lemon Squeezy webhook
│   │   ├── lib/
│   │   │   ├── aiGenerator.ts      # Claude prompts per asset type
│   │   │   ├── emailService.ts     # Resend wrapper
│   │   │   ├── lemonsqueezy.ts
│   │   │   ├── logger.ts
│   │   │   └── supabase.ts
│   │   ├── middleware/
│   │   │   ├── requireAuth.ts
│   │   │   └── requirePaid.ts      # NEW — gate generation behind payment
│   │   ├── crons/
│   │   │   └── checklistReminders.ts
│   │   └── index.ts
│   └── ...
├── shared/
│   └── schemas/                    # Zod schemas shared between FE/BE
└── supabase/
    └── migrations/
```

---

## Updated 3-Week Build Plan (matched to your stack)

**Week 1 — Foundation**
- **Day 1:** Init monorepo, copy Arabify's auth/RLS patterns, set up Supabase project, deploy skeletons to propelt.com (FE) and Railway (BE)
- **Day 2:** Run schema migrations, set up `requireAuth` middleware, magic link login flow
- **Day 3-4:** Build product intake form (Zustand-backed, persisted to localStorage as `propelt-draft`), Zod validation, save to `launches` table
- **Day 5-7:** Build `aiGenerator.ts` with Claude Sonnet 4.5 — one function per asset type, all returning structured outputs. Wire up `/api/generate/:launchId/:assetType` endpoint with rate limiting.

**Week 2 — Core Product**
- **Day 8-9:** Asset display + edit UI (textarea-based, copy-to-clipboard with toast)
- **Day 10:** Regeneration flow with tier-based limits enforced in middleware
- **Day 11-12:** Checklist UI with task keys + completion tracking, node-cron job for reminder emails via Resend
- **Day 13-14:** Lemon Squeezy integration — pricing page, checkout, webhook to mark `paid_at` on launches, paywall middleware

**Week 3 — Launch**
- **Day 15:** Landing page (this is your highest-leverage work — spend a full day on copy)
- **Day 16-17:** Beta with 5-10 founders from IndieHackers/X
- **Day 18-19:** Polish, fix breaks, write SEO content
- **Day 20:** Use Propelt to generate Propelt's own launch assets (eat dog food, screenshot the moment)
- **Day 21:** Launch on Product Hunt + HN + Reddit + X using your own tool

---

## Things to copy directly from Arabify

To save time, lift these patterns *as-is*:

1. **`requireAuth` middleware** — exact same implementation
2. **`parseBody`/`parseQuery` Zod helpers** — copy verbatim
3. **`lib/logger.ts`** — copy
4. **Helmet + rate limit + cors setup** in `index.ts` — copy
5. **Supabase SSR client setup** in frontend — copy
6. **CI workflows** — copy `.github/workflows/` and adapt names
7. **`cn()` helper** — copy
8. **Zustand persist pattern** — copy

This is probably 30-40% of your code already written, just from copying conventions.

---

## Things you'll build *new* for Propelt

1. **`lib/aiGenerator.ts`** — the heart of the product. 6-8 carefully-tuned Claude prompts.
2. **Lemon Squeezy webhook handler** — first time you've used LS based on Arabify stack
3. **Checklist reminder cron** — different shape than Arabify's crons (date-triggered vs interval-triggered)
4. **Asset regeneration tier logic** — track `generation_count` and enforce limits

---

## Cost estimate (monthly, after launch)

| Service | Free tier covers? | Cost if you exceed |
|---------|-------------------|--------------------|
| Vercel | Yes for MVP | $20/mo Pro |
| Railway | $5 free credit | ~$5-15/mo for backend |
| Supabase | Yes (500MB DB, 2GB bandwidth) | $25/mo Pro |
| Anthropic API | Pay-as-you-go | ~$50-200/mo at 100 customers/mo (each launch = ~30k tokens generated) |
| Resend | 3k emails/mo free | $20/mo for 50k |
| Lemon Squeezy | Free, takes 5% + $0.50/sale | Same |
| PostHog | 1M events/mo free | Free likely forever at MVP scale |
| Domain | $5 already paid | $12/yr renewal |

**Total at MVP launch:** $0-30/mo
**Total at 100 customers/mo:** ~$80-150/mo
**Revenue at 100 customers/mo:** ~$3,000-5,900

Margins are healthy.

---

Ready to start? If yes, I'd suggest the first concrete task is:

1. **Spin up the Supabase project** + run the migration above
2. **Create the monorepo structure** by copying Arabify's skeleton

Want me to write the actual Claude prompts for the 8 asset types next? That's the hardest creative part of this whole thing and the place where Propelt's quality will live or die. Or want me to draft the landing page copy first?