import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import type { Product } from '../types/product'
import { findSizeGuideForCategory } from '../utils/sizeGuides'
import { buildWhatsAppOrderUrl, formatPrice } from '../utils/whatsapp'

type ProductModalProps = {
  product: Product | null
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { activeWhatsApp, sizeGuides } = useContent()
  const online = useOnlineStatus()
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColour, setSelectedColour] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const sizeGuide = useMemo(
    () =>
      product
        ? findSizeGuideForCategory(sizeGuides, product.category)
        : null,
    [product, sizeGuides],
  )

  useEffect(() => {
    if (!product) return
    setActiveImage(0)
    setSelectedColour('')
    setSelectedSize('')
    setShowSizeGuide(false)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [product, onClose])

  if (!product) return null

  const canOrder =
    product.available && Boolean(selectedColour) && Boolean(selectedSize)

  const orderUrl = canOrder
    ? buildWhatsAppOrderUrl({
        phoneNumber: activeWhatsApp.number,
        productName: product.name,
        colour: selectedColour,
        size: selectedSize,
        price: product.price,
      })
    : undefined

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[60] flex items-end justify-center bg-ink/55 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="max-h-modal relative flex w-full max-w-5xl flex-col overflow-hidden bg-cream sm:rounded-sm"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close product details"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center bg-cream/90 text-ink backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        <div className="grid overflow-y-auto lg:grid-cols-2">
          <div className="bg-cream-dark">
            <div className="aspect-[4/5] overflow-hidden">
              {(product.images[activeImage] ?? product.mainImage) ? (
                <img
                  src={product.images[activeImage] ?? product.mainImage}
                  alt={`${product.name} view ${activeImage + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            {product.images.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto p-3">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-14 shrink-0 overflow-hidden border ${
                      activeImage === index ? 'border-ink' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col p-5 md:p-8">
            {!product.available ? (
              <span className="mb-3 inline-flex w-fit bg-ink px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-cream uppercase">
                Sold Out
              </span>
            ) : null}
            <h2
              id="product-modal-title"
              className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl"
            >
              {product.name}
            </h2>
            <p className="mt-2 text-lg text-ink-soft">{formatPrice(product.price)}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft/90">
              {product.description}
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="mb-2 text-xs font-medium tracking-[0.16em] text-stone uppercase">
                  Colour
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map((colour) => (
                    <button
                      key={colour.name}
                      type="button"
                      onClick={() => setSelectedColour(colour.name)}
                      disabled={!product.available}
                      className={`inline-flex items-center gap-2 border px-3 py-2 text-xs tracking-wide transition ${
                        selectedColour === colour.name
                          ? 'border-ink bg-ink text-cream'
                          : 'border-line text-ink-soft hover:border-ink'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-line"
                        style={{ backgroundColor: colour.hex }}
                      />
                      {colour.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium tracking-[0.16em] text-stone uppercase">
                    Size
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide((value) => !value)}
                    className="text-xs tracking-wide text-ink underline underline-offset-4"
                  >
                    {showSizeGuide ? 'Hide size guide' : 'Size guide'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      disabled={!product.available}
                      className={`min-w-12 border px-3 py-2 text-xs tracking-wide transition ${
                        selectedSize === size
                          ? 'border-ink bg-ink text-cream'
                          : 'border-line text-ink-soft hover:border-ink'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {showSizeGuide ? (
                sizeGuide ? (
                  <div className="overflow-x-auto border border-line">
                    {sizeGuides.length > 1 ? (
                      <p className="border-b border-line px-3 py-2 text-[11px] tracking-wide text-stone uppercase">
                        {sizeGuide.label}
                      </p>
                    ) : null}
                    <table className="min-w-full text-left text-xs">
                      <thead className="bg-mist text-stone">
                        <tr>
                          <th className="px-3 py-2 font-medium">Size</th>
                          {sizeGuide.columns.map((column) => (
                            <th key={column.id} className="px-3 py-2 font-medium">
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sizeGuide.rows.map((row) => (
                          <tr key={row.size} className="border-t border-line">
                            <td className="px-3 py-2 font-medium">{row.size}</td>
                            {sizeGuide.columns.map((column) => (
                              <td key={column.id} className="px-3 py-2">
                                {row.values[column.id] || '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="border-t border-line px-3 py-2 text-[11px] text-stone">
                      Measurements refer to the garment. Chart: {sizeGuide.label}.
                    </p>
                  </div>
                ) : (
                  <p className="border border-line px-3 py-2 text-xs text-stone">
                    No size chart is available for this piece yet.
                  </p>
                )
              ) : null}

              <div className="space-y-2 border-t border-line pt-5 text-sm text-ink-soft">
                <p>
                  <span className="font-medium text-ink">Material: </span>
                  {product.material}
                </p>
                <p>
                  <span className="font-medium text-ink">Care: </span>
                  {product.careInstructions}
                </p>
              </div>
            </div>

            <div className="mt-8 pb-[env(safe-area-inset-bottom)]">
              {canOrder && orderUrl && online ? (
                <a
                  href={orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center bg-ink px-5 py-3.5 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft"
                >
                  Order via WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full cursor-not-allowed items-center justify-center bg-stone px-5 py-3.5 text-xs font-semibold tracking-[0.16em] text-cream uppercase opacity-70"
                >
                  {!online
                    ? 'Reconnect to order'
                    : !product.available
                      ? 'Sold Out'
                      : 'Select colour & size to order'}
                </button>
              )}
              <p className="mt-3 text-center text-xs text-stone">
                {online
                  ? 'Orders and payment are completed through WhatsApp.'
                  : 'You appear to be offline. Please reconnect to continue. Orders are not submitted while offline.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
