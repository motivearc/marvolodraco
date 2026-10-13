import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { SectionHeading } from './SectionHeading'

export function SizeGuide() {
  const { sizeGuides } = useContent()
  const [activeId, setActiveId] = useState(sizeGuides[0]?.id ?? '')

  useEffect(() => {
    if (!sizeGuides.length) {
      setActiveId('')
      return
    }
    if (!sizeGuides.some((chart) => chart.id === activeId)) {
      setActiveId(sizeGuides[0].id)
    }
  }, [sizeGuides, activeId])

  const activeChart =
    sizeGuides.find((chart) => chart.id === activeId) ?? sizeGuides[0] ?? null

  return (
    <section
      id="size-guide"
      className="scroll-mt-24 bg-mist px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Fit"
          title="Size Guide"
          description="Use these garment measurements as a reference. Unsure about your size? Message us on WhatsApp for personalised advice."
        />

        {sizeGuides.length > 1 ? (
          <div
            className="mb-6 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Size guide charts"
          >
            {sizeGuides.map((chart) => {
              const selected = chart.id === activeChart?.id
              return (
                <button
                  key={chart.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(chart.id)}
                  className={`px-3 py-2 text-xs font-medium tracking-[0.12em] uppercase transition ${
                    selected
                      ? 'bg-ink text-cream'
                      : 'border border-line text-ink-soft hover:border-ink hover:text-ink'
                  }`}
                >
                  {chart.label}
                </button>
              )
            })}
          </div>
        ) : null}

        {activeChart ? (
          <>
            <div className="overflow-x-auto border border-line bg-cream">
              <table className="min-w-[640px] w-full text-left">
                <thead>
                  <tr className="border-b border-line bg-cream-dark/60 text-xs tracking-[0.14em] text-stone uppercase">
                    <th className="px-4 py-4 font-medium md:px-6">Size</th>
                    {activeChart.columns.map((column) => (
                      <th
                        key={column.id}
                        className="px-4 py-4 font-medium md:px-6"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeChart.rows.map((row) => (
                    <tr
                      key={row.size}
                      className="border-b border-line last:border-b-0"
                    >
                      <td className="px-4 py-4 font-medium text-ink md:px-6">
                        {row.size}
                      </td>
                      {activeChart.columns.map((column) => (
                        <td
                          key={column.id}
                          className="px-4 py-4 text-ink-soft md:px-6"
                        >
                          {row.values[column.id] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-stone md:hidden">
              Swipe horizontally to view all measurements.
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-soft/80">
            Size charts will appear here once they are added in the admin
            dashboard.
          </p>
        )}
      </div>
    </section>
  )
}
