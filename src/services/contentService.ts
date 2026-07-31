import { brand } from '../data/brand'
import { lookbookImages as defaultLookbook } from '../data/content'
import { products as defaultProducts } from '../data/products'
import { requireSupabase } from '../lib/supabase'
import type {
  HeroContent,
  LookbookImage,
  SiteContent,
  WhatsAppContact,
  WhatsAppSettings,
} from '../types/content'
import { WHATSAPP_SLOT_COUNT } from '../types/content'
import type { ProductRow, SiteSettingsRow } from '../types/database'
import type { Product } from '../types/product'
import { normalizeWhatsAppNumber } from '../utils/whatsapp'

export const defaultHeroImages = [
  brand.heroImage,
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80',
]

export const defaultHero: HeroContent = {
  eyebrow: brand.name,
  headline: brand.tagline,
  description: brand.description,
  primaryCta: 'View Collection',
  secondaryCta: 'Order on WhatsApp',
  images: [...defaultHeroImages],
}

export const defaultWhatsApp: WhatsAppSettings = {
  contacts: brand.whatsappContacts.map((contact) => ({ ...contact })),
  activeIndex: 0,
}

export const fallbackContent: SiteContent = {
  products: structuredClone(defaultProducts),
  hero: { ...defaultHero, images: [...defaultHero.images] },
  aboutImage: brand.aboutImage,
  lookbookImages: [...defaultLookbook],
  whatsapp: {
    contacts: defaultWhatsApp.contacts.map((contact) => ({ ...contact })),
    activeIndex: defaultWhatsApp.activeIndex,
  },
}

/** Empty shell used while Supabase content loads — avoids flashing mockup images. */
export const bootContent: SiteContent = {
  products: [],
  hero: {
    eyebrow: brand.name,
    headline: brand.tagline,
    description: brand.description,
    primaryCta: 'View Collection',
    secondaryCta: 'Order on WhatsApp',
    images: [],
  },
  aboutImage: '',
  lookbookImages: [],
  whatsapp: {
    contacts: defaultWhatsApp.contacts.map((contact) => ({ ...contact })),
    activeIndex: defaultWhatsApp.activeIndex,
  },
}

function emptyWhatsAppContact(index: number): WhatsAppContact {
  return {
    label: `Line ${index + 1}`,
    number: '',
    display: '',
  }
}

export function normalizeWhatsAppSettings(
  contacts: unknown,
  activeIndex: unknown,
): WhatsAppSettings {
  const defaults = defaultWhatsApp.contacts
  const source = Array.isArray(contacts) ? contacts : []
  const normalized: WhatsAppContact[] = Array.from(
    { length: WHATSAPP_SLOT_COUNT },
    (_, index) => {
      const row = source[index]
      const fallback = defaults[index] ?? emptyWhatsAppContact(index)
      if (!row || typeof row !== 'object') {
        return { ...fallback }
      }

      const record = row as Record<string, unknown>
      const label =
        typeof record.label === 'string' && record.label.trim()
          ? record.label.trim()
          : fallback.label
      const number =
        typeof record.number === 'string'
          ? normalizeWhatsAppNumber(record.number)
          : fallback.number
      const display =
        typeof record.display === 'string'
          ? record.display.trim()
          : fallback.display

      return { label, number, display }
    },
  )

  const parsedIndex =
    typeof activeIndex === 'number' && Number.isFinite(activeIndex)
      ? Math.trunc(activeIndex)
      : 0
  const clampedIndex = Math.min(
    Math.max(parsedIndex, 0),
    WHATSAPP_SLOT_COUNT - 1,
  )
  const filledIndex = normalized.findIndex((contact) => contact.number)
  const resolvedIndex =
    normalized[clampedIndex]?.number
      ? clampedIndex
      : filledIndex >= 0
        ? filledIndex
        : 0

  return {
    contacts: normalized,
    activeIndex: resolvedIndex,
  }
}

export function getActiveWhatsAppContact(
  settings: WhatsAppSettings,
): WhatsAppContact {
  const active = settings.contacts[settings.activeIndex]
  if (active?.number) return active
  const firstFilled = settings.contacts.find((contact) => contact.number)
  return (
    firstFilled ?? {
      label: 'Line 1',
      number: brand.whatsappNumber,
      display: brand.whatsappDisplay,
    }
  )
}

function normalizeHeroImages(
  images: unknown,
  fallbackImage?: string,
): string[] {
  if (Array.isArray(images)) {
    const cleaned = images.filter(
      (image): image is string =>
        typeof image === 'string' && image.trim().length > 0,
    )
    if (cleaned.length) return cleaned
  }
  if (fallbackImage?.trim()) return [fallbackImage]
  return [...defaultHeroImages]
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    price: Number(row.price),
    mainImage: row.main_image,
    images: Array.isArray(row.images) ? row.images : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    colours: Array.isArray(row.colours) ? row.colours : [],
    material: row.material,
    careInstructions: row.care_instructions,
    featured: row.featured,
    newArrival: row.new_arrival,
    available: row.available,
  }
}

function toProductRow(product: Product, sortOrder: number): ProductRow {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    main_image: product.mainImage,
    images: product.images,
    sizes: product.sizes,
    colours: product.colours,
    material: product.material,
    care_instructions: product.careInstructions,
    featured: product.featured,
    new_arrival: product.newArrival,
    available: product.available,
    sort_order: sortOrder,
  }
}

function mapHero(settings: SiteSettingsRow | null): HeroContent {
  if (!settings) {
    return { ...defaultHero, images: [...defaultHero.images] }
  }

  return {
    eyebrow: settings.hero_eyebrow || defaultHero.eyebrow,
    headline: settings.hero_headline || defaultHero.headline,
    description: settings.hero_description || defaultHero.description,
    primaryCta: settings.hero_primary_cta || defaultHero.primaryCta,
    secondaryCta: settings.hero_secondary_cta || defaultHero.secondaryCta,
    images: normalizeHeroImages(settings.hero_images, settings.hero_image),
  }
}

function mapWhatsApp(settings: SiteSettingsRow | null): WhatsAppSettings {
  if (!settings) {
    return {
      contacts: defaultWhatsApp.contacts.map((contact) => ({ ...contact })),
      activeIndex: defaultWhatsApp.activeIndex,
    }
  }

  return normalizeWhatsAppSettings(
    settings.whatsapp_contacts,
    settings.whatsapp_active_index,
  )
}

export async function fetchSiteContent(): Promise<SiteContent> {
  const client = requireSupabase()

  const [productsResult, settingsResult, lookbookResult] = await Promise.all([
    client.from('products').select('*').order('sort_order', { ascending: true }),
    client.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    client
      .from('lookbook_images')
      .select('*')
      .order('sort_order', { ascending: true }),
  ])

  if (productsResult.error) throw productsResult.error
  if (settingsResult.error) throw settingsResult.error
  if (lookbookResult.error) throw lookbookResult.error

  const products = (productsResult.data ?? []).map(mapProduct)
  const settings = settingsResult.data
  const lookbookImages: LookbookImage[] = (lookbookResult.data ?? []).map(
    (row) => ({
      id: row.id,
      src: row.src,
      alt: row.alt,
      span: row.span,
    }),
  )

  return {
    products: products.length ? products : structuredClone(defaultProducts),
    hero: mapHero(settings),
    aboutImage: settings?.about_image ?? brand.aboutImage,
    lookbookImages: lookbookImages.length
      ? lookbookImages
      : [...defaultLookbook],
    whatsapp: mapWhatsApp(settings),
  }
}

export async function upsertProduct(
  product: Product,
  sortOrder?: number,
): Promise<void> {
  const client = requireSupabase()
  const order =
    sortOrder ??
    (Number.parseInt(product.id.replace(/\D/g, ''), 10) || Date.now())

  const { error } = await client
    .from('products')
    .upsert(toProductRow(product, order), { onConflict: 'id' })

  if (error) throw error
}

export async function deleteProduct(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function updateSiteSettings(input: {
  hero?: HeroContent
  aboutImage?: string
  whatsapp?: WhatsAppSettings
}): Promise<void> {
  const client = requireSupabase()
  const hero = input.hero ?? {
    ...defaultHero,
    images: [...defaultHero.images],
  }
  const images = normalizeHeroImages(hero.images)
  const aboutImage = input.aboutImage ?? brand.aboutImage
  const whatsapp = normalizeWhatsAppSettings(
    input.whatsapp?.contacts ?? defaultWhatsApp.contacts,
    input.whatsapp?.activeIndex ?? defaultWhatsApp.activeIndex,
  )

  const basePayload = {
    id: 1,
    hero_image: images[0] ?? brand.heroImage,
    about_image: aboutImage,
    hero_eyebrow: hero.eyebrow,
    hero_headline: hero.headline,
    hero_description: hero.description,
    hero_primary_cta: hero.primaryCta,
    hero_secondary_cta: hero.secondaryCta,
  }

  const withExtras = {
    ...basePayload,
    hero_images: images,
    whatsapp_contacts: whatsapp.contacts,
    whatsapp_active_index: whatsapp.activeIndex,
  }

  const { error } = await client
    .from('site_settings')
    .upsert(withExtras, { onConflict: 'id' })

  if (!error) return

  const message = error.message.toLowerCase()
  const missingSliderColumn =
    message.includes('hero_images') &&
    (message.includes('column') || message.includes('schema cache'))
  const missingWhatsAppColumn =
    (message.includes('whatsapp_contacts') ||
      message.includes('whatsapp_active_index')) &&
    (message.includes('column') || message.includes('schema cache'))

  if (missingSliderColumn || missingWhatsAppColumn) {
    const fallbackPayload =
      missingSliderColumn && missingWhatsAppColumn
        ? basePayload
        : missingWhatsAppColumn
          ? { ...basePayload, hero_images: images }
          : {
              ...basePayload,
              hero_images: images,
              whatsapp_contacts: whatsapp.contacts,
              whatsapp_active_index: whatsapp.activeIndex,
            }

    // When only WhatsApp is missing, still try to save hero with slider.
    const payload = missingWhatsAppColumn
      ? missingSliderColumn
        ? basePayload
        : { ...basePayload, hero_images: images }
      : fallbackPayload

    const { error: fallbackError } = await client
      .from('site_settings')
      .upsert(payload, { onConflict: 'id' })

    if (fallbackError) {
      throw new Error(formatSaveError(fallbackError.message))
    }

    if (missingWhatsAppColumn) {
      throw new Error(
        'WhatsApp columns are missing. Run supabase/migrate-whatsapp.sql in the Supabase SQL Editor, then try again.',
      )
    }

    // Hero copy/image saved without slider column. Run migrate-hero-slider.sql
    // to persist multiple slides.
    return
  }

  throw new Error(formatSaveError(error.message))
}

function formatSaveError(message: string): string {
  const lower = message.toLowerCase()
  if (
    lower.includes('row-level security') ||
    lower.includes('rls') ||
    lower.includes('permission denied')
  ) {
    return 'Save blocked by Supabase security rules. Run supabase/fix-site-content-save.sql, set your user role to admin, then sign out and sign back in.'
  }
  if (lower.includes('hero_eyebrow') || lower.includes('hero_headline')) {
    return 'Hero text columns are missing. Run supabase/migrate-hero-copy.sql in the Supabase SQL Editor, then try again.'
  }
  if (
    lower.includes('whatsapp_contacts') ||
    lower.includes('whatsapp_active_index')
  ) {
    return 'WhatsApp columns are missing. Run supabase/migrate-whatsapp.sql in the Supabase SQL Editor, then try again.'
  }
  return message
}

export async function replaceLookbookImages(
  images: LookbookImage[],
): Promise<LookbookImage[]> {
  const client = requireSupabase()
  const cleaned = images.filter((image) => image.src.trim())

  const { data: existing, error: existingError } = await client
    .from('lookbook_images')
    .select('id')

  if (existingError) {
    throw new Error(formatSaveError(existingError.message))
  }

  if (existing?.length) {
    const { error: deleteError } = await client
      .from('lookbook_images')
      .delete()
      .in(
        'id',
        existing.map((row) => row.id),
      )

    if (deleteError) {
      throw new Error(formatSaveError(deleteError.message))
    }
  }

  if (cleaned.length === 0) return []

  const rows = cleaned.map((image, index) => ({
    src: image.src,
    alt: image.alt,
    span: image.span,
    sort_order: index + 1,
  }))

  const { data, error } = await client
    .from('lookbook_images')
    .insert(rows)
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(formatSaveError(error.message))

  return (data ?? []).map((row) => ({
    id: row.id,
    src: row.src,
    alt: row.alt,
    span: row.span,
  }))
}

export async function resetSiteContent(): Promise<SiteContent> {
  const client = requireSupabase()

  const { error: deleteProductsError } = await client
    .from('products')
    .delete()
    .neq('id', '')

  if (deleteProductsError) throw deleteProductsError

  const productRows = defaultProducts.map((product, index) =>
    toProductRow(product, index + 1),
  )

  const { error: insertProductsError } = await client
    .from('products')
    .insert(productRows)

  if (insertProductsError) throw insertProductsError

  const hero = { ...defaultHero, images: [...defaultHero.images] }
  const whatsapp = {
    contacts: defaultWhatsApp.contacts.map((contact) => ({ ...contact })),
    activeIndex: defaultWhatsApp.activeIndex,
  }

  await updateSiteSettings({
    hero,
    aboutImage: brand.aboutImage,
    whatsapp,
  })

  const lookbookImages = await replaceLookbookImages([...defaultLookbook])

  return {
    products: structuredClone(defaultProducts),
    hero,
    aboutImage: brand.aboutImage,
    lookbookImages,
    whatsapp,
  }
}
