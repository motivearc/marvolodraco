import { faqs as defaultFaqCopy } from '../data/content'
import type { FaqItem } from '../types/content'

export function createDefaultFaqs(): FaqItem[] {
  return defaultFaqCopy.map((item) => ({
    question: item.question,
    answer: item.answer,
  }))
}

export function emptyFaqItem(): FaqItem {
  return { question: '', answer: '' }
}

export function normalizeFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return createDefaultFaqs()
  }

  const items = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const record = item as Record<string, unknown>
      const question =
        typeof record.question === 'string' ? record.question.trim() : ''
      const answer =
        typeof record.answer === 'string' ? record.answer.trim() : ''
      if (!question && !answer) return null
      return { question, answer }
    })
    .filter((item): item is FaqItem => Boolean(item))

  return items.length ? items : createDefaultFaqs()
}

export function sanitizeFaqs(items: FaqItem[]): FaqItem[] {
  return items
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .filter((item) => item.question && item.answer)
}
