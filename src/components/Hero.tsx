import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { useHorizontalSwipe } from '../hooks/useHorizontalSwipe'
import { buildWhatsAppGeneralUrl } from '../utils/whatsapp'

const SLIDE_INTERVAL_MS = 6000

export function Hero() {
  const { hero, activeWhatsApp } = useContent()
  const slides = hero.images.filter((image) => image.trim())
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    setActiveIndex(0)
  }, [hero.images])

  useEffect(() => {
    if (slides.length <= 1 || paused) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReducedMotion) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [slides.length, paused, activeIndex])

  function goTo(index: number) {
    if (slides.length <= 1) return
    setActiveIndex((index + slides.length) % slides.length)
  }

  const swipe = useHorizontalSwipe((direction) => {
    goTo(activeIndex + direction)
  })

  return (
    <section
      id="home"
      className="relative min-h-dynamic touch-pan-y overflow-hidden"
      onPointerDown={(event) => {
        setPaused(true)
        swipe.onPointerDown(event)
      }}
      onPointerMove={swipe.onPointerMove}
      onPointerUp={(event) => {
        swipe.onPointerUp(event)
        setPaused(false)
      }}
      onPointerCancel={(event) => {
        swipe.onPointerCancel(event)
        setPaused(false)
      }}
      onClickCapture={swipe.onClickCapture}
    >
      <div className="absolute inset-0 bg-black" aria-hidden="true">
        {slides.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-out ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            fetchPriority={index === 0 ? 'high' : 'low'}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />

      <div className="relative mx-auto flex min-h-dynamic max-w-7xl items-end px-5 pt-[calc(7rem+env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))] md:items-center md:px-8 md:pb-24 lg:px-10">
        <div className="max-w-xl text-ink">
          {hero.eyebrow ? (
            <p className="animate-fade-up mb-4 text-xs font-medium tracking-[0.28em] text-sand uppercase">
              {hero.eyebrow}
            </p>
          ) : null}
          {hero.headline ? (
            <h1 className="animate-fade-up delay-100 font-display text-5xl leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl">
              {hero.headline}
            </h1>
          ) : (
            <h1 className="sr-only">{hero.eyebrow || 'Marvolo'}</h1>
          )}
          {hero.description ? (
            <p className="animate-fade-up delay-200 mt-5 max-w-md text-base leading-relaxed text-ink/85 md:text-lg">
              {hero.description}
            </p>
          ) : null}
          <div className="animate-fade-up delay-300 mt-8 flex flex-wrap gap-3">
            <a
              href="#collection"
              className="inline-flex items-center justify-center rounded-sm bg-ink px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft"
            >
              {hero.primaryCta}
            </a>
            <a
              href={buildWhatsAppGeneralUrl(activeWhatsApp.number)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm border border-ink/70 px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink uppercase transition hover:bg-ink/10"
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <>
          <div
            className="absolute right-5 bottom-8 z-10 flex items-center gap-2 md:right-8 lg:right-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="flex size-10 items-center justify-center border border-ink/40 text-ink transition hover:bg-ink/10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="flex size-10 items-center justify-center border border-ink/40 text-ink transition hover:bg-ink/10"
              aria-label="Next slide"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div
            className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2"
            role="tablist"
            aria-label="Hero slides"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Show slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-1.5 transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-8 bg-ink'
                    : 'w-1.5 bg-ink/45 hover:bg-ink/70'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
