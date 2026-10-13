import type { Product } from './product'

export type LookbookImage = {
  id?: string
  src: string
  alt: string
  span: 'tall' | 'wide' | 'normal'
}

export type HeroContent = {
  eyebrow: string
  headline: string
  description: string
  primaryCta: string
  secondaryCta: string
  images: string[]
}

export type WhatsAppContact = {
  label: string
  number: string
  display: string
  active: boolean
}

export type WhatsAppSettings = {
  contacts: WhatsAppContact[]
  /** First active contact. Kept so older rows still have a single index. */
  activeIndex: number
}

export type CatalogueCategory = {
  id: string
  label: string
}

export type SizeGuideColumn = {
  id: string
  label: string
}

export type SizeGuideRow = {
  size: string
  values: Record<string, string>
}

export type SizeGuideChart = {
  id: string
  label: string
  /** Product categories that should open this chart in the product modal. */
  categoryIds: string[]
  columns: SizeGuideColumn[]
  rows: SizeGuideRow[]
}

export type FaqItem = {
  question: string
  answer: string
}

export type SiteContent = {
  products: Product[]
  categories: CatalogueCategory[]
  hero: HeroContent
  aboutImage: string
  lookbookImages: LookbookImage[]
  whatsapp: WhatsAppSettings
  sizeGuides: SizeGuideChart[]
  faqs: FaqItem[]
}

export const WHATSAPP_SLOT_COUNT = 3

export const LOOKBOOK_SPANS = ['normal', 'tall', 'wide'] as const
