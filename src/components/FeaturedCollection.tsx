import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHorizontalSwipe } from '../hooks/useHorizontalSwipe'
import type { Product } from '../types/product'
import { SectionHeading } from './SectionHeading'
import { ProductCard } from './ProductCard'

const DESKTOP_COLUMNS_QUERY = '(min-width: 640px)'
const DESKTOP_COLUMNS = 3

function useVisibleColumns() {
  const [columns, setColumns] = useState(() =>
    window.matchMedia(DESKTOP_COLUMNS_QUERY).matches ? DESKTOP_COLUMNS : 1,
  )

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_COLUMNS_QUERY)
    const update = () => setColumns(media.matches ? DESKTOP_COLUMNS : 1)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return columns
}

type FeaturedCollectionProps = {
  products: Product[]
  onViewDetails: (product: Product) => void
}

export function FeaturedCollection({
  products,
  onViewDetails,
}: FeaturedCollectionProps) {
  const columns = useVisibleColumns()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [canSlide, setCanSlide] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)
  const pageCount = Math.max(1, products.length - columns + 1)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const sync = () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth
      const slide = scroller.querySelector<HTMLElement>('[data-slide]')
      const gap = Number.parseFloat(getComputedStyle(scroller).columnGap) || 0
      const step = slide ? slide.offsetWidth + gap : scroller.clientWidth
      const nextPage =
        step > 0 ? Math.round(scroller.scrollLeft / step) : 0

      setCanSlide(maxScroll > 4)
      setAtStart(scroller.scrollLeft <= 4)
      setAtEnd(scroller.scrollLeft >= maxScroll - 4)
      setPage(Math.min(Math.max(nextPage, 0), Math.max(products.length - 1, 0)))
    }

    let settleTimer = 0
    const syncAfterSettle = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(sync, 120)
    }

    sync()
    scroller.addEventListener('scroll', syncAfterSettle, { passive: true })
    scroller.addEventListener('scrollend', sync)
    const observer = new ResizeObserver(sync)
    observer.observe(scroller)

    return () => {
      window.clearTimeout(settleTimer)
      scroller.removeEventListener('scroll', syncAfterSettle)
      scroller.removeEventListener('scrollend', sync)
      observer.disconnect()
    }
  }, [products.length, columns])

  function scrollToPage(nextPage: number) {
    const scroller = scrollerRef.current
    if (!scroller) return
    const slide = scroller.querySelector<HTMLElement>('[data-slide]')
    if (!slide) return
    const gap = Number.parseFloat(getComputedStyle(scroller).columnGap) || 0
    const step = slide.offsetWidth + gap
    if (step <= 0) return
    const maxPage = Math.max(
      0,
      Math.round((scroller.scrollWidth - scroller.clientWidth) / step),
    )
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    scroller.scrollTo({
      left: Math.min(maxPage, Math.max(0, nextPage)) * step,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  function scrollByPage(direction: -1 | 1) {
    const scroller = scrollerRef.current
    if (!scroller) return
    const slide = scroller.querySelector<HTMLElement>('[data-slide]')
    if (!slide) return
    const gap = Number.parseFloat(getComputedStyle(scroller).columnGap) || 0
    const step = slide.offsetWidth + gap
    const current = step > 0 ? Math.round(scroller.scrollLeft / step) : 0
    scrollToPage(current + direction)
  }

  const swipeOriginRef = useRef(0)
  const swipe = useHorizontalSwipe((direction) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    if (Math.abs(scroller.scrollLeft - swipeOriginRef.current) > 8) return
    scrollByPage(direction)
  })

  return (
    <section
      id="featured"
      className="scroll-mt-28 bg-cream px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6">
          <SectionHeading
            eyebrow="Featured"
            title="Selected Pieces"
            description="A curated edit of essential silhouettes designed for everyday refinement."
          />
          {canSlide ? (
            <div className="mb-10 flex gap-2 md:mb-14">
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={atStart}
                aria-label="Previous pieces"
                className="flex size-10 items-center justify-center border border-ink text-ink transition hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:border-line disabled:text-stone disabled:hover:bg-transparent"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={atEnd}
                aria-label="Next pieces"
                className="flex size-10 items-center justify-center border border-ink text-ink transition hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:border-line disabled:text-stone disabled:hover:bg-transparent"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        <div
          ref={scrollerRef}
          className="flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] motion-reduce:scroll-auto active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          onPointerDown={(event) => {
            swipeOriginRef.current = scrollerRef.current?.scrollLeft ?? 0
            swipe.onPointerDown(event)
          }}
          onPointerMove={swipe.onPointerMove}
          onPointerUp={swipe.onPointerUp}
          onPointerCancel={swipe.onPointerCancel}
          onClickCapture={swipe.onClickCapture}
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-slide
              className="w-full shrink-0 snap-start sm:w-[calc((100%-3rem)/3)]"
            >
              <ProductCard
                product={product}
                onViewDetails={onViewDetails}
                stackActions={columns > 1}
              />
            </div>
          ))}
        </div>

        {canSlide ? (
          <div
            className="mt-8 flex justify-center gap-2"
            role="tablist"
            aria-label="Featured pieces"
          >
            {Array.from({ length: pageCount }, (_, dot) => (
              <button
                key={dot}
                type="button"
                role="tab"
                aria-selected={dot === page}
                aria-label={`Show pieces starting at ${dot + 1}`}
                onClick={() => scrollToPage(dot)}
                className={`h-1.5 transition-all duration-300 ${
                  dot === page
                    ? 'w-8 bg-ink'
                    : 'w-1.5 bg-stone/40 hover:bg-stone/70'
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
