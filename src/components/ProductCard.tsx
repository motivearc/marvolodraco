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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-3 text-[#1c1b1a] sm:p-4">
      <button
        type="button"
        onClick={() => onViewDetails(product)}
        aria-label={`View ${product.name}`}
        className="relative mb-4 aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl bg-[#ebe6de] text-left"
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
          <span className="absolute top-3 left-3 bg-[#1c1b1a] px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
            Sold Out
          </span>
        ) : product.newArrival ? (
          <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#1c1b1a] uppercase backdrop-blur-sm">
            New
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-tight font-medium tracking-tight text-[#1c1b1a]">
            {product.name}
          </h3>
          <p className="shrink-0 pt-1 text-sm font-medium text-[#3a3835]">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs tracking-wide text-[#8c867c]">Colours</span>
          <div className="flex gap-1.5">
            {product.colours.map((colour) => (
              <span
                key={colour.name}
                title={colour.name}
                className="h-3.5 w-3.5 rounded-full border border-[#ddd6cb]"
                style={{ backgroundColor: colour.hex }}
              />
            ))}
          </div>
        </div>

        <p className="mb-5 text-xs tracking-wide text-[#8c867c]">
          Sizes: {product.sizes.join(' · ')}
        </p>

        <div
          className={`mt-auto flex flex-col gap-2 ${stackActions ? '' : 'sm:flex-row'}`}
        >
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="inline-flex flex-1 items-center justify-center border border-[#1c1b1a] px-4 py-2.5 text-xs font-medium tracking-[0.14em] text-[#1c1b1a] uppercase transition hover:bg-[#1c1b1a] hover:text-white"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            disabled={!product.available}
            className="inline-flex flex-1 items-center justify-center bg-[#1c1b1a] px-4 py-2.5 text-xs font-medium tracking-[0.14em] text-white uppercase transition hover:bg-[#3a3835] disabled:cursor-not-allowed disabled:bg-[#8c867c] disabled:opacity-60"
          >
            {product.available ? 'Order via WhatsApp' : 'Sold Out'}
          </button>
        </div>
      </div>
    </article>
  )
}
