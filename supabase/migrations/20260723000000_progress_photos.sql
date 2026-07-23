-- Progress photos: a private storage bucket plus a metadata table so the
-- gallery can be queried/ordered without listing storage directly.
-- Objects are stored at "<user_id>/<filename>" so folder-based RLS can
-- scope access to the owning user.

insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

create policy "Progress photos are viewable by owner"
on storage.objects for select
using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Progress photos are insertable by owner"
on storage.objects for insert
with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Progress photos are deletable by owner"
on storage.objects for delete
using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists progress_photos_user_date_idx on public.progress_photos (user_id, date desc);

alter table public.progress_photos enable row level security;

create policy "Progress photo rows are viewable by owner" on public.progress_photos
  for select using (auth.uid() = user_id);
create policy "Progress photo rows are insertable by owner" on public.progress_photos
  for insert with check (auth.uid() = user_id);
create policy "Progress photo rows are deletable by owner" on public.progress_photos
  for delete using (auth.uid() = user_id);
