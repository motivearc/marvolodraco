import { useEffect, useState, type FormEvent } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  REVIEW_TEXT_MAX,
  fetchApprovedReviews,
  formatReviewError,
  getLocalReviews,
  submitReview,
  validateReviewDraft,
} from '../services/reviewService'
import type { Review } from '../types/review'
import { ReviewStars } from './ReviewStars'
import { SectionHeading } from './SectionHeading'

const inputClass =
  'w-full border border-line bg-cream px-3 py-2.5 text-base text-ink outline-none focus:border-ink'

export function Reviews() {
  const configured = isSupabaseConfigured
  const [reviews, setReviews] = useState<Review[]>(() =>
    configured ? [] : getLocalReviews(),
  )
  const [loading, setLoading] = useState(configured)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!configured) return

    let mounted = true
    setLoading(true)

    fetchApprovedReviews()
      .then((rows) => {
        if (mounted) setReviews(rows)
      })
      .catch((error: unknown) => {
        if (!mounted) return
        const message = formatReviewError(error)
        if (message.includes('migrate-reviews.sql')) {
          setReviews(getLocalReviews())
          return
        }
        setFormError(message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [configured])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(false)

    const draft = { name, rating, text }
    const validation = validateReviewDraft(draft)
    if (validation) {
      setFormError(validation)
      return
    }

    if (!configured) {
      setFormError(
        'Reviews need Supabase before they can be saved for approval.',
      )
      return
    }

    setSubmitting(true)
    setFormError(null)
    try {
      await submitReview(draft)
      setName('')
      setRating(5)
      setText('')
      setSubmitted(true)
    } catch (error) {
      setFormError(formatReviewError(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="reviews"
      className="border-t border-line bg-mist px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Reviews"
          title="What our customers say"
          description="Quiet confidence, shared by people who wear Marvolo."
        />

        {loading ? (
          <p className="text-sm text-stone">Loading reviews…</p>
        ) : reviews.length ? (
          <div className="grid gap-8 md:grid-cols-2">
            {reviews.map((review) => (
              <figure key={review.id} className="border-t border-line pt-6">
                <ReviewStars rating={review.rating} />
                <blockquote className="mt-4 text-base leading-relaxed text-ink-soft md:text-lg">
                  “{review.text}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-medium tracking-wide text-ink">
                  {review.name}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-ink-soft/80">
            No published reviews yet. Be the first to share how Marvolo wears.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-14 max-w-2xl space-y-5 border border-line bg-cream p-6 md:p-8"
        >
          <div>
            <h3 className="font-display text-2xl font-medium text-ink">
              Write a review
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
              Tell us about the piece and the fit. Your note stays private until
              we approve it.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                Name
              </span>
              <input
                type="text"
                name="name"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
              />
            </label>
            <div className="space-y-2">
              <span className="block text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                Rating
              </span>
              <div className="flex h-[46px] items-center">
                <ReviewStars rating={rating} onChange={setRating} size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block space-y-2" htmlFor="review-text">
              <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                Review
              </span>
              <textarea
                id="review-text"
                name="review"
                required
                minLength={10}
                maxLength={REVIEW_TEXT_MAX}
                rows={4}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="How did the piece feel, fit, and look?"
                className={`${inputClass} resize-y`}
              />
            </label>
            <span className="block text-right text-xs text-stone">
              {text.trim().length}/{REVIEW_TEXT_MAX}
            </span>
          </div>

          {formError ? (
            <p className="text-sm text-red-700" role="alert">
              {formError}
            </p>
          ) : null}
          {submitted ? (
            <p className="text-sm text-ink" role="status">
              Thank you. Your review is with us and will appear here once
              approved.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="bg-ink px-5 py-3 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Submit review'}
          </button>
        </form>
      </div>
    </section>
  )
}
