import type { CatalogueCategory } from '../types/content'

export const DEFAULT_CATEGORIES: CatalogueCategory[] = [
  { id: 'shirts', label: 'Shirts' },
  { id: 't-shirts', label: 'T-Shirts' },
  { id: 'pants', label: 'Pants' },
  { id: 'outerwear', label: 'Outerwear' },
]

export function slugifyCategory(label: string): string {
  const slug = label
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

  return slug || 'category'
}

export function categoryLabel(
  categories: CatalogueCategory[],
  id: string,
): string {
  return categories.find((category) => category.id === id)?.label ?? id
}

function labelFromId(id: string): string {
  return id
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function normalizeCategories(
  value: unknown,
  productCategoryIds: string[] = [],
): CatalogueCategory[] {
  const parsed: CatalogueCategory[] = []

  if (Array.isArray(value)) {
    for (const item of value) {
      if (!item || typeof item !== 'object') continue
      const record = item as Record<string, unknown>
      const label = typeof record.label === 'string' ? record.label.trim() : ''
      const rawId = typeof record.id === 'string' ? record.id : label
      const id = slugifyCategory(rawId)
      if (!id || !label || parsed.some((category) => category.id === id)) {
        continue
      }
      parsed.push({ id, label })
    }
  }

  const categories = parsed.length
    ? parsed
    : DEFAULT_CATEGORIES.map((category) => ({ ...category }))

  for (const rawId of productCategoryIds) {
    const id = rawId.trim()
    if (!id || categories.some((category) => category.id === id)) continue
    categories.push({ id, label: labelFromId(id) })
  }

  return categories
}
