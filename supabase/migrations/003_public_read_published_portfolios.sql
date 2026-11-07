-- Published portfolios are public: visitors who are not signed in must be able
-- to read the row behind /<slug>. Without this, shared links 404 for everyone
-- except the owner (whose session cookie satisfies the owner-only policy).
--
-- Idempotent — safe to run on an existing project.

alter table public.portfolios add column if not exists slug text unique;

drop policy if exists "Anyone can view published portfolios" on public.portfolios;
create policy "Anyone can view published portfolios"
  on public.portfolios for select
  using (status = 'published' and slug is not null);
