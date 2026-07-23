-- Daily reminder preferences, stored per-profile so they sync across
-- devices. Actual OS-level scheduling happens on-device via Capacitor's
-- Local Notifications plugin, driven by these values.

alter table public.profiles
  add column if not exists workout_reminder_enabled boolean not null default false,
  add column if not exists workout_reminder_time text not null default '08:00',
  add column if not exists food_reminder_enabled boolean not null default false,
  add column if not exists food_reminder_time text not null default '12:00';
