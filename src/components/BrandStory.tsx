import { brand } from '../data/brand'
import { useContent } from '../context/ContentContext'
import { SectionHeading } from './SectionHeading'

export function BrandStory() {
  const { aboutImage } = useContent()

  return (
    <section
      id="about"
      className="scroll-mt-24 bg-cream px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <SectionHeading
            eyebrow="Our Story"
            title={`At ${brand.name}, clothing is meant to last.`}
            description={brand.story}
          />
          <p className="max-w-xl text-base leading-relaxed text-ink-soft/80">
            {brand.philosophy}
          </p>
        </div>
        <div className="order-1 overflow-hidden bg-cream-dark lg:order-2">
          {aboutImage ? (
            <img
              src={aboutImage}
              alt={`${brand.name} lifestyle and brand atmosphere`}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover md:aspect-[5/6]"
            />
          ) : (
            <div
              className="aspect-[4/5] w-full md:aspect-[5/6]"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </section>
  )
}
