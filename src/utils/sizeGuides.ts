import { sizeGuide as legacySizeGuide } from '../data/content'
import type { SizeGuideChart, SizeGuideColumn, SizeGuideRow } from '../types/content'
import { slugifyCategory } from './categories'

export const DEFAULT_SIZE_GUIDE_COLUMNS: SizeGuideColumn[] = [
  { id: 'chest', label: 'Chest (cm)' },
  { id: 'shoulder', label: 'Shoulder (cm)' },
  { id: 'sleeve', label: 'Sleeve (cm)' },
  { id: 'length', label: 'Length (cm)' },
]

export function createDefaultSizeGuides(): SizeGuideChart[] {
  return [
    {
      id: 'tops',
      label: 'Tops',
      categoryIds: ['shirts', 't-shirts', 'outerwear'],
      columns: DEFAULT_SIZE_GUIDE_COLUMNS.map((column) => ({ ...column })),
      rows: legacySizeGuide.map((row) => ({
        size: row.size,
        values: {
          chest: row.chest,
          shoulder: row.shoulder,
          sleeve: row.sleeve,
          length: row.length,
        },
      })),
    },
  ]
}

export function emptySizeGuideRow(columns: SizeGuideColumn[]): SizeGuideRow {
  return {
    size: '',
    values: Object.fromEntries(columns.map((column) => [column.id, ''])),
  }
}

export function emptySizeGuideChart(label = 'New chart'): SizeGuideChart {
  const columns = DEFAULT_SIZE_GUIDE_COLUMNS.map((column) => ({ ...column }))
  return {
    id: slugifyCategory(label),
    label,
    categoryIds: [],
    columns,
    rows: [
      emptySizeGuideRow(columns),
      emptySizeGuideRow(columns),
      emptySizeGuideRow(columns),
    ],
  }
}

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeColumns(value: unknown): SizeGuideColumn[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_SIZE_GUIDE_COLUMNS.map((column) => ({ ...column }))
  }

  const columns: SizeGuideColumn[] = []
  const used = new Set<string>()

  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const record = item as Record<string, unknown>
    const label = cleanText(record.label) || cleanText(record.id)
    if (!label) continue
    let id = slugifyCategory(cleanText(record.id) || label)
    if (!id) id = `col-${columns.length + 1}`
    while (used.has(id)) id = `${id}-${columns.length + 1}`
    used.add(id)
    columns.push({ id, label })
  }

  return columns.length
    ? columns
    : DEFAULT_SIZE_GUIDE_COLUMNS.map((column) => ({ ...column }))
}

function normalizeRows(
  value: unknown,
  columns: SizeGuideColumn[],
): SizeGuideRow[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const record = item as Record<string, unknown>
      const size = cleanText(record.size)
      if (!size) return null

      const sourceValues =
        record.values && typeof record.values === 'object'
          ? (record.values as Record<string, unknown>)
          : record

      const values: Record<string, string> = {}
      for (const column of columns) {
        values[column.id] = cleanText(sourceValues[column.id])
      }

      // Support the original single-chart shape { size, chest, shoulder, ... }.
      if (!record.values) {
        for (const column of columns) {
          if (!values[column.id]) values[column.id] = cleanText(record[column.id])
        }
      }

      return { size, values }
    })
    .filter((row): row is SizeGuideRow => Boolean(row))
}

function normalizeChart(value: unknown, index: number): SizeGuideChart | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const label = cleanText(record.label) || `Chart ${index + 1}`
  const id = slugifyCategory(cleanText(record.id) || label) || `chart-${index + 1}`
  const columns = normalizeColumns(record.columns)
  const rows = normalizeRows(record.rows, columns)
  const categoryIds = Array.isArray(record.categoryIds)
    ? record.categoryIds
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    : []

  return { id, label, categoryIds, columns, rows }
}

/** Accepts new multi-chart JSON or the old single-table array. */
export function normalizeSizeGuides(value: unknown): SizeGuideChart[] {
  if (Array.isArray(value) && value.length > 0) {
    const looksLikeLegacyRows = value.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        'size' in item &&
        !('columns' in item) &&
        !('rows' in item),
    )

    if (looksLikeLegacyRows) {
      const columns = DEFAULT_SIZE_GUIDE_COLUMNS.map((column) => ({ ...column }))
      return [
        {
          id: 'tops',
          label: 'Tops',
          categoryIds: ['shirts', 't-shirts', 'outerwear'],
          columns,
          rows: normalizeRows(value, columns),
        },
      ]
    }

    const charts = value
      .map((item, index) => normalizeChart(item, index))
      .filter((chart): chart is SizeGuideChart => Boolean(chart))

    if (charts.length) {
      const used = new Set<string>()
      return charts.map((chart, index) => {
        let id = chart.id
        while (used.has(id)) id = `${chart.id}-${index + 1}`
        used.add(id)
        return { ...chart, id }
      })
    }
  }

  return createDefaultSizeGuides()
}

export function findSizeGuideForCategory(
  charts: SizeGuideChart[],
  categoryId: string,
): SizeGuideChart | null {
  if (!charts.length) return null
  return (
    charts.find((chart) => chart.categoryIds.includes(categoryId)) ??
    charts[0] ??
    null
  )
}

export function sanitizeSizeGuides(charts: SizeGuideChart[]): SizeGuideChart[] {
  const normalized = normalizeSizeGuides(charts)
  return normalized
    .map((chart) => ({
      ...chart,
      label: chart.label.trim() || chart.id,
      columns: chart.columns.filter((column) => column.label.trim()),
      rows: chart.rows
        .map((row) => ({
          size: row.size.trim(),
          values: Object.fromEntries(
            Object.entries(row.values).map(([key, value]) => [key, value.trim()]),
          ),
        }))
        .filter((row) => row.size),
    }))
    .filter((chart) => chart.columns.length > 0 && chart.rows.length > 0)
}
