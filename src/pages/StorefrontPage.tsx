import { useEffect, useMemo, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { FeaturedCollection } from '../components/FeaturedCollection'
import { Collection } from '../components/Collection'
import { BrandStory } from '../components/BrandStory'
import { WhyChooseUs } from '../components/WhyChooseUs'
import { SizeGuide } from '../components/SizeGuide'
import { Lookbook } from '../components/Lookbook'
import { Reviews } from '../components/Reviews'
import { FAQ } from '../components/FAQ'
import { Footer } from '../components/Footer'
import { FloatingWhatsApp } from '../components/FloatingWhatsApp'
import { ProductModal } from '../components/ProductModal'
import { useContent } from '../context/ContentContext'
import { brand } from '../data/brand'
import { useCustomerPwaNav } from '../hooks/useIsStandalone'
import type { FilterOption, Product } from '../types/product'

function filterProducts(
  products: Product[],
  activeFilter: FilterOption,
): Product[] {
  if (activeFilter === 'all') return products
  if (activeFilter === 'new-arrivals') {
    return products.filter((product) => product.newArrival)
  }
  return products.filter((product) => product.category === activeFilter)
}

export function StorefrontPage() {
  const { products, categories, configured, loading } = useContent()
  const customerPwaNav = useCustomerPwaNav()
  const [filter, setFilter] = useState<FilterOption>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured).slice(0, 6),
    [products],
  )

  const filteredProducts = useMemo(
    () => filterProducts(products, filter),
    [products, filter],
  )

  useEffect(() => {
    if (filter === 'all' || filter === 'new-arrivals') return
    if (!categories.some((category) => category.id === filter)) {
      setFilter('all')
    }
  }, [categories, filter])

  if (configured && loading) {
    return (
      <div
        className="flex min-h-dynamic items-center justify-center bg-ink"
        aria-busy="true"
        aria-label="Loading"
      >
        <img
          src="/logo.png"
          alt={brand.name}
          className="animate-fade-in h-20 w-auto object-contain md:h-24"
        />
      </div>
    )
  }

  return (
    <div
      className={
        customerPwaNav
          ? 'pb-[calc(7rem+env(safe-area-inset-bottom))]'
          : undefined
      }
    >
      <Navbar />
      <main>
        <Hero />
        <FeaturedCollection
          products={featuredProducts}
          onViewDetails={setSelectedProduct}
        />
        <Collection
          products={filteredProducts}
          categories={categories}
          filter={filter}
          onFilterChange={setFilter}
          onViewDetails={setSelectedProduct}
        />
        <BrandStory />
        <WhyChooseUs />
        <SizeGuide />
        <Lookbook />
        <Reviews />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
