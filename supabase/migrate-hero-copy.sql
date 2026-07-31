-- Add editable hero copy columns to site_settings.
-- Run this in the Supabase SQL Editor if you already applied schema.sql.

alter table public.site_settings
  add column if not exists hero_eyebrow text not null default 'Marvolo',
  add column if not exists hero_headline text not null default 'Timeless Style. Made for Every Occasion.',
  add column if not exists hero_description text not null default 'Discover premium clothing designed for effortless confidence, comfort and everyday sophistication.',
  add column if not exists hero_primary_cta text not null default 'View Collection',
  add column if not exists hero_secondary_cta text not null default 'Order on WhatsApp';

update public.site_settings
set
  hero_eyebrow = coalesce(nullif(hero_eyebrow, ''), 'Marvolo'),
  hero_headline = coalesce(nullif(hero_headline, ''), 'Timeless Style. Made for Every Occasion.'),
  hero_description = coalesce(nullif(hero_description, ''), 'Discover premium clothing designed for effortless confidence, comfort and everyday sophistication.'),
  hero_primary_cta = coalesce(nullif(hero_primary_cta, ''), 'View Collection'),
  hero_secondary_cta = coalesce(nullif(hero_secondary_cta, ''), 'Order on WhatsApp')
where id = 1;
