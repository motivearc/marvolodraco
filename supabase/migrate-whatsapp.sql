-- Add WhatsApp contact slots to site_settings.
-- Run in Supabase SQL Editor after schema.sql (or on an existing project).

alter table public.site_settings
  add column if not exists whatsapp_contacts jsonb not null default '[
    {"label":"Line 1","number":"60123456789","display":"+60 12-345 6789","active":true},
    {"label":"Line 2","number":"","display":"","active":false},
    {"label":"Line 3","number":"","display":"","active":false}
  ]'::jsonb,
  add column if not exists whatsapp_active_index integer not null default 0;

update public.site_settings
set
  whatsapp_contacts = coalesce(
    nullif(whatsapp_contacts, '[]'::jsonb),
    '[
      {"label":"Line 1","number":"60123456789","display":"+60 12-345 6789","active":true},
      {"label":"Line 2","number":"","display":"","active":false},
      {"label":"Line 3","number":"","display":"","active":false}
    ]'::jsonb
  ),
  whatsapp_active_index = coalesce(whatsapp_active_index, 0)
where id = 1;

-- Mark the previous single active line, and leave the others off.
-- Contacts that already have an "active" flag are left as saved.
update public.site_settings
set whatsapp_contacts = (
  select coalesce(
    jsonb_agg(
      case
        when elem ? 'active' then elem
        else elem || jsonb_build_object(
          'active',
          (ord - 1) = whatsapp_active_index
          and coalesce(elem->>'number', '') <> ''
        )
      end
      order by ord
    ),
    '[]'::jsonb
  )
  from jsonb_array_elements(whatsapp_contacts) with ordinality as t(elem, ord)
)
where id = 1;
