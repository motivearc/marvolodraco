import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { SectionHeading } from './SectionHeading'

function ColumnLabel({ label }: { label: string }) {
  const match = /^(.*?)(\s*\([^)]+\))\s*$/.exec(label)
  if (!match) return label

  return (
    <>
      <span className="md:hidden">
        <span className="block whitespace-nowrap">{match[1]}</span>
        <span className="mt-0.5 block tracking-normal">{match[2].trim()}</span>
      </span>
      <span className="hidden md:inline">{label}</span>
    </>
  )
}

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
          <div className="border border-line bg-cream">
            <table className="w-full table-fixed text-left md:table-auto">
              <thead>
                <tr className="border-b border-line bg-cream-dark/60 text-[10px] leading-tight tracking-normal text-stone uppercase sm:text-xs sm:tracking-[0.1em] md:tracking-[0.14em]">
                  <th className="w-9 px-1 py-2.5 align-bottom font-medium sm:w-16 sm:px-4 sm:py-3 md:px-6 md:py-4">
                    Size
                  </th>
                  {activeChart.columns.map((column) => (
                    <th
                      key={column.id}
                      className="px-0.5 py-2.5 align-bottom font-medium sm:px-4 sm:py-3 md:px-6 md:py-4"
                    >
                      <ColumnLabel label={column.label} />
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
                    <td className="px-1 py-2.5 text-xs font-medium whitespace-nowrap text-ink sm:px-4 sm:py-3 sm:text-base md:px-6 md:py-4">
                      {row.size}
                    </td>
                    {activeChart.columns.map((column) => (
                      <td
                        key={column.id}
                        className="px-0.5 py-2.5 text-[11px] whitespace-nowrap text-ink-soft tabular-nums sm:px-4 sm:py-3 sm:text-sm sm:whitespace-normal md:px-6 md:py-4 md:text-base"
                      >
                        {row.values[column.id] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
