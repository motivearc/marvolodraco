import type { Product } from '../types/product'
import { SectionHeading } from './SectionHeading'
import { ProductCard } from './ProductCard'

type FeaturedCollectionProps = {
  products: Product[]
  onViewDetails: (product: Product) => void
}

export function FeaturedCollection({
  products,
  onViewDetails,
}: FeaturedCollectionProps) {
  return (
    <section
      id="featured"
      className="scroll-mt-28 bg-cream px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Featured"
          title="Selected Pieces"
          description="A curated edit of essential silhouettes designed for everyday refinement."
        />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
