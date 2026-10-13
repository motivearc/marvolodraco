-- Customer reviews with admin approval.
-- Run in the Supabase SQL Editor, then sign out and sign back into /admin.

create extension if not exists "pgcrypto";

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating integer not null,
  body text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint reviews_name_check check (char_length(trim(name)) between 2 and 80),
  constraint reviews_rating_check check (rating between 1 and 5),
  constraint reviews_body_check check (char_length(trim(body)) between 10 and 600),
  constraint reviews_status_check check (status in ('pending', 'approved'))
);

create index if not exists reviews_status_created_at_idx
  on public.reviews (status, created_at desc);

alter table public.reviews enable row level security;

grant select, insert on table public.reviews to anon;
grant select, insert, update, delete on table public.reviews to authenticated;
grant all on table public.reviews to service_role;

drop policy if exists "Public read reviews" on public.reviews;
create policy "Public read reviews"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved' or public.is_admin());

drop policy if exists "Public submit reviews" on public.reviews;
create policy "Public submit reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Admin update reviews" on public.reviews;
create policy "Admin update reviews"
  on public.reviews for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin delete reviews" on public.reviews;
create policy "Admin delete reviews"
  on public.reviews for delete
  to authenticated
  using (public.is_admin());

insert into public.reviews (id, name, rating, body, status, created_at)
values
  (
    'a1111111-1111-4111-8111-111111111101',
    'Aisha Rahman',
    5,
    'The linen overshirt feels incredible and looks even better in person. Ordering through WhatsApp was simple and personal.',
    'approved',
    '2026-01-04T00:00:00Z'
  ),
  (
    'a1111111-1111-4111-8111-111111111102',
    'Daniel Tan',
    5,
    'Clean cuts, premium fabrics and a fit that works for everyday wear. Marvolo has become my go-to for smart-casual pieces.',
    'approved',
    '2026-01-03T00:00:00Z'
  ),
  (
    'a1111111-1111-4111-8111-111111111103',
    'Sofia Lim',
    5,
    'I love how understated everything feels. The quality is obvious and the team helped me choose the right size over WhatsApp.',
    'approved',
    '2026-01-02T00:00:00Z'
  ),
  (
    'a1111111-1111-4111-8111-111111111104',
    'Hafiz Omar',
    4,
    'Beautiful trousers and fast replies. The whole experience felt more thoughtful than a typical online shop.',
    'approved',
    '2026-01-01T00:00:00Z'
  )
on conflict (id) do nothing;
