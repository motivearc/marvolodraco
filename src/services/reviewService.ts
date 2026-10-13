import { reviews as fallbackReviews } from '../data/content'
import { requireSupabase } from '../lib/supabase'
import type { Review, ReviewDraft, ReviewStatus } from '../types/review'
import type { ReviewRow } from '../types/database'

export const REVIEW_NAME_MIN = 2
export const REVIEW_NAME_MAX = 80
export const REVIEW_TEXT_MIN = 10
export const REVIEW_TEXT_MAX = 600

export function getLocalReviews(): Review[] {
  return fallbackReviews.map((review) => ({
    id: String(review.id),
    name: review.name,
    rating: review.rating,
    text: review.text,
    status: 'approved',
    createdAt: '',
  }))
}

export function validateReviewDraft(draft: ReviewDraft): string | null {
  const name = draft.name.trim()
  const text = draft.text.trim()

  if (name.length < REVIEW_NAME_MIN) return 'Please add your name.'
  if (name.length > REVIEW_NAME_MAX) return 'Please use a shorter name.'
  if (!Number.isInteger(draft.rating) || draft.rating < 1 || draft.rating > 5) {
    return 'Choose a rating from 1 to 5 stars.'
  }
  if (text.length < REVIEW_TEXT_MIN) {
    return 'Please write a little more about your experience.'
  }
  if (text.length > REVIEW_TEXT_MAX) {
    return 'Please keep your review under 600 characters.'
  }
  return null
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating,
    text: row.body,
    status: row.status,
    createdAt: row.created_at,
  }
}

function isMissingReviewsTable(error: { message?: string; code?: string }): boolean {
  const code = error.code ?? ''
  const message = (error.message ?? '').toLowerCase()
  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    message.includes('schema cache') ||
    message.includes('does not exist')
  )
}

export function formatReviewError(error: unknown): string {
  const record =
    error && typeof error === 'object'
      ? (error as { message?: string; code?: string })
      : { message: error instanceof Error ? error.message : '' }
  const message = record.message ?? ''
  const lower = message.toLowerCase()

  if (isMissingReviewsTable(record) || isMissingReviewsTable({ message })) {
    return 'Reviews are not set up yet. Run supabase/migrate-reviews.sql in the Supabase SQL Editor, then try again.'
  }
  if (
    lower.includes('row-level security') ||
    lower.includes('permission denied') ||
    lower.includes('rls')
  ) {
    return 'That action needs an admin sign-in. Approve reviews from the dashboard.'
  }
  if (
    lower.includes('reviews_name_check') ||
    lower.includes('reviews_body_check') ||
    lower.includes('reviews_rating_check')
  ) {
    return 'Please check your name, rating, and review length.'
  }
  return message || 'Something went wrong with reviews.'
}

export async function fetchApprovedReviews(): Promise<Review[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('reviews')
    .select('id, name, rating, body, status, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapReview)
}

export async function fetchAllReviews(): Promise<Review[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('reviews')
    .select('id, name, rating, body, status, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapReview)
}

export async function submitReview(draft: ReviewDraft): Promise<void> {
  const validation = validateReviewDraft(draft)
  if (validation) throw new Error(validation)

  const client = requireSupabase()
  const { error } = await client.from('reviews').insert({
    name: draft.name.trim(),
    rating: draft.rating,
    body: draft.text.trim(),
    status: 'pending',
  })

  if (error) throw error
}

export async function setReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('reviews').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteReview(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('reviews').delete().eq('id', id)
  if (error) throw error
}
