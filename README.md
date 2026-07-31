# Marvolo Landing Page

Premium product catalogue for the Marvolo clothing brand. Customers browse products and place orders through WhatsApp — no cart, checkout, or payment gateway.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, Storage)

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy **Project URL** and **anon public** key into `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. In the Supabase SQL Editor, run:
   - `supabase/schema.sql` (tables, RLS, storage bucket)
   - `supabase/seed.sql` (default products and images)
4. Authentication → Users → **Add user** with an email and password for admin access.
5. Restart the Vite dev server, open `/admin`, and sign in.

Without `.env` credentials the storefront still renders local defaults; the admin dashboard shows setup instructions.

## Admin dashboard

Open `/admin` and sign in with your Supabase Auth user.

You can:

- Add, edit, and delete products (including gallery images)
- Change hero, about, and lookbook images
- Manage up to 3 WhatsApp numbers and pick which one is active for order links
- Upload images to the `media` storage bucket
- Reset everything to the seeded defaults

If the project already has a database, also run `supabase/migrate-whatsapp.sql` (or re-run `supabase/fix-site-content-save.sql`) so WhatsApp columns exist.

## Customise brand details

Edit `src/data/brand.ts` for name, copy, default WhatsApp numbers, Instagram, and email. Hero/about defaults also live there and in the seed file; the admin dashboard overrides images and WhatsApp numbers in Supabase.

## Manage products (source defaults)

Default catalogue lives in `src/data/products.ts` and is mirrored by `supabase/seed.sql`. Each product supports:

- ID, name, category, description, price
- Main image and gallery images
- Sizes and colours
- Material and care instructions
- Featured / new arrival / availability flags

Unavailable products show **Sold Out** and cannot be ordered.
