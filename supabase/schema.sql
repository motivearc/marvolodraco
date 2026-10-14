-- Marvolo catalogue schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).

create extension if not exists "pgcrypto";

-- Products
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
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
    {"label":"Line 1","number":"60123456789","display":"+60 12-345 6789","active":true},
    {"label":"Line 2","number":"","display":"","active":false},
    {"label":"Line 3","number":"","display":"","active":false}
  ]'::jsonb,
  whatsapp_active_index integer not null default 0,
  product_categories jsonb not null default '[
    {"id":"shirts","label":"Shirts"},
    {"id":"t-shirts","label":"T-Shirts"},
    {"id":"pants","label":"Pants"},
    {"id":"outerwear","label":"Outerwear"}
  ]'::jsonb,
  size_guides jsonb not null default '[
    {
      "id": "tops",
      "label": "Tops",
      "categoryIds": ["shirts", "t-shirts", "outerwear"],
      "columns": [
        {"id": "chest", "label": "Chest (cm)"},
        {"id": "shoulder", "label": "Shoulder (cm)"},
        {"id": "sleeve", "label": "Sleeve (cm)"},
        {"id": "length", "label": "Length (cm)"}
      ],
      "rows": [
        {"size": "S", "values": {"chest": "96–100", "shoulder": "42", "sleeve": "62", "length": "70"}},
        {"size": "M", "values": {"chest": "100–104", "shoulder": "44", "sleeve": "63", "length": "72"}},
        {"size": "L", "values": {"chest": "104–108", "shoulder": "46", "sleeve": "64", "length": "74"}},
        {"size": "XL", "values": {"chest": "108–114", "shoulder": "48", "sleeve": "65", "length": "76"}},
        {"size": "XXL", "values": {"chest": "114–120", "shoulder": "50", "sleeve": "66", "length": "78"}}
      ]
    }
  ]'::jsonb,
  faqs jsonb not null default '[
    {
      "question": "How do I place an order?",
      "answer": "Browse the collection, open a product, select your preferred colour and size, then tap “Order via WhatsApp”. A pre-filled message will open so you can confirm the item with us directly."
    },
    {
      "question": "How do I make payment?",
      "answer": "Payment instructions are shared privately through WhatsApp once your order details are confirmed. There is no online checkout or payment gateway on this website."
    },
    {
      "question": "What sizes are available?",
      "answer": "Most pieces are available in S to XXL. Please refer to our Size Guide for chest, shoulder, sleeve and length measurements, or message us on WhatsApp for fit advice."
    },
    {
      "question": "Can I exchange an item?",
      "answer": "Exchanges may be arranged depending on availability and condition. Contact us on WhatsApp within 7 days of receiving your order and we will guide you through the process."
    },
    {
      "question": "How long does delivery take?",
      "answer": "Delivery timelines vary by location and stock availability. Once your order is confirmed on WhatsApp, we will share the estimated shipping time and tracking details."
    },
    {
      "question": "How can I check product availability?",
      "answer": "Availability is shown on each product listing. For the latest stock updates, send us a WhatsApp message with the product name, colour and size you need."
    }
  ]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Lookbook gallery
create table if not exists public.lookbook_images (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null default '',
  span text not null default 'normal' check (span in ('normal', 'tall', 'wide')),
  focus_x numeric not null default 50 check (focus_x >= 0 and focus_x <= 100),
  focus_y numeric not null default 50 check (focus_y >= 0 and focus_y <= 100),
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

-- Customer reviews. Visitors can submit; only approved rows are public.
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
