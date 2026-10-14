import { brand } from '../data/brand'
import { useContent } from '../context/ContentContext'
import { lookbookObjectPosition } from '../utils/lookbook'
import { SectionHeading } from './SectionHeading'

export function Lookbook() {
  const { lookbookImages } = useContent()
  const images = lookbookImages.filter((image) => image.src.trim())

  if (!images.length) return null

  return (
    <section className="bg-cream px-5 py-20 md:px-8 md:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Lookbook"
            title="Life in Marvolo"
            description="A visual edit of silhouettes, textures and quiet confidence."
          />
          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center border border-ink px-5 py-3 text-xs font-medium tracking-[0.16em] text-ink uppercase transition hover:bg-ink hover:text-cream"
          >
            Follow Us on Instagram
          </a>
        </div>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4 lg:auto-rows-[260px]">
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className={`overflow-hidden ${
                image.span === 'tall'
                  ? 'row-span-2'
                  : image.span === 'wide'
                    ? 'col-span-2'
                    : ''
              } ${index === 0 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: lookbookObjectPosition(image) }}
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
