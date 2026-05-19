# 005 System Hardening And Resume Edit

You are editing the Propelt repo.

## Context

Propelt is an AI-powered graduate job application assistant for students, fresh graduates, and early-career candidates in Singapore.

The product is not just a resume builder. The MVP should let a user:

1. sign up or log in,
2. set up candidate context,
3. save a reusable resume,
4. paste a target job description,
5. answer guided positioning questions,
6. generate a tailored application package,
7. review/edit/copy the result,
8. return later to resumes and past applications.

## Current State

Recent passes added the main authenticated workspace:

- `/dashboard` with tiered onboarding states
- `/resumes` resume library
- `/applications` application history
- `/applications/new` application generator
- `/applications/[id]` generated result review/edit page
- `/onboarding` full profile setup
- persistent collapsible sidebar across workspace pages
- Google/email auth with OAuth hash handling
- backend health, profile, resume, application, generation, update, and delete routes

At the latest review, these commands pass:

```bash
npm run build:frontend
npm run build:backend
```

So the app is no longer broken at build level.

## Honest Product Status

The system appears to support the core happy path now:

1. log in,
2. land in dashboard,
3. add profile and resume,
4. start a new application,
5. paste JD and answer questions,
6. generate result,
7. view/copy/edit parts of result,
8. see saved applications later.

But it is not fully product-ready yet. This pass should harden the MVP instead of redesigning everything.

## Main Gaps

### 1. Resume Editing Is Missing

The prompt 004 pass intentionally deferred resume edit.

Current behavior:

- User can create/list/delete resumes.
- User cannot edit a saved resume title/content.

This is a real MVP gap because users will notice parsing mistakes or want to update their base resume.

Implement a small complete pass:

- Add backend route:
  - `PATCH /api/resumes/:id`
  - requires auth
  - only updates the current user's resume
  - accepts `{ title, content }`
  - validates non-empty title and content
  - returns the updated resume in the same shape as other resume routes
- Add frontend API method:
  - `api.updateResume(id, payload)`
- Update `/resumes`:
  - add an Edit action per saved resume
  - inline edit is fine
  - allow editing title and content
  - Save / Cancel states
  - show saving state
  - handle error clearly
  - after save, update local state

Keep this practical. Do not build a full resume editor yet.

### 2. Validate Application Result Updates On Backend

Current concern:

- `/api/applications/:id/result` updates `result` directly from `request.body`.
- It should validate against the shared generated result schema before saving.

Fix:

- Import/use `generatedResultSchema` from `@propelt/shared`.
- Parse `request.body.result`.
- Return a useful error if invalid.
- Save only validated result.

This matters because the result detail page now has edit/save UI.

### 3. Tighten Required Field Mismatch

Current app generator UI only requires:

- resume
- job description
- target role/industry
- strongest skills

But shared schema currently requires all `ApplicationQuestions` fields to be non-empty:

- targetRoleOrIndustry
- strongestSkills
- proudestExperiences
- achievementsToHighlight
- guardrails

Decide on one consistent behavior and implement it.

Preferred MVP behavior:

- Keep only target role/industry and strongest skills required.
- Allow proudest experiences and achievements to be optional.
- Keep guardrails with a default non-empty string.

If changing schema:

- Update `applicationQuestionSchema` safely.
- Make sure backend generation prompt handles optional blank values gracefully.
- Make frontend validation and backend validation match.

Do not create a situation where the frontend says a field is optional but backend rejects it.

### 4. Improve Loading And Empty States Without Redesign

Make small UX hardening improvements:

- `/applications` should show a real loading state while applications are being fetched, not only an empty list flash.
- `/resumes` should show a real loading state if it currently flashes empty content.
- Dashboard should avoid showing "not started" incorrectly before all data loads.
- Keep the existing visual system. Do not redo layout.

### 5. Replace Browser Confirm If Easy

Current `/applications` delete uses native `confirm`.

If this is quick, replace with an inline confirmation state:

- first click changes button state to "Confirm delete"
- second click deletes
- cancel by clicking elsewhere or after successful delete

Do not build a modal unless it is already easy with existing patterns.

### 6. Production QA Checklist

After changes, run:

```bash
npm run build:frontend
npm run build:backend
```

Then manually inspect for obvious TypeScript or runtime mistakes.

## Guardrails

- Do not redesign the landing page.
- Do not redesign the entire dashboard.
- Do not introduce a new UI library.
- Do not change the brand palette.
- Do not invent testimonials, fake stats, fake employers, fake users, or fake outcomes.
- Keep edits scoped to system hardening and the missing resume edit flow.
- Keep the sidebar persistent.
- Keep the app professional and calm.

## Expected Output

When done, summarize:

1. files changed,
2. routes/API changed,
3. what was fixed,
4. what was deliberately left for later,
5. build results.

