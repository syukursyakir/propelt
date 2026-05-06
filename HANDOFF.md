# Propelt — Agent Handoff

You are taking over this project from the previous Claude Code session on a different machine. Read this fully before doing anything. **Then immediately invoke the `grill-me` skill** (see "Skills" below) — the user has explicitly asked you to grill them on the next phase before you start coding.

---

## What this is

**Propelt** — an AI-powered launch toolkit for indie founders. User fills out a product intake form, Claude generates all their launch assets (Product Hunt copy, HN post, Reddit posts, X thread, LinkedIn post, email outreach, etc.), they get a date-triggered checklist with reminder emails, and Lemon Squeezy handles payments.

Read `plan.md` for the full product spec and `phases.md` for the phase-by-phase plan.

---

## Current status (as of handoff)

### Done
- **Phase 0** — monorepo scaffolded, both apps boot, CI green.
- **Phase 1** — 95% complete:
  - Code: shipped. Frontend on Vercel @ https://www.propelt.com, backend not yet deployed.
  - DB schema: written at `supabase/migrations/0001_init.sql` but **NOT YET APPLIED** (user has not run the SQL in the Supabase editor — confirm with them before assuming the tables exist).
  - Supabase: project ref `nwcyywltiuxkhcaiftnn`. Auth URLs configured for both localhost and prod. OTP length set to 6 (was 8 by default).
  - Login flow: switched from magic link to **6-digit OTP code** because Gmail's link prefetcher consumes single-use tokens. Two-step UI: enter email → enter code → verify.
  - End-to-end auth test on prod: **NOT YET COMPLETED** — was blocked by Supabase's built-in SMTP rate limit. User wants to wire up custom SMTP (Brevo) before retrying.

### In progress (your first task)
- **Wire up Brevo SMTP in Supabase** so auth emails stop hitting the testing-tier rate limit. The plan originally said Resend; user prefers Brevo (already has an account). Adapt accordingly.
- After Brevo: have user re-test the OTP login flow end-to-end on https://www.propelt.com. Once they reach `/dashboard` and see their email, Phase 1 is officially done.
- Then have them run `supabase/migrations/0001_init.sql` in the SQL editor before Phase 2.

### Up next
- **Phase 2** — Launch intake form. Don't start until Phase 1 is signed off.
- After Phase 2: backend on Railway (per plan).

---

## Brevo SMTP — exact steps for the user

When the user is ready, walk them through:

1. https://app.brevo.com → **SMTP & API** → **SMTP** tab → copy login email + generate an SMTP key.
2. Verify the sender domain (`propelt.com`) under **Senders & IP** → **Domains** if not already done. Otherwise sender emails will get rejected.
3. In Supabase: https://supabase.com/dashboard/project/nwcyywltiuxkhcaiftnn/settings/auth → **SMTP Settings** → **Enable Custom SMTP** → fill in:
   - Host: `smtp-relay.brevo.com`
   - Port: `587`
   - Username: their Brevo SMTP login (the email shown in the SMTP tab)
   - Password: the SMTP key
   - Sender email: e.g. `noreply@propelt.com`
   - Sender name: `Propelt`
   - Minimum interval: leave default
4. Save → test by requesting a fresh OTP at https://www.propelt.com/login.

---

## Skills you should use

The `grill-me` skill is critical. The user explicitly asked: **"Tell the agent about the GRILL ME skill as well and ask it to implement that."** Translation: before you commit to ANY non-trivial design or kick off a phase, invoke `grill-me` to interview the user and stress-test the plan. Don't just go execute.

When to use it:
- Before starting Phase 2 (intake form structure / fields / validation)
- Before starting Phase 3 (the Claude prompt design — this is "the heart of the product" per the plan, do not skip grilling)
- Before any architectural decision (paywall placement, regeneration limit logic, checklist task graph)

Other skills available: `simplify`, `init`, `review`, `security-review`, `claude-api`, `update-config`, `keybindings-help`, `loop`, `schedule`, `fewer-permission-prompts`. Use `claude-api` when working on the AI generation code in Phase 3 (it knows about prompt caching, model selection, etc.).

---

## Stack & infra

| Layer | Where / what |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind v4 — `frontend/` |
| Backend | Express 5 + TS + tsx — `backend/` (not yet deployed) |
| Shared | Zod schemas — `shared/` (workspace import: `@propelt/shared`) |
| DB / Auth | Supabase project `nwcyywltiuxkhcaiftnn` |
| Frontend host | Vercel @ https://www.propelt.com (root dir set to `frontend`, install command `cd .. && npm install` because of npm workspaces) |
| Backend host | Railway (planned, not yet set up) |
| Repo | https://github.com/syukursyakir/propelt — auto-deploys to Vercel on push to `main` |
| Email | Brevo (planned, replacing the plan's "Resend" choice) |
| Payments | Lemon Squeezy (planned, Phase 6) |
| AI | Anthropic SDK with Claude Sonnet 4.5 (planned, Phase 3) |

---

## Critical files

- `plan.md` — original full product/tech spec from the user's prior AI consultation
- `phases.md` — phase-by-phase build plan (you are between Phase 1 and Phase 2)
- `supabase/migrations/0001_init.sql` — DB schema. **User has not run this yet.**
- `shared/src/schemas/asset.ts` — sacred asset type IDs (do not rename)
- `shared/src/schemas/checklist.ts` — sacred task key pattern (do not rename)
- `frontend/src/app/login/page.tsx` — OTP flow, two-step
- `frontend/src/lib/supabase/{client,server,middleware}.ts` — SSR auth glue
- `frontend/src/middleware.ts` — session refresh on every request, fails open if env missing
- `backend/src/middleware/requireAuth.ts` — Bearer JWT verification via supabaseAdmin
- `backend/src/routes/me.ts` — sanity endpoint for Phase 1
- `vercel-env.md` (gitignored) — copy-paste-able env values for Vercel

---

## Sacred IDs (never rename, schema constraints depend on them)

**Asset types** (in `shared/src/schemas/asset.ts` and `0001_init.sql` CHECK constraint):
`ph_tagline`, `ph_description`, `ph_first_comment`, `hn_post`, `reddit_sideproject`, `reddit_indiehackers`, `reddit_saas`, `x_thread`, `linkedin_post`, `email_outreach`

**Checklist task key pattern**: `t-{day}_{snake_action}` (e.g., `t-7_notify_hunters`, `t-0_post_at_midnight`).

**Persistence keys** (Zustand localStorage):
- `propelt-draft` — unsaved intake form data
- `propelt-checklist-{launchId}` — local checklist cache

---

## User preferences and quirks

- **Terminal**: Uses **WSL bash** by default (`syukur@syukur:/mnt/c/...`). For Windows-side ops they'll open PowerShell. They explicitly told me "I usually use wsl bro."
- **Auth**: `gh` CLI is installed and authenticated in WSL as `syukursyakir`. You can use it directly for git auth, repo ops, viewing CI runs, etc.
- **Tone**: Terse. Doesn't want narration of internal deliberation. Casual ("liao", "la"). Will push back if you're verbose.
- **Decision style**: Likes to be grilled before committing — see `grill-me` instructions above.
- **Payment style**: Pasted Supabase service role key in chat (it's now in conversation history). Should rotate that key after Phase 1 wraps. Mention this if you commit anything that touches Supabase admin.

---

## Quirks of the environment (will trip you up if you don't know)

1. **Project lives in OneDrive** (`C:\Users\ibeli\OneDrive\Desktop\Personal Projects\propelt`). OneDrive sometimes interferes with `npm install` mid-flight. The user couldn't move it earlier because VS Code + this Claude session held file handles. Symptoms to watch for: missing transitive deps after install. Fix: pause OneDrive sync, or move the project (close VS Code first).
2. **`/mnt/c` is slow on WSL** — `npm install` via WSL bash takes 5-10x longer than via Windows PowerShell. Have them run installs from PowerShell when possible.
3. **Windows binaries**: After PowerShell install, Node binaries are Windows. Run dev servers via `cmd.exe /c "npm run dev:..."` from WSL bash, OR have the user run them directly from PowerShell. Killing them: WSL bash can't always reach the Windows process tree — use `cmd.exe /c "taskkill /F /PID ..."` or `cmd.exe /c "taskkill /F /IM node.exe"`.
4. **Next 16 transitive deps**: npm 11 + Next 16.2.4 fails to resolve `@swc/helpers`, `@next/env`, `styled-jsx`. They are declared as **explicit deps** in `frontend/package.json`. Do not remove them or `next dev` crashes with `MODULE_NOT_FOUND`.
5. **`next lint` was removed in Next 16**, and `eslint-config-next` references a babel parser that no longer ships. The lint step is **dropped from CI**. Restore it with a proper flat-config rewrite when you have time (low priority).
6. **`frontend/tsconfig.json`** has `"jsx": "react-jsx"` (changed by Next or a linter — user said it's intentional, do not revert).
7. **Root `package.json`** has `"dependencies": { "clear": "^0.1.0" }` — user added it for some reason, do not remove.
8. **Vercel monorepo install**: Root Directory is set to `frontend`, Install Command is overridden to `cd .. && npm install` (workspace deps need root-level install).
9. **Vercel env vars**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Production/Preview/Development. `NEXT_PUBLIC_BACKEND_URL` is intentionally not yet set — placeholder will be the Railway URL once backend deploys.
10. **Supabase site URL & redirects**: Site URL = `https://www.propelt.com`. Allowed redirect URLs include `http://localhost:3000/auth/callback` and `https://www.propelt.com/auth/callback` (the callback handler exists but is now unused since we switched to OTP code flow — leave it, harmless).
11. **`Move-Item` blocked**: User wanted to move out of OneDrive earlier; it failed because of VS Code + Claude Code holding handles. They settled on staying in OneDrive. If they retry, they need to close all editors/sessions first.

---

## How to read CI / push

```bash
# In WSL bash, project root.
gh run list --workflow=frontend.yml --limit 3
gh run list --workflow=backend.yml --limit 3
gh run view <run-id> --log-failed | tail -60   # for the failure
```

Push works directly from WSL bash because `gh` set up the credential helper.

---

## Working environment shortcuts

```bash
# typecheck everything
cmd.exe /c "npm run typecheck"

# dev servers (from PowerShell, two windows)
npm run dev:backend
npm run dev:frontend

# health probe
curl -fsS http://localhost:4000/health
```

Production curl:
```bash
curl -sS -o /tmp/x.html -w "status=%{http_code}\n" https://www.propelt.com/
```

---

## Decision log (so you know why things are the way they are)

- **Magic link → OTP code**: switched because Gmail/link-scanner pre-fetch consumed the single-use token. Stripe/Linear/Notion-style OTP code is bulletproof.
- **Resend → Brevo**: user prefers Brevo and already has an account. Update plan/phases mental model accordingly. The Phase 5 reminder emails in `phases.md` should also use Brevo.
- **`@swc/helpers` etc. as explicit deps**: workaround for the npm 11 / Next 16.2.4 transitive resolution bug.
- **Lint dropped from CI**: temporary, see Quirk #5.
- **Middleware fails open**: previous deploys returned blanket 500 on missing env. Hardened to log + pass through. Don't tighten without good reason.

---

## Your first 10 minutes

1. Read this whole file. Read `phases.md`. Skim `plan.md`.
2. Run `git log --oneline -10` to see what's actually committed.
3. Greet the user briefly, confirm Phase 1 status, and **invoke `grill-me`** before doing anything.
4. After grilling: walk them through Brevo SMTP setup.
5. Have them re-test OTP login on prod.
6. Have them run the SQL migration in Supabase.
7. Phase 1 done. Move to Phase 2 (after grilling them on the intake form design).
