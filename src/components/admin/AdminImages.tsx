import { useEffect, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import type {
  HeroContent,
  LookbookImage,
  WhatsAppContact,
  WhatsAppSettings,
} from '../../types/content'
import { LOOKBOOK_SPANS, WHATSAPP_SLOT_COUNT } from '../../types/content'
import { emptyLookbookImage, lookbookObjectPosition } from '../../utils/lookbook'
import { normalizeWhatsAppNumber } from '../../utils/whatsapp'
import { ImageField } from './ImageField'
import { LookbookFrameField } from './LookbookFrameField'

function emptySlots(contacts: WhatsAppContact[]): WhatsAppContact[] {
  return Array.from({ length: WHATSAPP_SLOT_COUNT }, (_, index) => {
    const existing = contacts[index]
    return (
      existing ?? {
        label: `Line ${index + 1}`,
        number: '',
        display: '',
        active: false,
      }
    )
  })
}

export function AdminImages() {
  const {
    hero,
    aboutImage,
    lookbookImages,
    whatsapp,
    updateSiteContent,
    saving,
  } = useContent()
  const [heroDraft, setHeroDraft] = useState<HeroContent>(hero)
  const [aboutDraft, setAboutDraft] = useState(aboutImage)
  const [lookbookDraft, setLookbookDraft] = useState(lookbookImages)
  const [whatsappDraft, setWhatsappDraft] = useState<WhatsAppSettings>({
    contacts: emptySlots(whatsapp.contacts),
    activeIndex: whatsapp.activeIndex,
  })
  const [message, setMessage] = useState<string | null>(null)
  const [dragLookbookIndex, setDragLookbookIndex] = useState<number | null>(null)
  const [overLookbookIndex, setOverLookbookIndex] = useState<number | null>(null)

  useEffect(() => {
    setHeroDraft(hero)
    setAboutDraft(aboutImage)
    setLookbookDraft(
      lookbookImages.map((image) => ({
        ...image,
        focusX: image.focusX ?? 50,
        focusY: image.focusY ?? 50,
      })),
    )
    setWhatsappDraft({
      contacts: emptySlots(whatsapp.contacts),
      activeIndex: whatsapp.activeIndex,
    })
  }, [hero, aboutImage, lookbookImages, whatsapp])

  function moveLookbook(fromIndex: number, toIndex: number) {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= lookbookDraft.length ||
      toIndex >= lookbookDraft.length
    ) {
      return
    }
    setLookbookDraft((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  function updateHeroField<K extends keyof HeroContent>(
    key: K,
    value: HeroContent[K],
  ) {
    setHeroDraft((prev) => ({ ...prev, [key]: value }))
  }

  function updateWhatsAppContact(
    index: number,
    key: keyof WhatsAppContact,
    value: string,
  ) {
    setWhatsappDraft((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) =>
        i === index ? { ...contact, [key]: value } : contact,
      ),
    }))
  }

  async function handleSave() {
    setMessage(null)
    try {
      const contacts = emptySlots(whatsappDraft.contacts).map((contact) => {
        const number = normalizeWhatsAppNumber(contact.number)
        return {
          label: contact.label.trim() || 'Line',
          number,
          display: contact.display.trim(),
          active: contact.active && Boolean(number),
        }
      })
      if (!contacts.some((contact) => contact.active)) {
        const firstFilled = contacts.findIndex((contact) => contact.number)
        if (firstFilled >= 0) contacts[firstFilled].active = true
      }
      const activeIndex = Math.max(
        0,
        contacts.findIndex((contact) => contact.active),
      )

      await updateSiteContent({
        hero: {
          ...heroDraft,
          eyebrow: heroDraft.eyebrow.trim(),
          headline: heroDraft.headline.trim(),
          description: heroDraft.description.trim(),
          primaryCta: heroDraft.primaryCta.trim() || 'View Collection',
          secondaryCta: heroDraft.secondaryCta.trim() || 'Order on WhatsApp',
          images: heroDraft.images.filter((image) => image.trim()),
        },
        aboutImage: aboutDraft,
        lookbookImages: lookbookDraft.filter((image) => image.src.trim()),
        whatsapp: { contacts, activeIndex },
      })
      setMessage('Site content saved to Supabase.')
    } catch {
      // Error surfaced by ContentContext
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-medium text-ink">
            Site content
          </h2>
          <p className="mt-1 text-sm text-ink-soft/80">
            Edit the homepage hero copy and imagery, WhatsApp numbers, plus
            about and lookbook images.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="bg-ink px-4 py-3 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {message ? <p className="text-sm text-ink-soft">{message}</p> : null}

      <section className="space-y-4 border border-line p-5 md:p-6">
        <h3 className="font-display text-xl font-medium text-ink">
          WhatsApp numbers
        </h3>
        <p className="text-sm text-ink-soft/80">
          Store up to 3 numbers. Tick every line that should take orders.
          Order buttons, the nav link, and the floating chat rotate through the
          active numbers, one number per visit. Include the country code (e.g.
          60123456789).
        </p>

        <div className="space-y-4">
          {whatsappDraft.contacts.map((contact, index) => {
            return (
              <div key={index} className="space-y-3 border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                    Number {index + 1}
                  </p>
                  <label className="inline-flex items-center gap-2 text-xs tracking-[0.08em] text-ink-soft uppercase">
                    <input
                      type="checkbox"
                      checked={contact.active}
                      onChange={(event) => {
                        const active = event.target.checked
                        setWhatsappDraft((prev) => ({
                          ...prev,
                          contacts: prev.contacts.map((item, i) =>
                            i === index ? { ...item, active } : item,
                          ),
                        }))
                      }}
                      className="accent-ink"
                    />
                    Active
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="block space-y-2">
                    <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                      Label
                    </span>
                    <input
                      value={contact.label}
                      onChange={(event) =>
                        updateWhatsAppContact(index, 'label', event.target.value)
                      }
                      placeholder={`Line ${index + 1}`}
                      className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                      Number
                    </span>
                    <input
                      value={contact.number}
                      onChange={(event) =>
                        updateWhatsAppContact(
                          index,
                          'number',
                          event.target.value,
                        )
                      }
                      placeholder="60123456789"
                      inputMode="tel"
                      className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                      Display
                    </span>
                    <input
                      value={contact.display}
                      onChange={(event) =>
                        updateWhatsAppContact(
                          index,
                          'display',
                          event.target.value,
                        )
                      }
                      placeholder="+60 12-345 6789"
                      className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
                    />
                  </label>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-4 border border-line p-5 md:p-6">
        <h3 className="font-display text-xl font-medium text-ink">Hero</h3>
        <p className="text-sm text-ink-soft/80">
          Controls the first viewport: brand label, headline, supporting line,
          buttons, and background image slider.
        </p>

        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Brand label
          </span>
          <input
            value={heroDraft.eyebrow}
            onChange={(event) => updateHeroField('eyebrow', event.target.value)}
            placeholder="Marvolo"
            className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Headline
          </span>
          <input
            value={heroDraft.headline}
            onChange={(event) =>
              updateHeroField('headline', event.target.value)
            }
            placeholder="Optional — leave blank to hide"
            className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Supporting text
          </span>
          <textarea
            rows={3}
            value={heroDraft.description}
            onChange={(event) =>
              updateHeroField('description', event.target.value)
            }
            placeholder="Optional — leave blank to hide"
            className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
              Primary button
            </span>
            <input
              value={heroDraft.primaryCta}
              onChange={(event) =>
                updateHeroField('primaryCta', event.target.value)
              }
              placeholder="View Collection"
              className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
              Secondary button
            </span>
            <input
              value={heroDraft.secondaryCta}
              onChange={(event) =>
                updateHeroField('secondaryCta', event.target.value)
              }
              placeholder="Order on WhatsApp"
              className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
            />
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
              Slider images
            </p>
            <button
              type="button"
              onClick={() =>
                setHeroDraft((prev) => ({
                  ...prev,
                  images: [...prev.images, ''],
                }))
              }
              className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.12em] text-ink uppercase"
            >
              <Plus className="size-3.5" />
              Add slide
            </button>
          </div>
          {heroDraft.images.map((image, index) => (
            <div key={index} className="relative border border-line p-4">
              <ImageField
                label={`Slide ${index + 1}`}
                value={image}
                onChange={(value) =>
                  setHeroDraft((prev) => ({
                    ...prev,
                    images: prev.images.map((item, i) =>
                      i === index ? value : item,
                    ),
                  }))
                }
                hint={
                  index === 0
                    ? 'First slide is shown first and used as the fallback image.'
                    : undefined
                }
              />
              {heroDraft.images.length > 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setHeroDraft((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }))
                  }
                  className="absolute top-3 right-3 p-1.5 text-stone hover:text-ink"
                  aria-label={`Remove slide ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </div>
          ))}
          {heroDraft.images.length === 0 ? (
            <button
              type="button"
              onClick={() =>
                setHeroDraft((prev) => ({
                  ...prev,
                  images: [''],
                }))
              }
              className="border border-dashed border-line px-4 py-6 text-sm text-stone transition hover:border-ink hover:text-ink"
            >
              Add your first hero slide
            </button>
          ) : null}
        </div>
      </section>

      <section className="space-y-4 border border-line p-5 md:p-6">
        <h3 className="font-display text-xl font-medium text-ink">
          About image
        </h3>
        <ImageField
          label="About image"
          value={aboutDraft}
          onChange={setAboutDraft}
          hint="Shown in the brand story section."
        />
      </section>

      <section className="space-y-4 border border-line p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-medium text-ink">
              Lookbook
            </h3>
            <p className="mt-1 text-sm text-ink-soft/80">
              Drag tiles in the preview (or use the arrows) to set the order on
              the homepage. Save when you are done.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setLookbookDraft((prev) => [...prev, emptyLookbookImage()])
            }
            className="inline-flex items-center gap-2 border border-ink px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink uppercase transition hover:bg-ink hover:text-cream"
          >
            <Plus className="size-3.5" />
            Add image
          </button>
        </div>

        {lookbookDraft.some((image) => image.src.trim()) ? (
          <div className="space-y-3 border border-line bg-mist p-4">
            <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
              Layout preview
            </p>
            <div className="grid auto-rows-[100px] grid-cols-2 gap-2 md:auto-rows-[120px] md:grid-cols-4 md:gap-3">
              {lookbookDraft.map((image, index) => {
                const src = image.src.trim()
                if (!src) return null
                return (
                  <div
                    key={`preview-${image.id ?? index}`}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move'
                      event.dataTransfer.setData('text/plain', String(index))
                      setDragLookbookIndex(index)
                    }}
                    onDragEnd={() => {
                      setDragLookbookIndex(null)
                      setOverLookbookIndex(null)
                    }}
                    onDragOver={(event) => {
                      if (dragLookbookIndex === null) return
                      event.preventDefault()
                      setOverLookbookIndex(index)
                    }}
                    onDrop={(event) => {
                      event.preventDefault()
                      const from = Number(
                        event.dataTransfer.getData('text/plain') ||
                          dragLookbookIndex,
                      )
                      moveLookbook(from, index)
                      setDragLookbookIndex(null)
                      setOverLookbookIndex(null)
                    }}
                    className={`relative cursor-grab overflow-hidden bg-cream-dark active:cursor-grabbing ${
                      image.span === 'tall'
                        ? 'row-span-2'
                        : image.span === 'wide'
                          ? 'col-span-2'
                          : ''
                    } ${index === 0 ? 'col-span-2 md:col-span-1' : ''} ${
                      overLookbookIndex === index &&
                      dragLookbookIndex !== index
                        ? 'ring-2 ring-ink'
                        : ''
                    } ${dragLookbookIndex === index ? 'opacity-50' : ''}`}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{ objectPosition: lookbookObjectPosition(image) }}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                    <span className="absolute top-1.5 left-1.5 bg-ink/80 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-cream uppercase">
                      {index + 1}
                      {image.span !== 'normal' ? ` · ${image.span}` : ''}
                    </span>
                    <span className="absolute right-1.5 bottom-1.5 text-cream/90 drop-shadow">
                      <GripVertical className="size-4" />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          {lookbookDraft.map((image, index) => (
            <div
              key={image.id ?? index}
              onDragOver={(event) => {
                if (dragLookbookIndex === null) return
                event.preventDefault()
                setOverLookbookIndex(index)
              }}
              onDrop={(event) => {
                event.preventDefault()
                const from = Number(
                  event.dataTransfer.getData('text/plain') ||
                    dragLookbookIndex,
                )
                moveLookbook(from, index)
                setDragLookbookIndex(null)
                setOverLookbookIndex(null)
              }}
              className={`relative space-y-3 border border-line p-4 ${
                overLookbookIndex === index && dragLookbookIndex !== index
                  ? 'bg-mist'
                  : ''
              } ${dragLookbookIndex === index ? 'opacity-50' : ''}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pr-10">
                <div className="flex items-center gap-2">
                  <span
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move'
                      event.dataTransfer.setData('text/plain', String(index))
                      setDragLookbookIndex(index)
                    }}
                    onDragEnd={() => {
                      setDragLookbookIndex(null)
                      setOverLookbookIndex(null)
                    }}
                    className="cursor-grab p-1 text-stone active:cursor-grabbing"
                    aria-label={`Drag lookbook ${index + 1}`}
                  >
                    <GripVertical className="size-4" />
                  </span>
                  <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                    Lookbook {index + 1}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveLookbook(index, index - 1)}
                    className="p-1.5 text-stone transition hover:text-ink disabled:opacity-30"
                    aria-label={`Move lookbook ${index + 1} up`}
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === lookbookDraft.length - 1}
                    onClick={() => moveLookbook(index, index + 1)}
                    className="p-1.5 text-stone transition hover:text-ink disabled:opacity-30"
                    aria-label={`Move lookbook ${index + 1} down`}
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
              </div>
              <ImageField
                label="Image"
                value={image.src}
                onChange={(value) => {
                  setLookbookDraft((prev) =>
                    prev.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            src: value,
                            focusX: item.focusX ?? 50,
                            focusY: item.focusY ?? 50,
                          }
                        : item,
                    ),
                  )
                }}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                    Alt text
                  </span>
                  <input
                    value={image.alt}
                    onChange={(event) => {
                      const alt = event.target.value
                      setLookbookDraft((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, alt } : item,
                        ),
                      )
                    }}
                    className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                    Layout span
                  </span>
                  <select
                    value={image.span}
                    onChange={(event) => {
                      const span = event.target.value as LookbookImage['span']
                      setLookbookDraft((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, span } : item,
                        ),
                      )
                    }}
                    className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
                  >
                    {LOOKBOOK_SPANS.map((span) => (
                      <option key={span} value={span}>
                        {span}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <LookbookFrameField
                image={{
                  ...image,
                  focusX: image.focusX ?? 50,
                  focusY: image.focusY ?? 50,
                }}
                onChange={({ focusX, focusY }) => {
                  setLookbookDraft((prev) =>
                    prev.map((item, i) =>
                      i === index ? { ...item, focusX, focusY } : item,
                    ),
                  )
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setLookbookDraft((prev) =>
                    prev.filter((_, i) => i !== index),
                  )
                }
                className="absolute top-3 right-3 p-1.5 text-stone hover:text-ink"
                aria-label="Remove lookbook image"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {lookbookDraft.length === 0 ? (
            <p className="text-sm text-stone">No lookbook images yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
