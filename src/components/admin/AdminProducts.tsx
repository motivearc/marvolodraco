import { useState, type FormEvent } from 'react'
import { ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import type { Product } from '../../types/product'
import { categoryLabel, slugifyCategory } from '../../utils/categories'
import { formatPrice } from '../../utils/whatsapp'
import { createEmptyProduct } from '../../utils/productDefaults'
import { ProductForm } from './ProductForm'

export function AdminProducts() {
  const {
    products,
    categories,
    upsertProduct,
    deleteProduct,
    reorderProducts,
    addCategory,
    removeCategory,
    saving,
  } = useContent()
  const [editing, setEditing] = useState<Product | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [categoryMessage, setCategoryMessage] = useState<string | null>(null)

  function moveProduct(fromIndex: number, toIndex: number) {
    if (
      saving ||
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= products.length ||
      toIndex >= products.length
    ) {
      return
    }

    const next = [...products]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    void reorderProducts(next.map((product) => product.id)).catch(() => {
      // The error is shown in the admin banner.
    })
  }

  function handleAddCategory(event: FormEvent) {
    event.preventDefault()
    const name = categoryName.trim()
    if (!name) return
    const id = slugifyCategory(name)
    const alreadyExists = categories.some(
      (category) =>
        category.id === id ||
        category.label.toLowerCase() === name.toLowerCase(),
    )
    setCategoryMessage(null)
    void addCategory(name)
      .then(() => {
        setCategoryName('')
        setCategoryMessage(
          alreadyExists ? 'That category is already in the list.' : null,
        )
      })
      .catch((err: unknown) => {
        setCategoryMessage(
          err instanceof Error ? err.message : 'Could not add that category.',
        )
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-medium text-ink">
            Products
          </h2>
          <p className="mt-1 text-sm text-ink-soft/80">
            Add, edit, or remove catalogue items. Drag a row, or use the arrows,
            to set the order on the homepage. Changes sync to Supabase and the
            live storefront.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing(createEmptyProduct(categories[0]?.id ?? 'shirts'))
          }
          className="inline-flex items-center gap-2 bg-ink px-4 py-3 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft"
        >
          <Plus className="size-4" />
          Add product
        </button>
      </div>

      <section className="space-y-4 border border-line bg-cream p-5">
        <div>
          <h3 className="font-display text-2xl font-medium text-ink">
            Categories
          </h3>
          <p className="mt-1 text-sm text-ink-soft/80">
            Add a category here, then assign it to a product. New categories
            show up as filters on the homepage.
          </p>
        </div>
        <form onSubmit={handleAddCategory} className="flex flex-wrap gap-2">
          <input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="New category"
            className="min-w-48 flex-1 border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
          />
          <button
            type="submit"
            disabled={saving || !categoryName.trim()}
            className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft disabled:opacity-60"
          >
            <Plus className="size-4" />
            Add category
          </button>
        </form>
        {categoryMessage ? (
          <p
            className={`text-sm ${
              categoryMessage.startsWith('That category is already')
                ? 'text-ink-soft'
                : 'text-red-700'
            }`}
          >
            {categoryMessage}
          </p>
        ) : null}
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const usedBy = products.filter(
              (product) => product.category === category.id,
            ).length
            return (
              <li
                key={category.id}
                className="inline-flex items-center gap-2 border border-line bg-mist px-3 py-2 text-sm text-ink"
              >
                <span>{category.label}</span>
                <span className="text-xs text-stone">{usedBy}</span>
                <button
                  type="button"
                  disabled={saving || usedBy > 0 || categories.length <= 1}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Remove the “${category.label}” category?`,
                      )
                    ) {
                      void removeCategory(category.id).catch(() => {
                        // The error is shown in the admin banner.
                      })
                    }
                  }}
                  className="text-stone transition hover:text-ink disabled:opacity-30"
                  title={
                    usedBy > 0
                      ? 'Move products out of this category before removing it.'
                      : 'Remove category'
                  }
                  aria-label={`Remove ${category.label}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {editing ? (
        <ProductForm
          product={editing}
          categories={categories}
          onAddCategory={addCategory}
          saving={saving}
          onSave={async (product) => {
            await upsertProduct(product)
            setEditing(null)
          }}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      <div className="overflow-x-auto border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-mist text-xs tracking-[0.12em] text-ink-soft uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                onDragOver={(event) => {
                  if (!dragId || saving) return
                  event.preventDefault()
                  setOverId(product.id)
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  const fromId = event.dataTransfer.getData('text/plain') || dragId
                  const fromIndex = products.findIndex((item) => item.id === fromId)
                  moveProduct(fromIndex, index)
                  setDragId(null)
                  setOverId(null)
                }}
                className={`border-b border-line last:border-0 ${
                  overId === product.id && dragId !== product.id
                    ? 'bg-cream-dark'
                    : ''
                } ${dragId === product.id ? 'opacity-50' : ''}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span
                      draggable={!saving}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = 'move'
                        event.dataTransfer.setData('text/plain', product.id)
                        setDragId(product.id)
                      }}
                      onDragEnd={() => {
                        setDragId(null)
                        setOverId(null)
                      }}
                      className="cursor-grab p-1 text-stone active:cursor-grabbing"
                      aria-label={`Drag ${product.name} to a new position`}
                    >
                      <GripVertical className="size-4" />
                    </span>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        disabled={saving || index === 0}
                        onClick={() => moveProduct(index, index - 1)}
                        className="p-0.5 text-stone transition hover:text-ink disabled:opacity-30"
                        aria-label={`Move ${product.name} up`}
                      >
                        <ChevronUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        disabled={saving || index === products.length - 1}
                        onClick={() => moveProduct(index, index + 1)}
                        className="p-0.5 text-stone transition hover:text-ink disabled:opacity-30"
                        aria-label={`Move ${product.name} down`}
                      >
                        <ChevronDown className="size-4" />
                      </button>
                    </div>
                    <span className="w-5 text-center text-xs text-stone">
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.mainImage ? (
                      <img
                        src={product.mainImage}
                        alt=""
                        className="h-14 w-11 object-cover bg-cream-dark"
                      />
                    ) : (
                      <div className="h-14 w-11 bg-cream-dark" />
                    )}
                    <div>
                      <p className="font-medium text-ink">{product.name}</p>
                      <p className="text-xs text-stone">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {categoryLabel(categories, product.category)}
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {!product.available ? (
                      <span className="bg-ink px-2 py-0.5 text-[10px] tracking-wider text-cream uppercase">
                        Sold out
                      </span>
                    ) : null}
                    {product.featured ? (
                      <span className="bg-cream-dark px-2 py-0.5 text-[10px] tracking-wider text-ink uppercase">
                        Featured
                      </span>
                    ) : null}
                    {product.newArrival ? (
                      <span className="bg-cream-dark px-2 py-0.5 text-[10px] tracking-wider text-ink uppercase">
                        New
                      </span>
                    ) : null}
                    {product.available &&
                    !product.featured &&
                    !product.newArrival ? (
                      <span className="text-xs text-stone">Available</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(structuredClone(product))}
                      className="p-2 text-stone transition hover:bg-mist hover:text-ink"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete “${product.name}”? This cannot be undone.`,
                          )
                        ) {
                          void deleteProduct(product.id).then(() => {
                            if (editing?.id === product.id) setEditing(null)
                          })
                        }
                      }}
                      className="p-2 text-stone transition hover:bg-mist hover:text-ink"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-stone"
                >
                  No products yet. Add your first listing.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
