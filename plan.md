# Propelt Product Plan

## What This Is

Propelt is a Singapore-focused AI job-search copilot.

The first product promise is simple: a job seeker uploads or pastes a resume, tells Propelt what kind of role they want, answers a short AI-led coaching chat, and gets a stronger resume draft plus job-specific application materials.

Target users for the MVP:

- Singapore students looking for internships
- Fresh graduates applying for their first full-time role
- Early-career job seekers with 0-3 years of experience
- Career switchers can come later, but the MVP should not overfit to them yet

The tone should be professional and student-friendly. The AI should be direct, practical, and Singapore-aware without sounding like a generic motivational coach.

## Core MVP Flow

1. User signs in with email OTP.
2. User uploads a resume file (PDF/DOCX) or pastes resume text.
3. Backend parses the resume into text and stores a structured resume record.
4. User sets a target role, industry, experience level, and optionally pastes a job description.
5. AI reviews the resume and asks one follow-up question at a time in chat.
6. User answers or skips each question.
7. AI generates:
   - Resume diagnosis
   - Missing information checklist
   - Improved bullet points
   - Full rewritten resume draft
   - Job-specific resume draft when a job description is provided
   - Cover letter draft
8. User edits generated drafts in the app.
9. User exports PDF/DOCX.
10. User can delete resume data, chat history, and generated documents.

## What The MVP Is Not

- Not a job board
- Not a scraper for LinkedIn, JobStreet, or MyCareersFuture
- Not an automated job applier
- Not a fake ATS score generator
- Not a full CRM-style application tracker at first
- Not a replacement for WSG/SkillsFuture career coaching

## Singapore-Specific Product Angle

Propelt should help users with the problems common in the Singapore job search:

- Weak or generic resumes
- Resume bullets that describe duties but not impact
- Poor tailoring to job descriptions
- Unclear target role or industry
- Fresh graduate resumes that underuse internships, CCAs, projects, and school work
- Missing metrics, tools, scope, and outcomes
- Interview readiness gaps for basic questions like "Tell me about yourself"
- Skills gaps against target roles

The product should use Singapore-relevant concepts where useful:

- Internship, traineeship, contract, and full-time targets
- Poly, ITE, university, private degree, bootcamp, and certification backgrounds
- Local industries such as tech, finance, healthcare, logistics, public sector, professional services, marketing, operations, and sales
- Job platforms such as MyCareersFuture, JobStreet, LinkedIn, Indeed, and company career pages as references, not scraped sources in MVP

## Recommended MVP Feature Set

### Resume Intake

- Upload PDF/DOCX
- Paste text fallback
- Store one active resume per user
- Keep raw extracted text plus structured sections when possible
- Allow full deletion

### Target Role Setup

Fields:

- Target role title
- Target industry
- Experience level: internship, fresh grad, junior, mid-career switcher
- Employment type: internship, full-time, contract, traineeship
- Optional job description paste
- Optional location/work mode preferences

### AI Coaching Chat

The chat should ask one question at a time. Questions should be generated from gaps found in the resume and target role.

Example question categories:

- "What result did this project produce?"
- "Can you estimate the scale, users, revenue, time saved, or accuracy improvement?"
- "Which tools or technologies did you use?"
- "Which role are you actually prioritising?"
- "Do you have internships, projects, hackathons, CCAs, freelance work, or part-time work not shown here?"
- "For this job description, do you have experience with any of these missing skills?"

Users must be able to skip questions.

### Resume Diagnosis

Avoid a gimmicky ATS percentage score. Use a useful "Job Match Review":

- Strong points
- Weak or vague bullets
- Missing keywords from the target job
- Missing proof or metrics
- Formatting risks
- Suggested next questions

### Document Generation

Generated document types:

- `resume_diagnosis`
- `resume_bullets`
- `resume_rewrite`
- `targeted_resume`
- `cover_letter`
- `interview_brief`

MVP priority:

1. Resume diagnosis
2. Improved bullets
3. Full resume rewrite
4. Targeted resume from pasted job description
5. Cover letter

Interview brief can wait if needed.

### Editing And Export

- Generated documents should be editable in textareas for MVP.
- Export PDF/DOCX should be supported, but the first implementation can use a simple clean template.
- Store generated versions so users can come back later.

### Privacy And Data

Resumes contain sensitive personal data. Product rules:

- Users can delete resume, chat history, generated documents, and account data.
- Product analytics should track events, not resume content.
- Do not sell resume data.
- Do not train AI models on user resumes.
- Only email users for login, product updates, and job-search reminders when appropriate.
- Keep a privacy policy clear enough for students and early-career users to understand.

## Freemium Model

Do not gate payments in the first build. Build the product flow first.

Later freemium split:

- Free: one resume upload, basic diagnosis, limited AI questions
- Paid: full rewrite, job-specific tailoring, cover letters, exports, more regenerations
- Possible credits: per tailored job application pack

## Stack

Keep the existing stack:

- Frontend: Next.js 16, React 19, TypeScript, Tailwind v4
- Backend: Express 5, TypeScript, Node 20+
- Auth/DB: Supabase Auth and Postgres with RLS
- Shared schemas: Zod in `shared/`
- AI: Anthropic SDK
- File parsing: backend-side PDF/DOCX extraction
- Hosting: Vercel frontend, Railway backend
- Payments later: Lemon Squeezy
- Email later: Brevo

## New Data Model

Core tables:

- `profiles`
- `resumes`
- `job_targets`
- `resume_questions`
- `resume_answers`
- `generated_documents`
- `document_exports`

Later:

- `applications`
- `job_search_reminders`
- `billing_events`

## Sacred IDs

Document type IDs:

- `resume_diagnosis`
- `resume_bullets`
- `resume_rewrite`
- `targeted_resume`
- `cover_letter`
- `interview_brief`

Experience levels:

- `internship`
- `fresh_grad`
- `junior`
- `mid_career_switcher`

Resume input methods:

- `paste`
- `pdf`
- `docx`

## Implementation Strategy

Keep the scaffold:

- npm workspaces
- frontend app shell
- backend app shell
- Supabase auth helpers
- Express auth middleware
- CI and typecheck flow

Replace the old launch-toolkit layer:

- Product copy
- Shared launch/asset/checklist schemas
- SQL migration
- Future route names
- Dashboard placeholder

The first real build phase should be the resume intake and target role setup.
