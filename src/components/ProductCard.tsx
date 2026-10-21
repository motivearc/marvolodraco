import type { Product } from '../types/product'
import { formatPrice } from '../utils/whatsapp'

type ProductCardProps = {
  product: Product
  onViewDetails: (product: Product) => void
  stackActions?: boolean
}

export function ProductCard({
  product,
  onViewDetails,
  stackActions = false,
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <button
        type="button"
        onClick={() => onViewDetails(product)}
        aria-label={`View ${product.name}`}
        className="relative mb-4 aspect-[3/4] w-full cursor-pointer overflow-hidden bg-cream-dark text-left"
      >
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt=""
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] ${
              product.available ? '' : 'opacity-70 grayscale'
            }`}
          />
        ) : null}
        {!product.available ? (
          <span className="absolute top-3 left-3 bg-ink px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-cream uppercase">
            Sold Out
          </span>
        ) : product.newArrival ? (
          <span className="absolute top-3 left-3 bg-cream/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-ink uppercase backdrop-blur-sm">
            New
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-tight font-medium tracking-tight text-ink">
            {product.name}
          </h3>
          <p className="shrink-0 pt-1 text-sm font-medium text-ink-soft">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs tracking-wide text-stone">Colours</span>
          <div className="flex gap-1.5">
            {product.colours.map((colour) => (
              <span
                key={colour.name}
                title={colour.name}
                className="h-3.5 w-3.5 rounded-full border border-line"
                style={{ backgroundColor: colour.hex }}
              />
            ))}
          </div>
        </div>

        <p className="mb-5 text-xs tracking-wide text-stone">
          Sizes: {product.sizes.join(' · ')}
        </p>

        <div
          className={`mt-auto flex flex-col gap-2 ${stackActions ? '' : 'sm:flex-row'}`}
        >
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="inline-flex flex-1 items-center justify-center border border-ink px-4 py-2.5 text-xs font-medium tracking-[0.14em] text-ink uppercase transition hover:bg-ink hover:text-cream"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            disabled={!product.available}
            className="inline-flex flex-1 items-center justify-center bg-ink px-4 py-2.5 text-xs font-medium tracking-[0.14em] text-cream uppercase transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:bg-stone disabled:opacity-60"
          >
            {product.available ? 'Order via WhatsApp' : 'Sold Out'}
          </button>
        </div>
      </div>
    </article>
  )
}
