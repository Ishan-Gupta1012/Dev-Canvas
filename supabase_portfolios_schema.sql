-- Run this SQL in your Supabase SQL Editor to create the portfolios table

create table if not exists public.portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  template_name text not null,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.portfolios enable row level security;

-- Policies
create policy "Users can view their own portfolios"
  on public.portfolios for select
  using (auth.uid() = user_id);

create policy "Users can insert their own portfolios"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own portfolios"
  on public.portfolios for update
  using (auth.uid() = user_id);

create policy "Users can delete their own portfolios"
  on public.portfolios for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists portfolios_user_id_idx on public.portfolios(user_id);
create index if not exists portfolios_updated_at_idx on public.portfolios(updated_at desc);

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