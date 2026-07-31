-- Marvolo catalogue schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).

create extension if not exists "pgcrypto";

-- Products
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('shirts', 't-shirts', 'pants', 'outerwear')),
  description text not null default '',
  price numeric(10, 2) not null default 0,
  main_image text not null default '',
  images jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  colours jsonb not null default '[]'::jsonb,
  material text not null default '',
  care_instructions text not null default '',
  featured boolean not null default false,
  new_arrival boolean not null default false,
  available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Site imagery + hero copy (singleton row)
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  hero_image text not null,
  hero_images jsonb not null default '[]'::jsonb,
  about_image text not null,
  hero_eyebrow text not null default 'Marvolo',
  hero_headline text not null default 'Timeless Style. Made for Every Occasion.',
  hero_description text not null default 'Discover premium clothing designed for effortless confidence, comfort and everyday sophistication.',
  hero_primary_cta text not null default 'View Collection',
  hero_secondary_cta text not null default 'Order on WhatsApp',
  whatsapp_contacts jsonb not null default '[
    {"label":"Line 1","number":"60123456789","display":"+60 12-345 6789"},
    {"label":"Line 2","number":"","display":""},
    {"label":"Line 3","number":"","display":""}
  ]'::jsonb,
  whatsapp_active_index integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Lookbook gallery
create table if not exists public.lookbook_images (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null default '',
  span text not null default 'normal' check (span in ('normal', 'tall', 'wide')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Updated-at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.lookbook_images enable row level security;

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated write products" on public.products;
create policy "Authenticated write products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated write site_settings" on public.site_settings;
create policy "Authenticated write site_settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public read lookbook_images" on public.lookbook_images;
create policy "Public read lookbook_images"
  on public.lookbook_images for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated write lookbook_images" on public.lookbook_images;
create policy "Authenticated write lookbook_images"
  on public.lookbook_images for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for uploaded images
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "Authenticated upload media" on storage.objects;
create policy "Authenticated upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "Authenticated update media" on storage.objects;
create policy "Authenticated update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "Authenticated delete media" on storage.objects;
create policy "Authenticated delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
