# 001 Dashboard Onboarding Flow

You are editing the Propelt repo.

## Product Context

Propelt is an AI-powered graduate job application assistant for students, fresh graduates, and early-career candidates in Singapore.

The app should not feel like a generic resume builder.

The desired flow is:

1. User lands on the marketing landing page.
2. User signs up or logs in.
3. After login, user lands on `/dashboard`.
4. `/dashboard` should feel like the main app workspace.
5. The left sidebar should remain visible and clickable.
6. The main dashboard home area should guide the user through onboarding / first application setup.
7. We build this part by part, so keep it clean and understandable.

## UX Direction

Do not redirect users to a separate onboarding-only page as the main experience.

Instead:

- `/dashboard` is the home base.
- The left sidebar contains navigation:
  - Home
  - Resumes
  - New application
  - Applications / History if already supported
  - Settings or Profile later if useful
  - Sign out
- The main dashboard content should guide first-time users through:
  1. Basic candidate profile
  2. Upload or paste resume
  3. Save reusable resume
  4. Continue to job description / new application

Think of this as:

> Dashboard shell + onboarding in the main content area.

The app should feel like a real SaaS workspace, not a standalone form page.

## Current Codebase

Relevant files:

- `frontend/src/app/dashboard/page.tsx`
- `frontend/src/app/onboarding/page.tsx`
- `frontend/src/app/applications/new/page.tsx`
- `frontend/src/app/resumes/page.tsx`
- `frontend/src/app/globals.css`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/use-session.ts`

Existing backend/API methods are already available through `api.ts`:

- `api.getProfile()`
- `api.saveProfile(profile)`
- `api.parseResume(formData)`
- `api.listResumes()`
- `api.createResume({ title, content })`
- `api.listApplications()`
- `api.generateApplication(...)`

Do not change backend unless absolutely necessary.

## What To Build Now

Build a proper dashboard home experience.

### 1. Dashboard App Shell

Create a dashboard layout directly in `/dashboard` for now.

It should include:

- Left sidebar
- Main content area
- Workspace status rail or summary cards if useful

Sidebar should be visually calm, professional, and clickable.

Sidebar links should point to existing routes:

- `/dashboard`
- `/resumes`
- `/applications/new`
- `/onboarding`
- Sign out button

Do not remove the old pages yet.

### 2. Main Dashboard Home

The dashboard home should show a guided setup flow.

For first-time users, show:

- Clear headline: `Build your first tailored application.`
- Short explanation: `Start with your profile and resume, then paste a job description.`
- Step-based onboarding cards:
  1. Candidate profile
  2. Resume upload / pasted text fallback
  3. Save and continue to application

Use the existing profile fields:

- Full name
- School
- Course
- Graduation year
- User type
- Target industry
- Target role

Use existing resume fields:

- Resume name
- PDF/DOCX upload
- Paste text fallback
- Editable parsed resume preview

### 3. Behavior

When the user clicks `Parse resume`:

- Use `api.parseResume(formData)`.
- Put parsed content into the editable resume text area.

When the user clicks `Save and start application`:

- Save profile with `api.saveProfile(profile)`.
- If resume text exists, save resume with `api.createResume(...)`.
- Then route user to `/applications/new`.

Do not generate the application directly from dashboard yet.

### 4. Returning User State

If user already has resumes/applications:

- Show workspace status:
  - Profile started / not started
  - Number of saved resumes
  - Number of applications
- Show recent applications in a side card.
- Show saved resumes in a side card.

Do not overcomplicate logic. Keep it simple.

### 5. Visual Design

Use the current Propelt palette and professional tone.

The dashboard should feel:

- calm
- structured
- premium
- student-friendly
- not playful
- not corporate-boring

Avoid:

- huge marketing hero sections inside the app
- decorative blobs/orbs
- fake stats
- fake testimonials
- unnecessary animations
- overdesigned cards inside cards

Cards should be practical and compact.

Use clear labels, good spacing, and obvious CTAs.

### 6. Technical Constraints

- TypeScript only.
- Do not add new dependencies.
- Do not change auth logic unless necessary.
- Do not remove existing pages.
- Keep changes scoped mainly to:
  - `frontend/src/app/dashboard/page.tsx`
  - `frontend/src/app/globals.css`

### 7. Validation

After editing, run:

```bash
npm run build:frontend
```

Fix any TypeScript or build issues.

## End Goal

After login, the user should feel:

> I’m inside Propelt now. The app is guiding me to create my first tailored application.

Not:

> I got dumped into a random dashboard with buttons.
