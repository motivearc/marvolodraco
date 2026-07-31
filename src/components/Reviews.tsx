import { Star } from 'lucide-react'
import { reviews } from '../data/content'
import { SectionHeading } from './SectionHeading'

export function Reviews() {
  return (
    <section className="border-t border-line bg-mist px-5 py-20 md:px-8 md:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Reviews"
          title="What our customers say"
          description="Quiet confidence, shared by people who wear Marvolo."
        />
        <div className="grid gap-8 md:grid-cols-2">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="border-t border-line pt-6"
            >
              <div className="mb-4 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    className={
                      index < review.rating
                        ? 'fill-ink text-ink'
                        : 'text-sand'
                    }
                  />
                ))}
              </div>
              <blockquote className="text-base leading-relaxed text-ink-soft md:text-lg">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-5 text-sm font-medium tracking-wide text-ink">
                {review.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
