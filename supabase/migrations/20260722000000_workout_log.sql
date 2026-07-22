-- Workout check-ins: one row per user per day, used for streaks & badges.

create table if not exists public.workout_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists workout_log_user_date_idx on public.workout_log (user_id, date);

alter table public.workout_log enable row level security;

create policy "Workout log is viewable by owner" on public.workout_log
  for select using (auth.uid() = user_id);
create policy "Workout log is insertable by owner" on public.workout_log
  for insert with check (auth.uid() = user_id);
create policy "Workout log is updatable by owner" on public.workout_log
  for update using (auth.uid() = user_id);
create policy "Workout log is deletable by owner" on public.workout_log
  for delete using (auth.uid() = user_id);
