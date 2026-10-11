-- Clear placeholder (Unsplash) images from an already-seeded database.
-- Run in the Supabase SQL Editor. Safe to re-run.
-- Does not delete product rows — only wipes image fields and lookbook entries.

update public.site_settings
set
  hero_image = '',
  hero_images = '[]'::jsonb,
  about_image = ''
where id = 1;

update public.products
set
  main_image = '',
  images = '[]'::jsonb;

delete from public.lookbook_images;
