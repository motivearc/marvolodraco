-- Seed default Marvolo catalogue content.
-- Run after schema.sql. Safe to re-run (upserts / replaces lookbook).
-- Image fields are left empty — upload real assets from the admin panel.

insert into public.site_settings (
  id,
  hero_image,
  hero_images,
  about_image,
  hero_eyebrow,
  hero_headline,
  hero_description,
  hero_primary_cta,
  hero_secondary_cta,
  whatsapp_contacts,
  whatsapp_active_index
)
values (
  1,
  '',
  '[]'::jsonb,
  '',
  'Marvolo',
  'Timeless Style. Made for Every Occasion.',
  'Discover premium clothing designed for effortless confidence, comfort and everyday sophistication.',
  'View Collection',
  'Order on WhatsApp',
  '[
    {"label":"Line 1","number":"60123456789","display":"+60 12-345 6789","active":true},
    {"label":"Line 2","number":"","display":"","active":false},
    {"label":"Line 3","number":"","display":"","active":false}
  ]'::jsonb,
  0
)
on conflict (id) do update set
  hero_image = excluded.hero_image,
  hero_images = excluded.hero_images,
  about_image = excluded.about_image,
  hero_eyebrow = excluded.hero_eyebrow,
  hero_headline = excluded.hero_headline,
  hero_description = excluded.hero_description,
  hero_primary_cta = excluded.hero_primary_cta,
  hero_secondary_cta = excluded.hero_secondary_cta,
  whatsapp_contacts = excluded.whatsapp_contacts,
  whatsapp_active_index = excluded.whatsapp_active_index;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'site_settings'
      and column_name = 'size_guides'
  ) then
    update public.site_settings
    set size_guides = '[
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
    ]'::jsonb
    where id = 1;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'site_settings'
      and column_name = 'faqs'
  ) then
    update public.site_settings
    set faqs = '[
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
    ]'::jsonb
    where id = 1;
  end if;
end $$;

insert into public.products (
  id, name, category, description, price, main_image, images, sizes, colours,
  material, care_instructions, featured, new_arrival, available, sort_order
) values
(
  'mv-001',
  'Linen Overshirt',
  'shirts',
  'A relaxed linen overshirt with a clean collar and soft structure. Layer over tees or wear open for an easy smart-casual look.',
  189,
  '',
  '[]'::jsonb,
  '["S","M","L","XL","XXL"]'::jsonb,
  '[{"name":"Sand","hex":"#C8B9A6"},{"name":"Ivory","hex":"#F2EDE6"},{"name":"Olive","hex":"#6B705C"}]'::jsonb,
  '100% European linen',
  'Gentle cold wash. Hang dry. Warm iron if needed.',
  true, true, true, 1
),
(
  'mv-002',
  'Essential Cotton Tee',
  't-shirts',
  'A refined everyday tee cut from dense combed cotton. Soft hand-feel with a clean crew neck and precise shoulder line.',
  89,
  '',
  '[]'::jsonb,
  '["S","M","L","XL","XXL"]'::jsonb,
  '[{"name":"White","hex":"#FFFFFF"},{"name":"Black","hex":"#1A1A1A"},{"name":"Stone","hex":"#A8A29E"}]'::jsonb,
  '220gsm combed cotton',
  'Machine wash cold. Do not tumble dry. Cool iron.',
  true, true, true, 2
),
(
  'mv-003',
  'Tailored Chino Trousers',
  'pants',
  'Streamlined chino trousers with a soft taper and comfortable mid-rise. Designed for all-day wear from desk to dinner.',
  219,
  '',
  '[]'::jsonb,
  '["S","M","L","XL","XXL"]'::jsonb,
  '[{"name":"Khaki","hex":"#B7A78D"},{"name":"Navy","hex":"#2C3E50"},{"name":"Charcoal","hex":"#4A4A4A"}]'::jsonb,
  '98% cotton, 2% elastane',
  'Machine wash cold inside out. Hang dry. Steam to refresh.',
  true, false, true, 3
),
(
  'mv-004',
  'Wool-Blend Overcoat',
  'outerwear',
  'An understated overcoat with a fluid drape and minimal lapel. Built for cooler evenings and polished layering.',
  489,
  '',
  '[]'::jsonb,
  '["S","M","L","XL"]'::jsonb,
  '[{"name":"Camel","hex":"#C19A6B"},{"name":"Black","hex":"#1A1A1A"}]'::jsonb,
  '70% wool, 30% polyester blend',
  'Dry clean only. Store on a wide hanger.',
  true, true, true, 4
),
(
  'mv-005',
  'Oxford Button-Down',
  'shirts',
  'A classic Oxford shirt with a soft collar and clean placket. The everyday foundation of a refined wardrobe.',
  169,
  '',
  '[]'::jsonb,
  '["S","M","L","XL","XXL"]'::jsonb,
  '[{"name":"Sky","hex":"#B8C9D6"},{"name":"White","hex":"#FFFFFF"},{"name":"Soft Pink","hex":"#E8D5D0"}]'::jsonb,
  '100% cotton Oxford',
  'Machine wash cold. Iron while slightly damp.',
  false, true, true, 5
),
(
  'mv-006',
  'Relaxed Merino Crew',
  't-shirts',
  'A fine-gauge merino crew knit that feels light against the skin. Breathable, temperature-regulating and quietly luxurious.',
  159,
  '',
  '[]'::jsonb,
  '["S","M","L","XL"]'::jsonb,
  '[{"name":"Oatmeal","hex":"#D9CBB8"},{"name":"Forest","hex":"#3D4F3F"},{"name":"Ink","hex":"#2B2B2B"}]'::jsonb,
  '100% extra-fine merino wool',
  'Hand wash cold or dry clean. Lay flat to dry.',
  true, false, true, 6
),
(
  'mv-007',
  'Wide-Leg Pleated Trousers',
  'pants',
  'Fluid wide-leg trousers with soft front pleats. A modern silhouette that moves with ease and photographs beautifully.',
  249,
  '',
  '[]'::jsonb,
  '["S","M","L","XL"]'::jsonb,
  '[{"name":"Ivory","hex":"#F0EBE3"},{"name":"Black","hex":"#1A1A1A"},{"name":"Taupe","hex":"#8B7E74"}]'::jsonb,
  '65% polyester, 30% rayon, 5% elastane',
  'Gentle wash cold. Hang dry. Steam lightly.',
  false, true, true, 7
),
(
  'mv-008',
  'Structured Blazer',
  'outerwear',
  'A soft-shouldered blazer with a lightly structured chest. Transition seamlessly from meetings to evenings out.',
  399,
  '',
  '[]'::jsonb,
  '["S","M","L","XL","XXL"]'::jsonb,
  '[{"name":"Charcoal","hex":"#3F3F3F"},{"name":"Navy","hex":"#1E2A3A"}]'::jsonb,
  'Wool-blend with satin lining',
  'Dry clean only. Steam between wears.',
  true, false, false, 8
),
(
  'mv-009',
  'Utility Field Jacket',
  'outerwear',
  'A lightweight field jacket with clean pocket detailing and a matte finish. Practical layering without visual noise.',
  329,
  '',
  '[]'::jsonb,
  '["S","M","L","XL","XXL"]'::jsonb,
  '[{"name":"Olive","hex":"#5C6648"},{"name":"Stone","hex":"#A39E93"}]'::jsonb,
  'Cotton-nylon technical blend',
  'Machine wash cold. Hang dry. Do not bleach.',
  false, true, true, 9
)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  price = excluded.price,
  main_image = excluded.main_image,
  images = excluded.images,
  sizes = excluded.sizes,
  colours = excluded.colours,
  material = excluded.material,
  care_instructions = excluded.care_instructions,
  featured = excluded.featured,
  new_arrival = excluded.new_arrival,
  available = excluded.available,
  sort_order = excluded.sort_order;

delete from public.lookbook_images;

do $$
begin
  if to_regclass('public.reviews') is null then
    return;
  end if;

  insert into public.reviews (id, name, rating, body, status, created_at)
  values
    (
      'a1111111-1111-4111-8111-111111111101',
      'Aisha Rahman',
      5,
      'The linen overshirt feels incredible and looks even better in person. Ordering through WhatsApp was simple and personal.',
      'approved',
      '2026-01-04T00:00:00Z'
    ),
    (
      'a1111111-1111-4111-8111-111111111102',
      'Daniel Tan',
      5,
      'Clean cuts, premium fabrics and a fit that works for everyday wear. Marvolo has become my go-to for smart-casual pieces.',
      'approved',
      '2026-01-03T00:00:00Z'
    ),
    (
      'a1111111-1111-4111-8111-111111111103',
      'Sofia Lim',
      5,
      'I love how understated everything feels. The quality is obvious and the team helped me choose the right size over WhatsApp.',
      'approved',
      '2026-01-02T00:00:00Z'
    ),
    (
      'a1111111-1111-4111-8111-111111111104',
      'Hafiz Omar',
      4,
      'Beautiful trousers and fast replies. The whole experience felt more thoughtful than a typical online shop.',
      'approved',
      '2026-01-01T00:00:00Z'
    )
  on conflict (id) do nothing;
end $$;
