import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import type { Product } from '../../types/product'
import { formatPrice } from '../../utils/whatsapp'
import { createEmptyProduct } from '../../utils/productDefaults'
import { ProductForm } from './ProductForm'

export function AdminProducts() {
  const { products, upsertProduct, deleteProduct, saving } = useContent()
  const [editing, setEditing] = useState<Product | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-medium text-ink">
            Products
          </h2>
          <p className="mt-1 text-sm text-ink-soft/80">
            Add, edit, or remove catalogue items. Changes sync to Supabase and
            the live storefront.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(createEmptyProduct())}
          className="inline-flex items-center gap-2 bg-ink px-4 py-3 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft"
        >
          <Plus className="size-4" />
          Add product
        </button>
      </div>

      {editing ? (
        <ProductForm
          product={editing}
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
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line last:border-0">
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
                <td className="px-4 py-3 capitalize text-ink-soft">
                  {product.category}
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
                  colSpan={5}
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
