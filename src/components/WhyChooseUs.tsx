import { Feather, MessageCircle, Shirt, Sparkles } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

const benefits = [
  {
    icon: Feather,
    title: 'Premium Materials',
    description:
      'Thoughtfully selected fabrics with a soft hand-feel and lasting structure.',
  },
  {
    icon: Shirt,
    title: 'Comfortable Fit',
    description:
      'Modern cuts designed to move with you from morning to evening.',
  },
  {
    icon: Sparkles,
    title: 'Timeless Design',
    description:
      'Clean silhouettes that stay relevant season after season.',
  },
  {
    icon: MessageCircle,
    title: 'Easy WhatsApp Ordering',
    description:
      'Browse the catalogue and complete your order through a personal chat.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="border-y border-line bg-ink px-5 py-20 md:px-8 md:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why Marvolo"
          title="Designed for everyday confidence"
          description="Four quiet promises behind every piece we make."
          light
        />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <benefit.icon
                className="mb-5 text-sand"
                size={22}
                strokeWidth={1.5}
              />
              <h3 className="font-display text-2xl font-medium text-cream">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-sand/90">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
