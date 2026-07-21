-- HeroForge core schema: one profile per user, plus their food log and
-- body-measurement history. Every table is scoped to auth.uid() via RLS
-- so a user can only ever see or write their own rows.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  selected_hero_id text not null default 'batman',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.food_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  name text not null,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  logged_at timestamptz not null default now()
);

create table if not exists public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  weight numeric,
  chest numeric,
  waist numeric,
  arms numeric,
  thighs numeric,
  created_at timestamptz not null default now()
);

create index if not exists food_log_user_date_idx on public.food_log (user_id, date);
create index if not exists body_metrics_user_date_idx on public.body_metrics (user_id, date);

-- Row Level Security -------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.food_log enable row level security;
alter table public.body_metrics enable row level security;

create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);
create policy "Profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id);
create policy "Profiles are insertable by owner" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Food log is viewable by owner" on public.food_log
  for select using (auth.uid() = user_id);
create policy "Food log is insertable by owner" on public.food_log
  for insert with check (auth.uid() = user_id);
create policy "Food log is updatable by owner" on public.food_log
  for update using (auth.uid() = user_id);
create policy "Food log is deletable by owner" on public.food_log
  for delete using (auth.uid() = user_id);

create policy "Body metrics are viewable by owner" on public.body_metrics
  for select using (auth.uid() = user_id);
create policy "Body metrics are insertable by owner" on public.body_metrics
  for insert with check (auth.uid() = user_id);
create policy "Body metrics are updatable by owner" on public.body_metrics
  for update using (auth.uid() = user_id);
create policy "Body metrics are deletable by owner" on public.body_metrics
  for delete using (auth.uid() = user_id);

-- Auto-provision a profile row whenever a new auth user is created --------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
