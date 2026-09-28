import type { CatalogueCategory } from '../types/content'
import type { FilterOption, Product } from '../types/product'
import { SectionHeading } from './SectionHeading'
import { ProductFilter } from './ProductFilter'
import { ProductCard } from './ProductCard'

type CollectionProps = {
  products: Product[]
  categories: CatalogueCategory[]
  filter: FilterOption
  onFilterChange: (filter: FilterOption) => void
  onViewDetails: (product: Product) => void
}

export function Collection({
  products,
  categories,
  filter,
  onFilterChange,
  onViewDetails,
}: CollectionProps) {
  return (
    <section
      id="collection"
      className="scroll-mt-24 border-t border-line bg-mist px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div id="new-arrivals" className="mx-auto max-w-7xl scroll-mt-28">
        <SectionHeading
          eyebrow="Catalogue"
          title="The Collection"
          description="Filter by category and explore every piece. Select colour and size when you are ready to order on WhatsApp."
        />
        <ProductFilter
          categories={categories}
          active={filter}
          onChange={onFilterChange}
        />

        {products.length > 0 ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-line bg-cream px-6 py-16 text-center text-sm text-stone">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  )
}
