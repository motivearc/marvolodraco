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
  getRotatingWhatsAppContact,
  replaceLookbookImages,
  resetSiteContent,
  updateProductCategories as updateProductCategoriesRemote,
  updateSiteSettings as updateSiteSettingsRemote,
  reorderProducts as reorderProductsRemote,
  upsertProduct as upsertProductRemote,
} from '../services/contentService'
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
import type { Product } from '../types/product'
import { slugifyCategory } from '../utils/categories'

type ContentContextValue = {
  configured: boolean
  loading: boolean
  saving: boolean
  error: string | null
  content: SiteContent
  products: Product[]
  categories: CatalogueCategory[]
  hero: HeroContent
  aboutImage: string
  lookbookImages: LookbookImage[]
  whatsapp: WhatsAppSettings
  sizeGuides: SizeGuideChart[]
  faqs: FaqItem[]
  activeWhatsApp: WhatsAppContact
  refresh: () => Promise<void>
  upsertProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  reorderProducts: (orderedIds: string[]) => Promise<void>
  addCategory: (label: string) => Promise<CatalogueCategory>
  removeCategory: (id: string) => Promise<void>
  updateSiteContent: (input: {
    hero?: HeroContent
    aboutImage?: string
    lookbookImages?: LookbookImage[]
    whatsapp?: WhatsAppSettings
    sizeGuides?: SizeGuideChart[]
    faqs?: FaqItem[]
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
      // Keep boot/previous content on failure.
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

  const reorderProducts = async (orderedIds: string[]) => {
    const snapshot = content.products
    const rank = new Map(orderedIds.map((id, index) => [id, index]))
    const products = [...snapshot].sort((a, b) => {
      const left = rank.get(a.id) ?? Number.MAX_SAFE_INTEGER
      const right = rank.get(b.id) ?? Number.MAX_SAFE_INTEGER
      return left - right
    })

    setContent((prev) => ({ ...prev, products }))

    try {
      await runMutation(async () => {
        await reorderProductsRemote(products.map((product) => product.id))
      })
    } catch (err) {
      setContent((prev) => ({ ...prev, products: snapshot }))
      throw err
    }
  }

  const addCategory = async (label: string) => {
    const trimmed = label.trim()
    if (!trimmed) throw new Error('Enter a category name.')

    const id = slugifyCategory(trimmed)
    const existing = content.categories.find(
      (category) =>
        category.id === id ||
        category.label.toLowerCase() === trimmed.toLowerCase(),
    )
    if (existing) return existing

    const created = { id, label: trimmed }
    const categories = [...content.categories, created]
    await runMutation(async () => {
      await updateProductCategoriesRemote(categories)
      setContent((prev) => ({ ...prev, categories }))
    })
    return created
  }

  const removeCategory = async (id: string) => {
    await runMutation(async () => {
      if (content.products.some((product) => product.category === id)) {
        throw new Error(
          'Move products out of this category before removing it.',
        )
      }
      if (content.categories.length <= 1) {
        throw new Error('Keep at least one category.')
      }

      const categories = content.categories.filter(
        (category) => category.id !== id,
      )
      await updateProductCategoriesRemote(categories)
      setContent((prev) => ({ ...prev, categories }))
    })
  }

  const updateSiteContent = async (input: {
    hero?: HeroContent
    aboutImage?: string
    lookbookImages?: LookbookImage[]
    whatsapp?: WhatsAppSettings
    sizeGuides?: SizeGuideChart[]
    faqs?: FaqItem[]
  }) => {
    await runMutation(async () => {
      const nextHero = input.hero ?? content.hero
      const nextAbout = input.aboutImage ?? content.aboutImage
      const nextWhatsApp = input.whatsapp ?? content.whatsapp
      const nextSizeGuides = input.sizeGuides ?? content.sizeGuides
      const nextFaqs = input.faqs ?? content.faqs
      const shouldUpdateSettings =
        input.hero !== undefined ||
        input.aboutImage !== undefined ||
        input.whatsapp !== undefined ||
        input.sizeGuides !== undefined ||
        input.faqs !== undefined

      if (shouldUpdateSettings) {
        await updateSiteSettingsRemote({
          hero: nextHero,
          aboutImage: nextAbout,
          whatsapp: nextWhatsApp,
          ...(input.sizeGuides !== undefined
            ? { sizeGuides: nextSizeGuides }
            : {}),
          ...(input.faqs !== undefined ? { faqs: nextFaqs } : {}),
        })
        setContent((prev) => ({
          ...prev,
          hero: nextHero,
          aboutImage: nextAbout,
          whatsapp: nextWhatsApp,
          ...(input.sizeGuides !== undefined
            ? { sizeGuides: nextSizeGuides }
            : {}),
          ...(input.faqs !== undefined ? { faqs: nextFaqs } : {}),
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
        categories: content.categories,
        hero: content.hero,
        aboutImage: content.aboutImage,
        lookbookImages: content.lookbookImages,
        whatsapp: content.whatsapp,
        sizeGuides: content.sizeGuides,
        faqs: content.faqs,
        activeWhatsApp: getRotatingWhatsAppContact(content.whatsapp),
        refresh,
        upsertProduct,
        deleteProduct,
        reorderProducts,
        addCategory,
        removeCategory,
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
