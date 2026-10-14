import { brand } from '../data/brand'
import { lookbookImages as defaultLookbook } from '../data/content'
import { products as defaultProducts } from '../data/products'
import { requireSupabase } from '../lib/supabase'
import type {
  CatalogueCategory,
  FaqItem,
  HeroContent,
  LookbookImage,
  SiteContent,
  SizeGuideChart,
  WhatsAppContact,
  WhatsAppSettings,
} from '../types/content'
import { WHATSAPP_SLOT_COUNT } from '../types/content'
import {
  DEFAULT_CATEGORIES,
  normalizeCategories,
} from '../utils/categories'
import {
  createDefaultFaqs,
  normalizeFaqs,
  sanitizeFaqs,
} from '../utils/faqs'
import type { ProductRow, SiteSettingsRow } from '../types/database'
import type { Product } from '../types/product'
import {
  createDefaultSizeGuides,
  normalizeSizeGuides,
  sanitizeSizeGuides,
} from '../utils/sizeGuides'
import { normalizeWhatsAppNumber } from '../utils/whatsapp'

export const defaultHeroImages: string[] = []

export const defaultHero: HeroContent = {
  eyebrow: brand.name,
  headline: brand.tagline,
  description: brand.description,
  primaryCta: 'View Collection',
  secondaryCta: 'Order on WhatsApp',
  images: [],
}

export const defaultWhatsApp: WhatsAppSettings = {
  contacts: brand.whatsappContacts.map((contact) => ({ ...contact })),
  activeIndex: 0,
}

export const fallbackContent: SiteContent = {
  products: structuredClone(defaultProducts),
  categories: DEFAULT_CATEGORIES.map((category) => ({ ...category })),
  hero: { ...defaultHero, images: [...defaultHero.images] },
  aboutImage: brand.aboutImage,
  lookbookImages: [...defaultLookbook],
  whatsapp: {
    contacts: defaultWhatsApp.contacts.map((contact) => ({ ...contact })),
    activeIndex: defaultWhatsApp.activeIndex,
  },
  sizeGuides: createDefaultSizeGuides(),
  faqs: createDefaultFaqs(),
}

/** Empty shell used while Supabase content loads — avoids flashing mockup images. */
export const bootContent: SiteContent = {
  products: [],
  categories: DEFAULT_CATEGORIES.map((category) => ({ ...category })),
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
  sizeGuides: createDefaultSizeGuides(),
  faqs: createDefaultFaqs(),
}

function emptyWhatsAppContact(index: number): WhatsAppContact {
  return {
    label: `Line ${index + 1}`,
    number: '',
    display: '',
    active: false,
  }
}

const WHATSAPP_ROTATION_KEY = 'marvolo.whatsapp.rotation'
let rotationCache: { signature: string; contact: WhatsAppContact } | null = null

function fallbackWhatsAppContact(): WhatsAppContact {
  return {
    label: 'Line 1',
    number: brand.whatsappNumber,
    display: brand.whatsappDisplay,
    active: true,
  }
}

export function normalizeWhatsAppSettings(
  contacts: unknown,
  activeIndex: unknown,
): WhatsAppSettings {
  const defaults = defaultWhatsApp.contacts
  const source = Array.isArray(contacts) ? contacts : []
  const hasExplicitActive = source.some(
    (row) =>
      !!row &&
      typeof row === 'object' &&
      typeof (row as Record<string, unknown>).active === 'boolean',
  )
  const parsedIndex =
    typeof activeIndex === 'number' && Number.isFinite(activeIndex)
      ? Math.trunc(activeIndex)
      : 0
  const clampedIndex = Math.min(
    Math.max(parsedIndex, 0),
    WHATSAPP_SLOT_COUNT - 1,
  )

  const normalized: WhatsAppContact[] = Array.from(
    { length: WHATSAPP_SLOT_COUNT },
    (_, index) => {
      const row = source[index]
      const fallback = defaults[index] ?? emptyWhatsAppContact(index)
      if (!row || typeof row !== 'object') {
        return {
          ...fallback,
          active: hasExplicitActive
            ? false
            : index === clampedIndex && Boolean(fallback.number),
        }
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
      const active = hasExplicitActive
        ? record.active === true && Boolean(number)
        : index === clampedIndex && Boolean(number)

      return { label, number, display, active }
    },
  )

  if (!normalized.some((contact) => contact.active && contact.number)) {
    const firstFilled = normalized.findIndex((contact) => contact.number)
    if (firstFilled >= 0) normalized[firstFilled].active = true
  }

  const resolvedIndex = normalized.findIndex((contact) => contact.active)

  return {
    contacts: normalized,
    activeIndex: resolvedIndex >= 0 ? resolvedIndex : 0,
  }
}

/** Numbers included in the storefront rotation. */
export function getActiveWhatsAppContacts(
  settings: WhatsAppSettings,
): WhatsAppContact[] {
  const active = settings.contacts.filter(
    (contact) => contact.active && contact.number,
  )
  if (active.length) return active
  const firstFilled = settings.contacts.find((contact) => contact.number)
  return firstFilled ? [firstFilled] : []
}

export function getActiveWhatsAppContact(
  settings: WhatsAppSettings,
): WhatsAppContact {
  return getActiveWhatsAppContacts(settings)[0] ?? fallbackWhatsAppContact()
}

/**
 * Picks the next active number once per visit.
 * Later reads in the same page keep that number so every order button matches.
 */
export function getRotatingWhatsAppContact(
  settings: WhatsAppSettings,
): WhatsAppContact {
  const pool = getActiveWhatsAppContacts(settings)
  if (!pool.length) return fallbackWhatsAppContact()

  const signature = pool.map((contact) => contact.number).join('|')
  if (rotationCache?.signature === signature) return rotationCache.contact

  let cursor = 0
  if (pool.length > 1 && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(WHATSAPP_ROTATION_KEY)
      const parsed = raw ? Number.parseInt(raw, 10) : 0
      cursor = Number.isFinite(parsed) ? parsed : 0
      localStorage.setItem(
        WHATSAPP_ROTATION_KEY,
        String((cursor + 1) % pool.length),
      )
    } catch {
      cursor = 0
    }
  }

  const contact = pool[((cursor % pool.length) + pool.length) % pool.length]
  rotationCache = { signature, contact }
  return contact
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
  return []
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
    // Empty string is intentional — admin can clear headline / supporting text.
    headline: settings.hero_headline ?? defaultHero.headline,
    description: settings.hero_description ?? defaultHero.description,
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

  const loadedProducts = (productsResult.data ?? []).map(mapProduct)
  const products = loadedProducts.length
    ? loadedProducts
    : structuredClone(defaultProducts)
  const settings = settingsResult.data
  const lookbookImages: LookbookImage[] = (lookbookResult.data ?? []).map(
    (row) => ({
      id: row.id,
      src: row.src,
      alt: row.alt,
      span: row.span,
      focusX: Number.isFinite(Number(row.focus_x)) ? Number(row.focus_x) : 50,
      focusY: Number.isFinite(Number(row.focus_y)) ? Number(row.focus_y) : 50,
    }),
  )

  return {
    products,
    categories: normalizeCategories(
      settings?.product_categories,
      products.map((product) => product.category),
    ),
    hero: mapHero(settings),
    aboutImage: settings?.about_image ?? brand.aboutImage,
    lookbookImages: lookbookImages.length
      ? lookbookImages
      : [...defaultLookbook],
    whatsapp: mapWhatsApp(settings),
    sizeGuides: normalizeSizeGuides(settings?.size_guides),
    faqs: normalizeFaqs(settings?.faqs),
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

  if (error) throw new Error(formatSaveError(error.message))
}

export async function updateProductCategories(
  categories: CatalogueCategory[],
): Promise<void> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('site_settings')
    .update({ product_categories: categories })
    .eq('id', 1)
    .select('id')

  if (error) throw new Error(formatSaveError(error.message))
  if (!data?.length) {
    throw new Error(
      'Site settings are missing. Open the Site tab and save once, then try again.',
    )
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function reorderProducts(ids: string[]): Promise<void> {
  const client = requireSupabase()
  const results = await Promise.all(
    ids.map((id, index) =>
      client.from('products').update({ sort_order: index + 1 }).eq('id', id),
    ),
  )
  const failed = results.find((result) => result.error)
  if (failed?.error) throw new Error(formatSaveError(failed.error.message))
}

export async function updateSiteSettings(input: {
  hero?: HeroContent
  aboutImage?: string
  whatsapp?: WhatsAppSettings
  sizeGuides?: SizeGuideChart[]
  faqs?: FaqItem[]
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
  const sizeGuides =
    input.sizeGuides !== undefined
      ? sanitizeSizeGuides(input.sizeGuides)
      : undefined
  const faqs =
    input.faqs !== undefined ? sanitizeFaqs(input.faqs) : undefined

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
    ...(sizeGuides !== undefined ? { size_guides: sizeGuides } : {}),
    ...(faqs !== undefined ? { faqs } : {}),
  }

  const { error } = await client
    .from('site_settings')
    .upsert(withExtras, { onConflict: 'id' })

  if (!error) return

  const message = error.message.toLowerCase()
  if (
    message.includes('size_guides') &&
    (message.includes('column') || message.includes('schema cache'))
  ) {
    throw new Error(
      'Size guide column is missing. Run supabase/migrate-size-guides.sql in the Supabase SQL Editor, then try again.',
    )
  }
  if (
    message.includes('faqs') &&
    (message.includes('column') || message.includes('schema cache'))
  ) {
    throw new Error(
      'FAQ column is missing. Run supabase/migrate-faqs.sql in the Supabase SQL Editor, then try again.',
    )
  }

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
  if (
    lower.includes('product_categories') ||
    lower.includes('products_category_check')
  ) {
    return 'Custom categories are not enabled yet. Run supabase/migrate-categories.sql in the Supabase SQL Editor, then try again.'
  }
  if (lower.includes('size_guides')) {
    return 'Size guide column is missing. Run supabase/migrate-size-guides.sql in the Supabase SQL Editor, then try again.'
  }
  if (lower.includes('faqs')) {
    return 'FAQ column is missing. Run supabase/migrate-faqs.sql in the Supabase SQL Editor, then try again.'
  }
  if (lower.includes('focus_x') || lower.includes('focus_y')) {
    return 'Lookbook focus columns are missing. Run supabase/migrate-lookbook-focus.sql in the Supabase SQL Editor, then try again.'
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
    focus_x: Number.isFinite(image.focusX) ? image.focusX : 50,
    focus_y: Number.isFinite(image.focusY) ? image.focusY : 50,
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
    focusX: Number.isFinite(Number(row.focus_x)) ? Number(row.focus_x) : 50,
    focusY: Number.isFinite(Number(row.focus_y)) ? Number(row.focus_y) : 50,
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
  const sizeGuides = createDefaultSizeGuides()
  const faqs = createDefaultFaqs()

  try {
    await updateSiteSettings({
      hero,
      aboutImage: brand.aboutImage,
      whatsapp,
      sizeGuides,
      faqs,
    })
  } catch (err) {
    const message = (err instanceof Error ? err.message : '').toLowerCase()
    const missingSizeGuides = message.includes('size guide column is missing')
    const missingFaqs = message.includes('faq column is missing')
    if (!missingSizeGuides && !missingFaqs) throw err

    try {
      await updateSiteSettings({
        hero,
        aboutImage: brand.aboutImage,
        whatsapp,
        ...(missingSizeGuides ? {} : { sizeGuides }),
        ...(missingFaqs ? {} : { faqs }),
      })
    } catch (inner) {
      const innerMessage = (
        inner instanceof Error ? inner.message : ''
      ).toLowerCase()
      if (
        innerMessage.includes('size guide column is missing') ||
        innerMessage.includes('faq column is missing')
      ) {
        await updateSiteSettings({
          hero,
          aboutImage: brand.aboutImage,
          whatsapp,
        })
      } else {
        throw inner
      }
    }
  }

  const categories = DEFAULT_CATEGORIES.map((category) => ({ ...category }))
  try {
    await updateProductCategories(categories)
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    if (!message.toLowerCase().includes('custom categories are not enabled')) {
      throw err
    }
  }

  const lookbookImages = await replaceLookbookImages([...defaultLookbook])

  return {
    products: structuredClone(defaultProducts),
    categories,
    hero,
    aboutImage: brand.aboutImage,
    lookbookImages,
    whatsapp,
    sizeGuides,
    faqs,
  }
}
