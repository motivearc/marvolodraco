-- Seed default Marvolo catalogue content.
-- Run after schema.sql. Safe to re-run (upserts / replaces lookbook).

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
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80',
  '[
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
  ]'::jsonb,
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1600&q=80',
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
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80"]'::jsonb,
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
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80"]'::jsonb,
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
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1506629082955-511b1aa782c0?auto=format&fit=crop&w=900&q=80"]'::jsonb,
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
  'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80"]'::jsonb,
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
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1563630423918-b58f07336ac5?auto=format&fit=crop&w=900&q=80"]'::jsonb,
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
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=900&q=80"]'::jsonb,
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
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1506629082955-511b1aa782c0?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80"]'::jsonb,
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
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80"]'::jsonb,
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
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1548126032-077b8ce795ee?auto=format&fit=crop&w=900&q=80"]'::jsonb,
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

insert into public.lookbook_images (src, alt, span, sort_order) values
(
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
  'Editorial look featuring tailored outerwear',
  'tall',
  1
),
(
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
  'Lifestyle street style lookbook image',
  'wide',
  2
),
(
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  'Model wearing contemporary smart-casual outfit',
  'normal',
  3
),
(
  'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80',
  'Close-up of premium fabric and silhouette',
  'normal',
  4
),
(
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80',
  'Menswear campaign lookbook portrait',
  'tall',
  5
),
(
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
  'Minimal fashion lookbook composition',
  'wide',
  6
);
