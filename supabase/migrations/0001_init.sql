-- Propelt initial schema
-- Singapore-focused AI job-search copilot

-- ============================================================
-- profiles: app-level user preferences and consent
-- ============================================================
create table if not exists public.profiles (
  user_id               uuid primary key references auth.users on delete cascade,
  display_name          text,
  email_opt_in          boolean not null default false,
  analytics_opt_in      boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ============================================================
-- resumes: one active resume per user for MVP
-- ============================================================
create table if not exists public.resumes (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  input_method     text not null check (input_method in ('paste', 'pdf', 'docx')),
  file_name        text,
  raw_text         text not null,
  parsed_sections  jsonb,
  status           text not null default 'draft' check (status in ('draft', 'parsed', 'failed')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create unique index if not exists resumes_one_per_user_uniq on public.resumes (user_id);
create index if not exists resumes_user_id_idx on public.resumes (user_id);

-- ============================================================
-- job_targets: the role the user wants to apply for
-- ============================================================
create table if not exists public.job_targets (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users on delete cascade,
  resume_id         uuid not null references public.resumes on delete cascade,
  target_role       text not null,
  industry          text,
  experience_level  text not null check (experience_level in (
    'internship', 'fresh_grad', 'junior', 'mid_career_switcher'
  )),
  employment_type   text not null check (employment_type in (
    'internship', 'full_time', 'contract', 'traineeship'
  )),
  job_description   text,
  preferences       jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists job_targets_user_id_idx on public.job_targets (user_id);
create index if not exists job_targets_resume_id_idx on public.job_targets (resume_id);

-- ============================================================
-- resume_questions: AI-generated coaching questions
-- ============================================================
create table if not exists public.resume_questions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users on delete cascade,
  resume_id      uuid not null references public.resumes on delete cascade,
  job_target_id  uuid references public.job_targets on delete cascade,
  question       text not null,
  reason         text,
  status         text not null default 'open' check (status in ('open', 'answered', 'skipped')),
  order_index    int not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists resume_questions_user_id_idx on public.resume_questions (user_id);
create index if not exists resume_questions_resume_id_idx on public.resume_questions (resume_id);

-- ============================================================
-- resume_answers: user's answers or skips
-- ============================================================
create table if not exists public.resume_answers (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references public.resume_questions on delete cascade,
  user_id      uuid not null references auth.users on delete cascade,
  answer       text,
  skipped      boolean not null default false,
  created_at   timestamptz not null default now(),
  constraint resume_answers_answer_or_skip check (
    skipped = true or (answer is not null and length(trim(answer)) > 0)
  )
);

create unique index if not exists resume_answers_question_uniq
  on public.resume_answers (question_id);
create index if not exists resume_answers_user_id_idx on public.resume_answers (user_id);

-- ============================================================
-- generated_documents: AI outputs
-- Sacred document_type values:
--   resume_diagnosis, resume_bullets, resume_rewrite,
--   targeted_resume, cover_letter, interview_brief
-- ============================================================
create table if not exists public.generated_documents (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users on delete cascade,
  resume_id         uuid not null references public.resumes on delete cascade,
  job_target_id     uuid references public.job_targets on delete set null,
  document_type     text not null check (document_type in (
    'resume_diagnosis',
    'resume_bullets',
    'resume_rewrite',
    'targeted_resume',
    'cover_letter',
    'interview_brief'
  )),
  content           text not null,
  edited_content    text,
  generation_count  int not null default 1,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists generated_documents_user_id_idx on public.generated_documents (user_id);
create index if not exists generated_documents_resume_id_idx on public.generated_documents (resume_id);
create index if not exists generated_documents_job_target_id_idx on public.generated_documents (job_target_id);

-- ============================================================
-- document_exports: export audit trail without storing file bytes
-- ============================================================
create table if not exists public.document_exports (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users on delete cascade,
  document_id    uuid not null references public.generated_documents on delete cascade,
  export_format  text not null check (export_format in ('pdf', 'docx')),
  created_at     timestamptz not null default now()
);

create index if not exists document_exports_user_id_idx on public.document_exports (user_id);
create index if not exists document_exports_document_id_idx on public.document_exports (document_id);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_resumes_updated_at on public.resumes;
create trigger touch_resumes_updated_at
  before update on public.resumes
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_job_targets_updated_at on public.job_targets;
create trigger touch_job_targets_updated_at
  before update on public.job_targets
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_generated_documents_updated_at on public.generated_documents;
create trigger touch_generated_documents_updated_at
  before update on public.generated_documents
  for each row execute function public.touch_updated_at();

-- ============================================================
-- RLS: owner can access only their own data.
-- ============================================================
alter table public.profiles            enable row level security;
alter table public.resumes             enable row level security;
alter table public.job_targets         enable row level security;
alter table public.resume_questions    enable row level security;
alter table public.resume_answers      enable row level security;
alter table public.generated_documents enable row level security;
alter table public.document_exports    enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (auth.uid() = user_id);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists resumes_select on public.resumes;
create policy resumes_select on public.resumes
  for select using (auth.uid() = user_id);

drop policy if exists resumes_insert on public.resumes;
create policy resumes_insert on public.resumes
  for insert with check (auth.uid() = user_id);

drop policy if exists resumes_update on public.resumes;
create policy resumes_update on public.resumes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists resumes_delete on public.resumes;
create policy resumes_delete on public.resumes
  for delete using (auth.uid() = user_id);

drop policy if exists job_targets_all on public.job_targets;
create policy job_targets_all on public.job_targets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists resume_questions_all on public.resume_questions;
create policy resume_questions_all on public.resume_questions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists resume_answers_all on public.resume_answers;
create policy resume_answers_all on public.resume_answers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists generated_documents_all on public.generated_documents;
create policy generated_documents_all on public.generated_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists document_exports_select on public.document_exports;
create policy document_exports_select on public.document_exports
  for select using (auth.uid() = user_id);

drop policy if exists document_exports_insert on public.document_exports;
create policy document_exports_insert on public.document_exports
  for insert with check (auth.uid() = user_id);
