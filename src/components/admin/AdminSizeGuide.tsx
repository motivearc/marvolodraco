import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import type { SizeGuideChart, SizeGuideColumn } from '../../types/content'
import { slugifyCategory } from '../../utils/categories'
import {
  emptySizeGuideChart,
  emptySizeGuideRow,
  sanitizeSizeGuides,
} from '../../utils/sizeGuides'

const inputClass =
  'w-full border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-ink'

function cloneCharts(charts: SizeGuideChart[]): SizeGuideChart[] {
  return structuredClone(charts)
}

export function AdminSizeGuide() {
  const { sizeGuides, categories, updateSiteContent, saving } = useContent()
  const [draft, setDraft] = useState(() => cloneCharts(sizeGuides))
  const [activeIndex, setActiveIndex] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(cloneCharts(sizeGuides))
    setActiveIndex((index) =>
      sizeGuides.length ? Math.min(index, sizeGuides.length - 1) : 0,
    )
  }, [sizeGuides])

  const active = draft[activeIndex] ?? null

  function updateChart(index: number, next: SizeGuideChart) {
    setDraft((current) =>
      current.map((chart, i) => (i === index ? next : chart)),
    )
  }

  function addChart() {
    const chart = emptySizeGuideChart(`Chart ${draft.length + 1}`)
    setDraft((current) => [...current, chart])
    setActiveIndex(draft.length)
  }

  function removeChart(index: number) {
    if (draft.length <= 1) {
      setError('Keep at least one size chart.')
      return
    }
    if (!window.confirm('Remove this size chart?')) return
    setDraft((current) => current.filter((_, i) => i !== index))
    setActiveIndex((current) => Math.max(0, Math.min(current, draft.length - 2)))
  }

  function addColumn(chartIndex: number) {
    const chart = draft[chartIndex]
    if (!chart) return
    const label = `Measure ${chart.columns.length + 1}`
    let id = slugifyCategory(label)
    const used = new Set(chart.columns.map((column) => column.id))
    while (used.has(id)) id = `${id}-${used.size + 1}`
    const column: SizeGuideColumn = { id, label }
    updateChart(chartIndex, {
      ...chart,
      columns: [...chart.columns, column],
      rows: chart.rows.map((row) => ({
        ...row,
        values: { ...row.values, [id]: '' },
      })),
    })
  }

  function removeColumn(chartIndex: number, columnId: string) {
    const chart = draft[chartIndex]
    if (!chart || chart.columns.length <= 1) {
      setError('Each chart needs at least one measurement column.')
      return
    }
    updateChart(chartIndex, {
      ...chart,
      columns: chart.columns.filter((column) => column.id !== columnId),
      rows: chart.rows.map((row) => {
        const values = { ...row.values }
        delete values[columnId]
        return { ...row, values }
      }),
    })
  }

  async function handleSave() {
    setMessage(null)
    setError(null)
    const cleaned = sanitizeSizeGuides(draft)
    if (!cleaned.length) {
      setError('Add at least one chart with a size row and a measurement column.')
      return
    }
    try {
      await updateSiteContent({ sizeGuides: cleaned })
      setMessage('Size guides saved to Supabase.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save size guides.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-medium text-ink">
            Size guides
          </h2>
          <p className="mt-1 text-sm text-ink-soft/80">
            Create a chart per garment type. Link each chart to product
            categories so the product modal shows the right measurements.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addChart}
            className="inline-flex items-center gap-2 border border-line px-4 py-3 text-xs font-medium tracking-[0.16em] text-ink-soft uppercase transition hover:border-ink hover:text-ink"
          >
            <Plus className="size-4" />
            Add chart
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="bg-ink px-4 py-3 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {message ? <p className="text-sm text-ink">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        {draft.map((chart, index) => (
          <button
            key={`${chart.id}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`px-3 py-2 text-xs font-medium tracking-[0.12em] uppercase transition ${
              index === activeIndex
                ? 'bg-ink text-cream'
                : 'border border-line text-ink-soft hover:border-ink hover:text-ink'
            }`}
          >
            {chart.label || `Chart ${index + 1}`}
          </button>
        ))}
      </div>

      {active ? (
        <div className="space-y-5 border border-line bg-cream p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <label className="block min-w-[220px] flex-1 space-y-2">
              <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                Chart name
              </span>
              <input
                value={active.label}
                onChange={(event) => {
                  const label = event.target.value
                  updateChart(activeIndex, {
                    ...active,
                    label,
                    id: slugifyCategory(label) || active.id,
                  })
                }}
                className={inputClass}
              />
            </label>
            <button
              type="button"
              onClick={() => removeChart(activeIndex)}
              className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink"
            >
              <Trash2 className="size-3.5" />
              Remove chart
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
              Linked categories
            </p>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const checked = active.categoryIds.includes(category.id)
                return (
                  <label
                    key={category.id}
                    className="inline-flex items-center gap-2 text-sm text-ink-soft"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        const categoryIds = event.target.checked
                          ? [...active.categoryIds, category.id]
                          : active.categoryIds.filter((id) => id !== category.id)
                        updateChart(activeIndex, { ...active, categoryIds })
                      }}
                      className="accent-ink"
                    />
                    {category.label}
                  </label>
                )
              })}
            </div>
            <p className="text-xs text-stone">
              Product pages open the first chart that includes their category.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                Measurement columns
              </p>
              <button
                type="button"
                onClick={() => addColumn(activeIndex)}
                className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-ink uppercase"
              >
                <Plus className="size-3.5" />
                Add column
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {active.columns.map((column) => (
                <div
                  key={column.id}
                  className="flex items-end gap-2 border border-line p-3"
                >
                  <label className="block min-w-0 flex-1 space-y-2">
                    <span className="text-xs tracking-[0.12em] text-stone uppercase">
                      Column label
                    </span>
                    <input
                      value={column.label}
                      onChange={(event) => {
                        const label = event.target.value
                        updateChart(activeIndex, {
                          ...active,
                          columns: active.columns.map((item) =>
                            item.id === column.id ? { ...item, label } : item,
                          ),
                        })
                      }}
                      className={inputClass}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeColumn(activeIndex, column.id)}
                    className="border border-line p-2 text-ink-soft transition hover:border-ink hover:text-ink"
                    aria-label={`Remove ${column.label}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                Size rows
              </p>
              <button
                type="button"
                onClick={() =>
                  updateChart(activeIndex, {
                    ...active,
                    rows: [...active.rows, emptySizeGuideRow(active.columns)],
                  })
                }
                className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-ink uppercase"
              >
                <Plus className="size-3.5" />
                Add size
              </button>
            </div>
            <div className="overflow-x-auto border border-line">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-mist text-xs tracking-[0.12em] text-stone uppercase">
                  <tr>
                    <th className="px-3 py-2 font-medium">Size</th>
                    {active.columns.map((column) => (
                      <th key={column.id} className="px-3 py-2 font-medium">
                        {column.label || column.id}
                      </th>
                    ))}
                    <th className="px-3 py-2 font-medium"> </th>
                  </tr>
                </thead>
                <tbody>
                  {active.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-line">
                      <td className="px-2 py-2">
                        <input
                          value={row.size}
                          onChange={(event) => {
                            const size = event.target.value
                            updateChart(activeIndex, {
                              ...active,
                              rows: active.rows.map((item, i) =>
                                i === rowIndex ? { ...item, size } : item,
                              ),
                            })
                          }}
                          className={inputClass}
                        />
                      </td>
                      {active.columns.map((column) => (
                        <td key={column.id} className="px-2 py-2">
                          <input
                            value={row.values[column.id] ?? ''}
                            onChange={(event) => {
                              const value = event.target.value
                              updateChart(activeIndex, {
                                ...active,
                                rows: active.rows.map((item, i) =>
                                  i === rowIndex
                                    ? {
                                        ...item,
                                        values: {
                                          ...item.values,
                                          [column.id]: value,
                                        },
                                      }
                                    : item,
                                ),
                              })
                            }}
                            className={inputClass}
                          />
                        </td>
                      ))}
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateChart(activeIndex, {
                              ...active,
                              rows: active.rows.filter((_, i) => i !== rowIndex),
                            })
                          }
                          className="border border-line p-2 text-ink-soft transition hover:border-ink hover:text-ink"
                          aria-label={`Remove size ${row.size || rowIndex + 1}`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
