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
}

export type WhatsAppSettings = {
  contacts: WhatsAppContact[]
  activeIndex: number
}

export type SiteContent = {
  products: Product[]
  hero: HeroContent
  aboutImage: string
  lookbookImages: LookbookImage[]
  whatsapp: WhatsAppSettings
}

export const WHATSAPP_SLOT_COUNT = 3

export const PRODUCT_CATEGORIES = [
  'shirts',
  't-shirts',
  'pants',
  'outerwear',
] as const

export const LOOKBOOK_SPANS = ['normal', 'tall', 'wide'] as const
