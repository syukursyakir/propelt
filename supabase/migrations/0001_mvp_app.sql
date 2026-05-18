create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  school text not null,
  course text not null,
  graduation_year text not null,
  user_type text not null check (
    user_type in (
      'university_student',
      'poly_student',
      'fresh_graduate',
      'early_career'
    )
  ),
  target_role text not null,
  target_industry text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid not null references public.resumes(id) on delete cascade,
  job_title text,
  company_name text,
  job_description text not null,
  questions jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resumes_user_id_updated_at_idx
  on public.resumes(user_id, updated_at desc);

create index if not exists applications_user_id_created_at_idx
  on public.applications(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_career_profiles_updated_at
before update on public.career_profiles
for each row execute function public.set_updated_at();

create trigger set_resumes_updated_at
before update on public.resumes
for each row execute function public.set_updated_at();

create trigger set_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.career_profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.applications enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can manage own career profile"
  on public.career_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own resumes"
  on public.resumes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own applications"
  on public.applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
