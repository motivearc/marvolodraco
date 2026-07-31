import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../context/ContentContext'
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
    setActiveIndex((index + slides.length) % slides.length)
  }

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-ink" aria-hidden="true">
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

      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/45 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/25" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-16 pt-28 md:items-center md:px-8 md:pb-24 lg:px-10">
        <div className="max-w-xl text-cream">
          <p className="animate-fade-up mb-4 text-xs font-medium tracking-[0.28em] text-sand uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="animate-fade-up delay-100 font-display text-5xl leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>
          <p className="animate-fade-up delay-200 mt-5 max-w-md text-base leading-relaxed text-cream/85 md:text-lg">
            {hero.description}
          </p>
          <div className="animate-fade-up delay-300 mt-8 flex flex-wrap gap-3">
            <a
              href="#collection"
              className="inline-flex items-center justify-center rounded-sm bg-cream px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink uppercase transition hover:bg-mist"
            >
              {hero.primaryCta}
            </a>
            <a
              href={buildWhatsAppGeneralUrl(activeWhatsApp.number)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm border border-cream/70 px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-cream/10"
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
              className="flex size-10 items-center justify-center border border-cream/40 text-cream transition hover:bg-cream/10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="flex size-10 items-center justify-center border border-cream/40 text-cream transition hover:bg-cream/10"
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
                    ? 'w-8 bg-cream'
                    : 'w-1.5 bg-cream/45 hover:bg-cream/70'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
