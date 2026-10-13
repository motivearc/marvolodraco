import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import type { FaqItem } from '../../types/content'
import { emptyFaqItem, sanitizeFaqs } from '../../utils/faqs'

const inputClass =
  'w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink'

function cloneFaqs(items: FaqItem[]): FaqItem[] {
  return structuredClone(items)
}

export function AdminFaqs() {
  const { faqs, updateSiteContent, saving } = useContent()
  const [draft, setDraft] = useState(() => cloneFaqs(faqs))
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(cloneFaqs(faqs))
  }, [faqs])

  function updateItem(index: number, key: keyof FaqItem, value: string) {
    setDraft((current) =>
      current.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    )
  }

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= draft.length) return
    setDraft((current) => {
      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  async function handleSave() {
    setMessage(null)
    setError(null)
    const cleaned = sanitizeFaqs(draft)
    if (!cleaned.length) {
      setError('Add at least one question and answer before saving.')
      return
    }
    try {
      await updateSiteContent({ faqs: cleaned })
      setMessage('FAQs saved to Supabase.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save FAQs.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-medium text-ink">FAQs</h2>
          <p className="mt-1 text-sm text-ink-soft/80">
            Edit the questions shown on the storefront. Changes sync to Supabase
            after you save.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDraft((current) => [...current, emptyFaqItem()])}
            className="inline-flex items-center gap-2 border border-line px-4 py-3 text-xs font-medium tracking-[0.16em] text-ink-soft uppercase transition hover:border-ink hover:text-ink"
          >
            <Plus className="size-4" />
            Add FAQ
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

      <ul className="space-y-4">
        {draft.map((item, index) => (
          <li key={index} className="space-y-4 border border-line bg-cream p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                Question {index + 1}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moveItem(index, index - 1)}
                  disabled={index === 0}
                  className="inline-flex items-center gap-1 border border-line px-2 py-1.5 text-xs tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink disabled:opacity-40"
                >
                  <ChevronUp className="size-3.5" />
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, index + 1)}
                  disabled={index === draft.length - 1}
                  className="inline-flex items-center gap-1 border border-line px-2 py-1.5 text-xs tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink disabled:opacity-40"
                >
                  <ChevronDown className="size-3.5" />
                  Down
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((current) =>
                      current.filter((_, i) => i !== index),
                    )
                  }
                  className="inline-flex items-center gap-1 border border-line px-2 py-1.5 text-xs tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink"
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </button>
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                Question
              </span>
              <input
                value={item.question}
                onChange={(event) =>
                  updateItem(index, 'question', event.target.value)
                }
                className={inputClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                Answer
              </span>
              <textarea
                rows={4}
                value={item.answer}
                onChange={(event) =>
                  updateItem(index, 'answer', event.target.value)
                }
                className={`${inputClass} resize-y`}
              />
            </label>
          </li>
        ))}
      </ul>

      {draft.length === 0 ? (
        <p className="border border-line bg-cream p-6 text-sm text-ink-soft/80">
          No FAQs yet. Add a question to get started.
        </p>
      ) : null}
    </div>
  )
}
