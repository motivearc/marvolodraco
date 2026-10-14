-- Focal point for lookbook crop framing (object-position %).
-- Run in the Supabase SQL Editor, then save lookbook images again from /admin.

alter table public.lookbook_images
  add column if not exists focus_x numeric not null default 50
    check (focus_x >= 0 and focus_x <= 100),
  add column if not exists focus_y numeric not null default 50
    check (focus_y >= 0 and focus_y <= 100);

update public.lookbook_images
set
  focus_x = coalesce(focus_x, 50),
  focus_y = coalesce(focus_y, 50);
