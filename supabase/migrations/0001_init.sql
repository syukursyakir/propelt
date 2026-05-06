-- Propelt initial schema
-- Run in Supabase SQL editor (or via supabase db push if CLI is set up)

-- ============================================================
-- launches: one product launch project per row
-- ============================================================
create table if not exists public.launches (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users on delete cascade,
  product_name    text not null,
  tagline         text,
  description     text,
  category        text,
  target_audience text,
  features        jsonb,
  founder_story   text,
  launch_date     date,
  website_url     text,
  demo_url        text,
  tier            text not null default 'solo' check (tier in ('solo', 'pro', 'founder')),
  paid_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists launches_user_id_idx on public.launches (user_id);
create index if not exists launches_launch_date_idx on public.launches (launch_date) where launch_date is not null;

-- ============================================================
-- generated_assets: AI outputs per launch
-- Sacred asset_type values — never rename:
--   ph_tagline, ph_description, ph_first_comment,
--   hn_post,
--   reddit_sideproject, reddit_indiehackers, reddit_saas,
--   x_thread, linkedin_post, email_outreach
-- ============================================================
create table if not exists public.generated_assets (
  id                uuid primary key default gen_random_uuid(),
  launch_id         uuid not null references public.launches on delete cascade,
  asset_type        text not null,
  content           text not null,
  edited_content    text,
  generation_count  int  not null default 1,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint generated_assets_type_check check (asset_type in (
    'ph_tagline', 'ph_description', 'ph_first_comment',
    'hn_post',
    'reddit_sideproject', 'reddit_indiehackers', 'reddit_saas',
    'x_thread', 'linkedin_post', 'email_outreach'
  ))
);

create index if not exists generated_assets_launch_id_idx on public.generated_assets (launch_id);
create unique index if not exists generated_assets_launch_type_uniq
  on public.generated_assets (launch_id, asset_type);

-- ============================================================
-- checklist_progress: which pre-launch tasks are done
-- task_key pattern: t-{day}_{snake_action}, e.g., t-7_notify_hunters
-- ============================================================
create table if not exists public.checklist_progress (
  id            uuid primary key default gen_random_uuid(),
  launch_id     uuid not null references public.launches on delete cascade,
  task_key      text not null,
  completed_at  timestamptz,
  unique (launch_id, task_key)
);

create index if not exists checklist_progress_launch_id_idx on public.checklist_progress (launch_id);

-- ============================================================
-- purchases: Lemon Squeezy audit trail
-- ============================================================
create table if not exists public.purchases (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  launch_id    uuid references public.launches on delete set null,
  ls_order_id  text not null unique,
  tier         text not null check (tier in ('solo', 'pro', 'founder')),
  amount_cents int  not null,
  created_at   timestamptz not null default now()
);

create index if not exists purchases_user_id_idx on public.purchases (user_id);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists touch_launches_updated_at on public.launches;
create trigger touch_launches_updated_at
  before update on public.launches
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_generated_assets_updated_at on public.generated_assets;
create trigger touch_generated_assets_updated_at
  before update on public.generated_assets
  for each row execute function public.touch_updated_at();

-- ============================================================
-- RLS: every table locked down. auth.uid() = user_id pattern.
-- For child tables, ownership is checked via the parent launch.
-- ============================================================
alter table public.launches           enable row level security;
alter table public.generated_assets   enable row level security;
alter table public.checklist_progress enable row level security;
alter table public.purchases          enable row level security;

-- launches: owner can do everything
drop policy if exists launches_select on public.launches;
create policy launches_select on public.launches
  for select using (auth.uid() = user_id);

drop policy if exists launches_insert on public.launches;
create policy launches_insert on public.launches
  for insert with check (auth.uid() = user_id);

drop policy if exists launches_update on public.launches;
create policy launches_update on public.launches
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists launches_delete on public.launches;
create policy launches_delete on public.launches
  for delete using (auth.uid() = user_id);

-- generated_assets: access via owning launch
drop policy if exists generated_assets_select on public.generated_assets;
create policy generated_assets_select on public.generated_assets
  for select using (
    exists (select 1 from public.launches l
            where l.id = generated_assets.launch_id and l.user_id = auth.uid())
  );

drop policy if exists generated_assets_insert on public.generated_assets;
create policy generated_assets_insert on public.generated_assets
  for insert with check (
    exists (select 1 from public.launches l
            where l.id = generated_assets.launch_id and l.user_id = auth.uid())
  );

drop policy if exists generated_assets_update on public.generated_assets;
create policy generated_assets_update on public.generated_assets
  for update using (
    exists (select 1 from public.launches l
            where l.id = generated_assets.launch_id and l.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.launches l
            where l.id = generated_assets.launch_id and l.user_id = auth.uid())
  );

drop policy if exists generated_assets_delete on public.generated_assets;
create policy generated_assets_delete on public.generated_assets
  for delete using (
    exists (select 1 from public.launches l
            where l.id = generated_assets.launch_id and l.user_id = auth.uid())
  );

-- checklist_progress: same pattern
drop policy if exists checklist_progress_select on public.checklist_progress;
create policy checklist_progress_select on public.checklist_progress
  for select using (
    exists (select 1 from public.launches l
            where l.id = checklist_progress.launch_id and l.user_id = auth.uid())
  );

drop policy if exists checklist_progress_insert on public.checklist_progress;
create policy checklist_progress_insert on public.checklist_progress
  for insert with check (
    exists (select 1 from public.launches l
            where l.id = checklist_progress.launch_id and l.user_id = auth.uid())
  );

drop policy if exists checklist_progress_update on public.checklist_progress;
create policy checklist_progress_update on public.checklist_progress
  for update using (
    exists (select 1 from public.launches l
            where l.id = checklist_progress.launch_id and l.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.launches l
            where l.id = checklist_progress.launch_id and l.user_id = auth.uid())
  );

drop policy if exists checklist_progress_delete on public.checklist_progress;
create policy checklist_progress_delete on public.checklist_progress
  for delete using (
    exists (select 1 from public.launches l
            where l.id = checklist_progress.launch_id and l.user_id = auth.uid())
  );

-- purchases: read-only for the owner; writes happen via service role from webhook
drop policy if exists purchases_select on public.purchases;
create policy purchases_select on public.purchases
  for select using (auth.uid() = user_id);
