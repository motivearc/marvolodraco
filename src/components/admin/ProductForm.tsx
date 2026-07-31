import { useState, type FormEvent } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import type { Product, ProductCategory, ProductColour } from '../../types/product'
import { PRODUCT_CATEGORIES } from '../../types/content'
import { ImageField } from './ImageField'

type ProductFormProps = {
  product: Product
  onSave: (product: Product) => Promise<void> | void
  onCancel: () => void
  saving?: boolean
}

function parseList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function ProductForm({
  product,
  onSave,
  onCancel,
  saving = false,
}: ProductFormProps) {
  const [draft, setDraft] = useState<Product>(structuredClone(product))
  const [sizesText, setSizesText] = useState(product.sizes.join(', '))
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function updateColour(index: number, patch: Partial<ProductColour>) {
    const colours = draft.colours.map((colour, i) =>
      i === index ? { ...colour, ...patch } : colour,
    )
    update('colours', colours)
  }

  function updateGalleryImage(index: number, value: string) {
    const images = [...draft.images]
    images[index] = value
    update('images', images)
    if (index === 0) update('mainImage', value)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const sizes = parseList(sizesText)
    const images = draft.images.filter(Boolean)
    const mainImage = draft.mainImage || images[0] || ''

    if (!draft.name.trim()) return
    if (!mainImage) return

    setSubmitting(true)
    try {
      await onSave({
        ...draft,
        name: draft.name.trim(),
        description: draft.description.trim(),
        material: draft.material.trim(),
        careInstructions: draft.careInstructions.trim(),
        sizes: sizes.length ? sizes : ['M'],
        images: images.length ? images : [mainImage],
        mainImage,
        colours: draft.colours.filter((colour) => colour.name.trim()),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 border border-line bg-cream p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.16em] text-stone uppercase">
            {product.id}
          </p>
          <h3 className="font-display text-2xl font-medium text-ink">
            Edit product
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm p-2 text-stone transition hover:bg-cream-dark hover:text-ink"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Name
          </span>
          <input
            required
            value={draft.name}
            onChange={(event) => update('name', event.target.value)}
            className="w-full border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Category
          </span>
          <select
            value={draft.category}
            onChange={(event) =>
              update('category', event.target.value as ProductCategory)
            }
            className="w-full border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-ink"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Price (RM)
          </span>
          <input
            required
            type="number"
            min={0}
            step={1}
            value={draft.price}
            onChange={(event) => update('price', Number(event.target.value))}
            className="w-full border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Sizes (comma-separated)
          </span>
          <input
            value={sizesText}
            onChange={(event) => setSizesText(event.target.value)}
            placeholder="S, M, L, XL"
            className="w-full border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
          Description
        </span>
        <textarea
          rows={3}
          value={draft.description}
          onChange={(event) => update('description', event.target.value)}
          className="w-full border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Material
          </span>
          <input
            value={draft.material}
            onChange={(event) => update('material', event.target.value)}
            className="w-full border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Care instructions
          </span>
          <input
            value={draft.careInstructions}
            onChange={(event) => update('careInstructions', event.target.value)}
            className="w-full border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-5">
        {(
          [
            ['featured', 'Featured'],
            ['newArrival', 'New arrival'],
            ['available', 'Available'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={draft[key]}
              onChange={(event) => update(key, event.target.checked)}
              className="size-4 accent-ink"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Colours
          </p>
          <button
            type="button"
            onClick={() =>
              update('colours', [
                ...draft.colours,
                { name: 'New colour', hex: '#8C867C' },
              ])
            }
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.12em] text-ink uppercase"
          >
            <Plus className="size-3.5" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {draft.colours.map((colour, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                value={colour.hex}
                onChange={(event) =>
                  updateColour(index, { hex: event.target.value })
                }
                className="h-10 w-12 cursor-pointer border border-line bg-cream p-1"
              />
              <input
                value={colour.name}
                onChange={(event) =>
                  updateColour(index, { name: event.target.value })
                }
                className="min-w-0 flex-1 border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
              <button
                type="button"
                onClick={() =>
                  update(
                    'colours',
                    draft.colours.filter((_, i) => i !== index),
                  )
                }
                className="p-2 text-stone hover:text-ink"
                aria-label="Remove colour"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Gallery images
          </p>
          <button
            type="button"
            onClick={() => update('images', [...draft.images, ''])}
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.12em] text-ink uppercase"
          >
            <Plus className="size-3.5" />
            Add image
          </button>
        </div>
        {draft.images.map((image, index) => (
          <div key={index} className="relative border border-line p-4">
            <ImageField
              label={index === 0 ? 'Main image' : `Image ${index + 1}`}
              value={image}
              onChange={(value) => updateGalleryImage(index, value)}
            />
            {draft.images.length > 1 ? (
              <button
                type="button"
                onClick={() => {
                  const images = draft.images.filter((_, i) => i !== index)
                  update('images', images)
                  if (index === 0) update('mainImage', images[0] ?? '')
                }}
                className="absolute top-3 right-3 p-1.5 text-stone hover:text-ink"
                aria-label="Remove image"
              >
                <Trash2 className="size-4" />
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={saving || submitting}
          className="bg-ink px-5 py-3 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft disabled:opacity-60"
        >
          {saving || submitting ? 'Saving…' : 'Save product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-ink px-5 py-3 text-xs font-semibold tracking-[0.16em] text-ink uppercase transition hover:bg-cream-dark"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
