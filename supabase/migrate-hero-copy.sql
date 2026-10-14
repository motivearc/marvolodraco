-- Hero copy columns on site_settings.
-- Run in the Supabase SQL Editor.
--
-- headline and description may be empty strings ('') to hide those lines
-- on the storefront. Defaults only apply to brand-new rows / missing columns.

alter table public.site_settings
  add column if not exists hero_eyebrow text not null default 'Marvolo',
  add column if not exists hero_headline text not null default 'Timeless Style. Made for Every Occasion.',
  add column if not exists hero_description text not null default 'Discover premium clothing designed for effortless confidence, comfort and everyday sophistication.',
  add column if not exists hero_primary_cta text not null default 'View Collection',
  add column if not exists hero_secondary_cta text not null default 'Order on WhatsApp';

-- Keep button labels filled if somehow blank; do not touch headline / description
-- so admin can clear them and save ''.
update public.site_settings
set
  hero_eyebrow = coalesce(nullif(hero_eyebrow, ''), 'Marvolo'),
  hero_primary_cta = coalesce(nullif(hero_primary_cta, ''), 'View Collection'),
  hero_secondary_cta = coalesce(nullif(hero_secondary_cta, ''), 'Order on WhatsApp')
where id = 1;

-- Optional: clear headline + supporting text (uncomment to run once)
-- update public.site_settings
-- set hero_headline = '', hero_description = ''
-- where id = 1;
