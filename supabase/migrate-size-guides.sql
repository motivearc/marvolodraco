-- Editable size guides (multiple charts for different garment types).
-- Run in the Supabase SQL Editor on an existing project.

alter table public.site_settings
  add column if not exists size_guides jsonb not null default '[
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
  ]'::jsonb;

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
where id = 1
  and (
    size_guides is null
    or jsonb_typeof(size_guides) <> 'array'
    or jsonb_array_length(size_guides) = 0
  );
