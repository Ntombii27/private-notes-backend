-- Run this code once in Supabase using the SQL Editor.
-- Create a new query, paste the code and click Run.

create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users(id) on delete cascade,
  title       text not null default '',
  content     text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- This index helps each user find their notes more easily.
create index if not exists notes_user_updated_idx
  on public.notes (user_id, updated_at desc);

-- Turn on row level security so users can only access
-- the notes that belong to their own accounts.
alter table public.notes enable row level security;

-- Allow users to see their own notes.
create policy "Users can read their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

-- Allow users to add notes to their own accounts.
create policy "Users can create notes for themselves"
  on public.notes for insert
  with check (auth.uid() = user_id);

-- Allow users to make changes to their own notes.
create policy "Users can edit their own notes"
  on public.notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow users to delete their own notes.
create policy "Users can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);