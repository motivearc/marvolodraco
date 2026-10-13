-- Editable FAQ items for the storefront.
-- Run in the Supabase SQL Editor on an existing project.

alter table public.site_settings
  add column if not exists faqs jsonb not null default '[
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
  ]'::jsonb;

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
where id = 1
  and (
    faqs is null
    or jsonb_typeof(faqs) <> 'array'
    or jsonb_array_length(faqs) = 0
  );
