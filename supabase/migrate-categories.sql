-- Allow custom product categories.
-- Run in the Supabase SQL Editor on an existing project.

alter table public.products
  drop constraint if exists products_category_check;

alter table public.site_settings
  add column if not exists product_categories jsonb not null default '[
    {"id":"shirts","label":"Shirts"},
    {"id":"t-shirts","label":"T-Shirts"},
    {"id":"pants","label":"Pants"},
    {"id":"outerwear","label":"Outerwear"}
  ]'::jsonb;
