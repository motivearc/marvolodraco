-- Add hero image slider support.
-- Run in Supabase SQL Editor after previous migrations.

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
