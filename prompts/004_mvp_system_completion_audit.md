# 004 MVP System Completion Audit

You are editing the Propelt repo.

## Context

Propelt is an AI-powered graduate job application assistant for students, fresh graduates, and early-career candidates in Singapore.

The product goal is not just “resume builder”.

The product should help a user:

1. sign up / log in,
2. set up candidate context,
3. save or reuse a resume,
4. paste a target job description,
5. answer guided questions,
6. generate a tailored application package,
7. review/edit/copy the generated result,
8. return later and continue from saved resumes/applications.

## Current Technical State

The system already has meaningful MVP plumbing.

### Frontend

Current routes:

- `/` marketing landing page
- `/auth` login/signup with Google + email/password
- `/dashboard` authenticated workspace home
- `/resumes` resume library
- `/applications/new` new application generator
- `/applications/[id]` generated result review/edit page
- `/onboarding` older full onboarding page

Current shell:

- Persistent authenticated `AppShell`
- Collapsible sidebar
- Sidebar icons
- Sidebar persists across dashboard, resumes, new application, application detail, and onboarding

Current frontend API methods:

- `api.getProfile()`
- `api.saveProfile(profile)`
- `api.parseResume(formData)`
- `api.listResumes()`
- `api.createResume({ title, content })`
- `api.deleteResume(id)`
- `api.listApplications()`
- `api.getApplication(id)`
- `api.generateApplication(payload)`
- `api.updateApplicationResult(id, result)`
- `api.deleteApplication(id)`

### Backend

Current backend has:

- `GET /health`
- Supabase auth middleware
- profile get/save
- resume parse
- resume list/create/delete
- application list/get/generate/update/delete
- OpenAI structured JSON generation
- PDF parsing
- DOCX parsing

### Database

Supabase migration includes:

- `profiles`
- `career_profiles`
- `resumes`
- `applications`
- RLS policies
- auth user profile trigger

### Builds

At audit time:

```bash
npm run build:frontend
npm run build:backend
```

both pass.

## Honest Product Status

The app is technically close to an MVP, but the entire system is not fully “done” as a polished product.

It likely supports the core happy path:

1. user logs in,
2. user lands on dashboard,
3. user adds profile/resume,
4. user starts new application,
5. user pastes JD and answers questions,
6. backend generates result,
7. result page shows editable sections.

But there are gaps that will make real users confused or blocked.

## Main Gaps To Address

### 1. No Clear Application History Page

There is `api.listApplications()`, and dashboard shows recent applications, but there is no dedicated `/applications` page.

This means users cannot properly browse/search/manage all past applications.

Build a simple `/applications` page inside `AppShell`.

It should:

- list saved applications
- show job title, company, created date
- link to `/applications/[id]`
- show empty state with CTA to `/applications/new`
- optionally allow delete if simple and safe

Then update sidebar:

- Add `Applications` nav item pointing to `/applications`
- Keep `New application` as separate nav item
- Active states should work correctly:
  - `/applications` active for list and detail
  - `/applications/new` active for new application

### 2. Dashboard First-Time Flow Needs Completion Logic

Dashboard currently always shows the profile/resume setup cards, even for returning users.

Improve the dashboard logic:

- First-time users: show guided setup prominently.
- Returning users with at least one resume: reduce setup prominence and show “Start new application” / recent activity.
- If profile is missing: show profile setup.
- If resume is missing: show resume setup.
- If profile and resume exist: show a cleaner home state:
  - primary CTA: `Start new application`
  - recent applications
  - saved resumes summary

Do not overbuild. Keep it simple.

### 3. New Application Page Needs Better Empty-State Handling

If user has no resumes, `/applications/new` currently has no good guidance.

Improve:

- If no saved resumes:
  - show a clear empty state
  - explain they need a resume first
  - CTA to `/resumes` or dashboard resume setup
  - disable generation clearly

Also improve validation:

- require selected resume
- require job description
- require required question fields
- show helpful inline/global error before calling backend

### 4. Result Page Is Too Raw

`/applications/[id]` currently renders generated sections into one editable textarea.

This works technically, but UX is rough.

Improve result review UX without changing backend schema:

- Keep tabs for the 6 output sections.
- Add a clearer summary header:
  - job title
  - company
  - generated date
- For Section A and B, consider a more readable display mode before editing:
  - fit score card
  - lists for strong/gap/focus
  - keyword status lists
- Keep editing possible.
- Keep `Copy section`.
- Add `Copy full result` if simple.

Do not build PDF/DOCX export yet.

### 5. Resume Library Needs Basic Edit Support

Resumes can be created and deleted, but not edited.

For MVP, add basic edit support if feasible:

- click saved resume
- edit title/content inline or in an edit panel
- save changes

This requires backend support if not present.

If backend update route is too much for this pass, do not implement edit. Instead, add a clear note in the prompt output saying this is still missing.

Preferred route if implementing:

- `PATCH /api/resumes/:id`
- update title/content for authenticated user
- add `api.updateResume(id, payload)`
- add frontend editing UI

### 6. Auth Redirect / Session Handling Should Be Checked

Current state includes:

- `/auth` redirects successful email and Google login to `/dashboard`
- root layout has `AuthHashRedirect` to catch OAuth hash tokens and redirect to dashboard

Do not remove this.

Check that:

- logged-out users cannot access authenticated pages
- logged-in users who visit `/auth` are not stuck there unnecessarily

Optional improvement:

- If `/auth` loads and session already exists, redirect to `/dashboard`.

### 7. Error And Loading States Are Basic

Improve obvious states only:

- generating state on `/applications/new`
- parse resume state on `/resumes`
- save state on resume creation
- application result loading state
- clear error copy for backend failures

Do not over-engineer toasts.

## What Not To Build Yet

Do not build these in this pass:

- PDF export
- DOCX export
- Stripe/payments
- admin dashboard
- AI chat
- job search integration
- browser extension
- fake analytics
- fake user stats
- testimonials
- email notifications

## Design Direction

Keep the current app shell.

The UI should feel:

- calm
- compact
- professional
- useful
- student-friendly
- not overdesigned

Use existing styles and palette.

Avoid huge headings, marketing hero sections, and decorative visual noise.

## Technical Constraints

- TypeScript only.
- Do not add dependencies.
- Do not change the database unless needed for resume editing.
- Keep changes scoped.
- Preserve existing working routes.
- Keep auth protection with `useSession`.
- Keep truthfulness guardrails in AI generation.

## Recommended Build Order

Work in this order:

1. Add `/applications` list page and sidebar nav item.
2. Improve `/applications/new` empty-state and validation.
3. Improve dashboard returning-user vs first-time-user states.
4. Improve result page readability/copy actions.
5. Add resume edit only if time and scope remain reasonable.
6. Run frontend/backend builds.

## Validation

Run:

```bash
npm run build:frontend
npm run build:backend
```

Fix all TypeScript/build issues.

## Acceptance Criteria

This pass is successful when:

- User can navigate the whole app from the sidebar.
- User can see all saved applications.
- User is not confused if they have no resume yet.
- Dashboard changes based on whether user is new or returning.
- Application result page is easier to read and copy.
- Core happy path still works:
  - login
  - save profile/resume
  - create application
  - generate result
  - review/copy/save result edits
- Builds pass.

## Final Note

Do not try to make everything perfect.

The goal is to move Propelt from “technical MVP pieces exist” to “usable MVP flow feels coherent”.
