-- Run this SQL in your Supabase SQL Editor to create the portfolios table
--
-- NOTE: `slug` and the public read policy below are required for published
-- portfolio URLs (/<slug>) to work for visitors who are not signed in.
-- Without the public policy every shared link resolves to 404 because RLS
-- filters the row out for anonymous readers.

create table if not exists public.portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  template_name text not null,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  slug text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Existing projects: add the public URL column if it is missing.
alter table public.portfolios add column if not exists slug text unique;

-- Enable RLS
alter table public.portfolios enable row level security;

-- Policies
drop policy if exists "Users can view their own portfolios" on public.portfolios;
create policy "Users can view their own portfolios"
  on public.portfolios for select
  using (auth.uid() = user_id);

-- Public portfolios must be readable by anonymous visitors. This policy is
-- permissive, so it is OR-ed with the owner policy above: drafts stay private,
-- published rows are readable by anyone holding the slug.
drop policy if exists "Anyone can view published portfolios" on public.portfolios;
create policy "Anyone can view published portfolios"
  on public.portfolios for select
  using (status = 'published' and slug is not null);

drop policy if exists "Users can insert their own portfolios" on public.portfolios;
create policy "Users can insert their own portfolios"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own portfolios" on public.portfolios;
create policy "Users can update their own portfolios"
  on public.portfolios for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own portfolios" on public.portfolios;
create policy "Users can delete their own portfolios"
  on public.portfolios for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists portfolios_user_id_idx on public.portfolios(user_id);
create index if not exists portfolios_updated_at_idx on public.portfolios(updated_at desc);
create index if not exists idx_portfolios_slug on public.portfolios(slug);

-- Trigger to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists portfolios_updated_at on public.portfolios;
create trigger portfolios_updated_at
  before update on public.portfolios
  for each row
  execute function public.handle_updated_at();
