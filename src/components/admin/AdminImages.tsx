import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import type {
  HeroContent,
  LookbookImage,
  WhatsAppContact,
  WhatsAppSettings,
} from '../../types/content'
import { LOOKBOOK_SPANS, WHATSAPP_SLOT_COUNT } from '../../types/content'
import { normalizeWhatsAppNumber } from '../../utils/whatsapp'
import { ImageField } from './ImageField'

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

  useEffect(() => {
    setHeroDraft(hero)
    setAboutDraft(aboutImage)
    setLookbookDraft(lookbookImages)
    setWhatsappDraft({
      contacts: emptySlots(whatsapp.contacts),
      activeIndex: whatsapp.activeIndex,
    })
  }, [hero, aboutImage, lookbookImages, whatsapp])

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
            placeholder="Timeless Style. Made for Every Occasion."
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
          <h3 className="font-display text-xl font-medium text-ink">
            Lookbook
          </h3>
          <button
            type="button"
            onClick={() =>
              setLookbookDraft((prev) => [
                ...prev,
                {
                  src: '',
                  alt: 'Lookbook image',
                  span: 'normal',
                },
              ])
            }
            className="inline-flex items-center gap-2 border border-ink px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink uppercase transition hover:bg-ink hover:text-cream"
          >
            <Plus className="size-3.5" />
            Add image
          </button>
        </div>

        <div className="space-y-4">
          {lookbookDraft.map((image, index) => (
            <div
              key={image.id ?? index}
              className="relative space-y-3 border border-line p-4"
            >
              <ImageField
                label={`Lookbook ${index + 1}`}
                value={image.src}
                onChange={(value) => {
                  setLookbookDraft((prev) =>
                    prev.map((item, i) =>
                      i === index ? { ...item, src: value } : item,
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
