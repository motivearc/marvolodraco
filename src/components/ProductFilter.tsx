import type { FilterOption } from '../types/product'

const filters: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'New Arrivals', value: 'new-arrivals' },
  { label: 'Shirts', value: 'shirts' },
  { label: 'T-Shirts', value: 't-shirts' },
  { label: 'Pants', value: 'pants' },
  { label: 'Outerwear', value: 'outerwear' },
]

type ProductFilterProps = {
  active: FilterOption
  onChange: (filter: FilterOption) => void
}

export function ProductFilter({ active, onChange }: ProductFilterProps) {
  return (
    <div className="-mx-5 mb-10 overflow-x-auto px-5 md:mx-0 md:mb-12 md:overflow-visible md:px-0">
      <div
        className="flex w-max gap-2 md:w-full md:flex-wrap"
        role="tablist"
        aria-label="Product filters"
      >
        {filters.map((filter) => {
          const isActive = active === filter.value
          return (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(filter.value)}
              className={`rounded-sm border px-4 py-2 text-xs tracking-[0.12em] uppercase transition ${
                isActive
                  ? 'border-ink bg-ink text-cream'
                  : 'border-line bg-transparent text-ink-soft hover:border-ink hover:text-ink'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
