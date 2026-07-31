-- Fix site content save failures.
-- Run in Supabase SQL Editor, then sign out and sign back into /admin.

-- 1) Ensure hero slider column exists
alter table public.site_settings
  add column if not exists hero_images jsonb not null default '[]'::jsonb;

update public.site_settings
set hero_images = case
  when jsonb_typeof(hero_images) = 'array' and jsonb_array_length(hero_images) > 0
    then hero_images
  when hero_image is not null and hero_image <> ''
    then jsonb_build_array(hero_image)
  else '[]'::jsonb
end
where id = 1;

-- 2) Ensure hero copy columns exist
alter table public.site_settings
  add column if not exists hero_eyebrow text not null default 'Marvolo',
  add column if not exists hero_headline text not null default 'Timeless Style. Made for Every Occasion.',
  add column if not exists hero_description text not null default 'Discover premium clothing designed for effortless confidence, comfort and everyday sophistication.',
  add column if not exists hero_primary_cta text not null default 'View Collection',
  add column if not exists hero_secondary_cta text not null default 'Order on WhatsApp';

-- 2b) Ensure WhatsApp contact columns exist
alter table public.site_settings
  add column if not exists whatsapp_contacts jsonb not null default '[
    {"label":"Line 1","number":"60123456789","display":"+60 12-345 6789"},
    {"label":"Line 2","number":"","display":""},
    {"label":"Line 3","number":"","display":""}
  ]'::jsonb,
  add column if not exists whatsapp_active_index integer not null default 0;

-- 3) Admin helper (JWT app_metadata.role = admin)
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

-- 4) Allow authenticated admins to write (keep public read)
drop policy if exists "Authenticated write site_settings" on public.site_settings;
drop policy if exists "Admin write site_settings" on public.site_settings;
create policy "Admin write site_settings"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated write lookbook_images" on public.lookbook_images;
drop policy if exists "Admin write lookbook_images" on public.lookbook_images;
create policy "Admin write lookbook_images"
  on public.lookbook_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated write products" on public.products;
drop policy if exists "Admin write products" on public.products;
create policy "Admin write products"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Temporary fallback: if saves still fail after promoting your admin user,
-- uncomment these policies so any signed-in user can write.
--
-- drop policy if exists "Admin write site_settings" on public.site_settings;
-- create policy "Authenticated write site_settings"
--   on public.site_settings for all to authenticated using (true) with check (true);
-- drop policy if exists "Admin write lookbook_images" on public.lookbook_images;
-- create policy "Authenticated write lookbook_images"
--   on public.lookbook_images for all to authenticated using (true) with check (true);
-- drop policy if exists "Admin write products" on public.products;
-- create policy "Authenticated write products"
--   on public.products for all to authenticated using (true) with check (true);

-- 5) Promote your admin user (change the email)
update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
where email = 'you@example.com';

select id, email, raw_app_meta_data
from auth.users
order by created_at desc;
