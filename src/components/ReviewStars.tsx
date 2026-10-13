import { Star } from 'lucide-react'

type ReviewStarsProps = {
  rating: number
  onChange?: (rating: number) => void
  size?: number
}

export function ReviewStars({ rating, onChange, size = 14 }: ReviewStarsProps) {
  const interactive = Boolean(onChange)

  return (
    <div
      className="flex gap-1"
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Rating' : `${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1
        const filled = value <= rating
        const icon = (
          <Star
            size={size}
            className={filled ? 'fill-ink text-ink' : 'text-sand'}
          />
        )

        if (!onChange) {
          return <span key={value}>{icon}</span>
        }

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value === 1 ? '' : 's'}`}
            onClick={() => onChange(value)}
            className="rounded-sm p-0.5 transition hover:opacity-70"
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}
