# Propelt Build Plan

This plan replaces the old launch-toolkit phases. Keep the technical scaffold, auth, Supabase wiring, CI, and monorepo structure. Replace the product layer with the Singapore job-search copilot.

## Phase 0 - Pivot Foundation

**Goal:** Rename the product intent across docs, schemas, migration, and placeholders while keeping the stack.

**Tasks**

- Replace launch-toolkit docs with job-copilot docs
- Replace shared schemas with resume/job/document schemas
- Replace initial SQL migration with job-copilot tables
- Update landing page copy
- Update dashboard placeholder copy
- Keep Supabase OTP auth unchanged

**Exit criteria**

- Typecheck passes
- App no longer references Product Hunt/HN/launch assets in active code
- DB migration reflects the new product model

**Depends on:** existing scaffold

## Phase 1 - Auth And Resume Intake

**Goal:** A signed-in user can create one active resume profile.

**Tasks**

- Confirm Supabase OTP works end to end
- Apply new SQL migration in Supabase
- Backend route: `POST /api/resume/paste`
- Backend route: `POST /api/resume/upload`
- Backend route: `GET /api/resume`
- Backend route: `DELETE /api/resume`
- Add PDF/DOCX parsing
- Frontend page: `/resume`
- Store extracted resume text and input method
- Show parse status and basic preview

**Exit criteria**

- User can paste resume text and save it
- User can upload PDF/DOCX and get extracted text
- User can delete resume data
- RLS prevents access to another user's resume

**Depends on:** Phase 0

## Phase 2 - Target Role Setup

**Goal:** User can tell Propelt what job they want.

**Tasks**

- Shared schema for job targets
- Backend CRUD routes for one active job target
- Frontend target setup screen
- Fields: target role, industry, experience level, employment type, optional job description
- Dashboard shows resume + target status

**Exit criteria**

- User can save and edit target role
- Optional job description is stored
- Dashboard clearly shows next step

**Depends on:** Phase 1

## Phase 3 - AI Resume Diagnosis And Question Chat

**Goal:** AI reviews the resume and asks useful follow-up questions one at a time.

**Tasks**

- Backend AI module for resume analysis
- Generate initial resume diagnosis
- Generate question queue from resume gaps
- Backend routes for questions and answers
- Frontend chat UI
- Allow skip
- Rate-limit AI endpoints
- Log token/cost estimates

**Exit criteria**

- AI can produce a useful diagnosis for a real Singapore job seeker resume
- AI asks relevant follow-up questions
- User can answer or skip
- Questions and answers persist

**Depends on:** Phase 2

## Phase 4 - Resume Rewrite

**Goal:** User gets improved resume content from their resume plus chat answers.

**Tasks**

- Generate improved bullet points
- Generate full resume rewrite
- Store generated documents
- Frontend document viewer/editor
- Save edits
- Copy-to-clipboard feedback

**Exit criteria**

- User can generate improved bullets
- User can generate full rewritten resume
- User can edit and save generated content

**Depends on:** Phase 3

## Phase 5 - Job-Specific Application Pack

**Goal:** If the user provides a job description, Propelt tailors materials for that job.

**Tasks**

- Job Match Review: missing keywords, relevant strengths, gaps
- Generate targeted resume
- Generate cover letter
- Generate short interview brief
- Frontend tabs for generated documents

**Exit criteria**

- User can paste a JD and generate job-specific materials
- App explains what changed and why
- User can edit and save each document

**Depends on:** Phase 4

## Phase 6 - PDF/DOCX Export

**Goal:** User can export clean application documents.

**Tasks**

- Simple resume template
- Simple cover letter template
- PDF export
- DOCX export
- Record export metadata

**Exit criteria**

- Exported resume opens cleanly
- Exported DOCX is editable
- PDF formatting is acceptable on desktop and mobile preview

**Depends on:** Phase 4

## Phase 7 - Privacy, Analytics, And Emails

**Goal:** Make the product trustworthy enough for sensitive resume data.

**Tasks**

- Privacy policy page
- Delete-data workflow
- Analytics events without sensitive content
- Email consent field
- Brevo transactional/product email setup
- Optional reminder emails for job-search habits

**Exit criteria**

- User can understand and control stored data
- Analytics avoids resume/job-description text
- Email behavior is explicit and appropriate

**Depends on:** Phase 1

## Phase 8 - Freemium And Billing

**Goal:** Add monetization after the core flow works.

**Tasks**

- Define free limits
- Lemon Squeezy checkout
- Webhook verification
- Billing table
- Gate full rewrite, job tailoring, exports, or regeneration limits

**Exit criteria**

- Paid purchase unlocks paid features
- Free users receive clear upgrade prompts
- Webhook signature verification rejects forged events

**Depends on:** Phase 5

## Later Features

- Application tracker
- Job-search weekly plan
- Interview practice mode
- Portfolio/LinkedIn review
- Skills gap and course suggestions
- Multiple resumes
- Recruiter outreach messages

## Cross-Cutting Rules

- Use RLS on every table
- Use Zod schemas in `shared/`
- Rate-limit every AI endpoint
- Never log resume contents, job descriptions, or generated sensitive content
- Keep one active resume for MVP
- Users must be able to delete sensitive data
