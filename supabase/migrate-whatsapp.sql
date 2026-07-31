-- Add WhatsApp contact slots to site_settings.
-- Run in Supabase SQL Editor after schema.sql (or on an existing project).

alter table public.site_settings
  add column if not exists whatsapp_contacts jsonb not null default '[
    {"label":"Line 1","number":"60123456789","display":"+60 12-345 6789"},
    {"label":"Line 2","number":"","display":""},
    {"label":"Line 3","number":"","display":""}
  ]'::jsonb,
  add column if not exists whatsapp_active_index integer not null default 0;

update public.site_settings
set
  whatsapp_contacts = coalesce(
    nullif(whatsapp_contacts, '[]'::jsonb),
    '[
      {"label":"Line 1","number":"60123456789","display":"+60 12-345 6789"},
      {"label":"Line 2","number":"","display":""},
      {"label":"Line 3","number":"","display":""}
    ]'::jsonb
  ),
  whatsapp_active_index = coalesce(whatsapp_active_index, 0)
where id = 1;
