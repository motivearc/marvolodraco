import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '../data/content'
import { SectionHeading } from './SectionHeading'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-cream px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about ordering through WhatsApp."
          align="center"
        />
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenIndex((current) => (current === index ? null : index))
                  }
                >
                  <span className="font-display text-xl font-medium text-ink md:text-2xl">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-stone transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-ink-soft md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
