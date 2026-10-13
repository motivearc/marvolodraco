import { useEffect, useState } from 'react'
import { Check, Trash2, Undo2 } from 'lucide-react'
import { ReviewStars } from '../ReviewStars'
import {
  deleteReview,
  fetchAllReviews,
  formatReviewError,
  setReviewStatus,
} from '../../services/reviewService'
import type { Review, ReviewStatus } from '../../types/review'

type ReviewFilter = 'pending' | 'approved'

function formatReviewDate(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function AdminReviews({ onChange }: { onChange?: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<ReviewFilter>('pending')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setReviews(await fetchAllReviews())
    } catch (err) {
      setError(formatReviewError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const pendingCount = reviews.filter((review) => review.status === 'pending').length
  const visible = reviews.filter((review) => review.status === filter)

  async function updateStatus(id: string, status: ReviewStatus) {
    setBusyId(id)
    setError(null)
    try {
      await setReviewStatus(id, status)
      setReviews((current) =>
        current.map((review) =>
          review.id === id ? { ...review, status } : review,
        ),
      )
      onChange?.()
    } catch (err) {
      setError(formatReviewError(err))
    } finally {
      setBusyId(null)
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this review permanently?')) return
    setBusyId(id)
    setError(null)
    try {
      await deleteReview(id)
      setReviews((current) => current.filter((review) => review.id !== id))
      onChange?.()
    } catch (err) {
      setError(formatReviewError(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-medium text-ink">Reviews</h2>
        <p className="mt-1 text-sm text-ink-soft/80">
          Customer notes stay hidden on the site until you approve them.
          {pendingCount ? ` ${pendingCount} waiting.` : ''}
        </p>
      </div>

      <div className="flex gap-2">
        {(
          [
            ['pending', 'Pending'],
            ['approved', 'Published'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`px-3 py-2 text-xs font-medium tracking-[0.12em] uppercase transition ${
              filter === id
                ? 'bg-ink text-cream'
                : 'border border-line text-ink-soft hover:border-ink hover:text-ink'
            }`}
          >
            {label}
            {id === 'pending' && pendingCount ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-stone">Loading reviews…</p>
      ) : visible.length === 0 ? (
        <p className="border border-line bg-cream p-6 text-sm text-ink-soft/80">
          {filter === 'pending'
            ? 'No reviews waiting. New submissions from the storefront land here.'
            : 'No published reviews yet.'}
        </p>
      ) : (
        <ul className="space-y-4">
          {visible.map((review) => {
            const busy = busyId === review.id
            return (
              <li key={review.id} className="space-y-4 border border-line bg-cream p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium tracking-wide text-ink">
                      {review.name}
                    </p>
                    {review.createdAt ? (
                      <p className="mt-1 text-xs text-stone">
                        {formatReviewDate(review.createdAt)}
                      </p>
                    ) : null}
                  </div>
                  <ReviewStars rating={review.rating} />
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {review.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  {review.status === 'pending' ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void updateStatus(review.id, 'approved')}
                      className="inline-flex items-center gap-2 bg-ink px-3 py-2 text-xs font-semibold tracking-[0.12em] text-cream uppercase transition hover:bg-ink-soft disabled:opacity-60"
                    >
                      <Check className="size-3.5" />
                      Approve
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void updateStatus(review.id, 'pending')}
                      className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink disabled:opacity-60"
                    >
                      <Undo2 className="size-3.5" />
                      Unpublish
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void remove(review.id)}
                    className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink disabled:opacity-60"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
