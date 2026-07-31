import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  bootContent,
  deleteProduct as deleteProductRemote,
  fallbackContent,
  fetchSiteContent,
  getActiveWhatsAppContact,
  replaceLookbookImages,
  resetSiteContent,
  updateSiteSettings as updateSiteSettingsRemote,
  upsertProduct as upsertProductRemote,
} from '../services/contentService'
import type {
  HeroContent,
  LookbookImage,
  SiteContent,
  WhatsAppContact,
  WhatsAppSettings,
} from '../types/content'
import type { Product } from '../types/product'

type ContentContextValue = {
  configured: boolean
  loading: boolean
  saving: boolean
  error: string | null
  content: SiteContent
  products: Product[]
  hero: HeroContent
  aboutImage: string
  lookbookImages: LookbookImage[]
  whatsapp: WhatsAppSettings
  activeWhatsApp: WhatsAppContact
  refresh: () => Promise<void>
  upsertProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  updateSiteContent: (input: {
    hero?: HeroContent
    aboutImage?: string
    lookbookImages?: LookbookImage[]
    whatsapp?: WhatsAppSettings
  }) => Promise<void>
  resetContent: () => Promise<void>
  clearError: () => void
}

const ContentContext = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() =>
    structuredClone(isSupabaseConfigured ? bootContent : fallbackContent),
  )
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setContent(structuredClone(fallbackContent))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const next = await fetchSiteContent()
      setContent(next)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load content from Supabase.',
      )
      // Keep boot/previous content — do not flash Unsplash mockups on failure.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function runMutation(action: () => Promise<void>) {
    setSaving(true)
    setError(null)
    try {
      await action()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save changes.'
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const upsertProduct = async (product: Product) => {
    await runMutation(async () => {
      const existingIndex = content.products.findIndex(
        (item) => item.id === product.id,
      )
      const sortOrder =
        existingIndex >= 0 ? existingIndex + 1 : content.products.length + 1
      await upsertProductRemote(product, sortOrder)
      setContent((prev) => {
        if (existingIndex === -1) {
          return { ...prev, products: [...prev.products, product] }
        }
        const products = [...prev.products]
        products[existingIndex] = product
        return { ...prev, products }
      })
    })
  }

  const deleteProduct = async (id: string) => {
    await runMutation(async () => {
      await deleteProductRemote(id)
      setContent((prev) => ({
        ...prev,
        products: prev.products.filter((product) => product.id !== id),
      }))
    })
  }

  const updateSiteContent = async (input: {
    hero?: HeroContent
    aboutImage?: string
    lookbookImages?: LookbookImage[]
    whatsapp?: WhatsAppSettings
  }) => {
    await runMutation(async () => {
      const nextHero = input.hero ?? content.hero
      const nextAbout = input.aboutImage ?? content.aboutImage
      const nextWhatsApp = input.whatsapp ?? content.whatsapp
      const shouldUpdateSettings =
        input.hero !== undefined ||
        input.aboutImage !== undefined ||
        input.whatsapp !== undefined

      if (shouldUpdateSettings) {
        await updateSiteSettingsRemote({
          hero: nextHero,
          aboutImage: nextAbout,
          whatsapp: nextWhatsApp,
        })
        setContent((prev) => ({
          ...prev,
          hero: nextHero,
          aboutImage: nextAbout,
          whatsapp: nextWhatsApp,
        }))
      }

      if (input.lookbookImages !== undefined) {
        try {
          const lookbookImages = await replaceLookbookImages(
            input.lookbookImages,
          )
          setContent((prev) => ({ ...prev, lookbookImages }))
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Failed to save lookbook.'
          throw new Error(
            shouldUpdateSettings
              ? `Site settings saved, but lookbook failed: ${message}`
              : message,
          )
        }
      }
    })
  }

  const resetContent = async () => {
    await runMutation(async () => {
      const next = await resetSiteContent()
      setContent(next)
    })
  }

  return (
    <ContentContext.Provider
      value={{
        configured: isSupabaseConfigured,
        loading,
        saving,
        error,
        content,
        products: content.products,
        hero: content.hero,
        aboutImage: content.aboutImage,
        lookbookImages: content.lookbookImages,
        whatsapp: content.whatsapp,
        activeWhatsApp: getActiveWhatsAppContact(content.whatsapp),
        refresh,
        upsertProduct,
        deleteProduct,
        updateSiteContent,
        resetContent,
        clearError: () => setError(null),
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return context
}
