export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ProductColourRow = {
  name: string
  hex: string
}

export type ProductRow = {
  id: string
  name: string
  category: string
  description: string
  price: number
  main_image: string
  images: string[]
  sizes: string[]
  colours: ProductColourRow[]
  material: string
  care_instructions: string
  featured: boolean
  new_arrival: boolean
  available: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export type WhatsAppContactRow = {
  label: string
  number: string
  display: string
  active?: boolean
}

export type SiteSettingsRow = {
  id: number
  hero_image: string
  hero_images?: string[]
  about_image: string
  hero_eyebrow: string
  hero_headline: string
  hero_description: string
  hero_primary_cta: string
  hero_secondary_cta: string
  whatsapp_contacts?: WhatsAppContactRow[]
  whatsapp_active_index?: number
  product_categories?: { id: string; label: string }[]
  size_guides?: unknown
  faqs?: unknown
  updated_at?: string
}

export type LookbookImageRow = {
  id: string
  src: string
  alt: string
  span: 'tall' | 'wide' | 'normal'
  sort_order: number
  created_at?: string
}

export type ReviewStatus = 'pending' | 'approved'

export type ReviewRow = {
  id: string
  name: string
  rating: number
  body: string
  status: ReviewStatus
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow
        Insert: Omit<ProductRow, 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ProductRow>
        Relationships: []
      }
      site_settings: {
        Row: SiteSettingsRow
        Insert: Omit<SiteSettingsRow, 'updated_at'> & { updated_at?: string }
        Update: Partial<SiteSettingsRow>
        Relationships: []
      }
      lookbook_images: {
        Row: LookbookImageRow
        Insert: Omit<LookbookImageRow, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<LookbookImageRow>
        Relationships: []
      }
      reviews: {
        Row: ReviewRow
        Insert: {
          id?: string
          name: string
          rating: number
          body: string
          status?: ReviewStatus
          created_at?: string
        }
        Update: Partial<Omit<ReviewRow, 'id'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
