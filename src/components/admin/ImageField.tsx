import { useEffect, useEffectEvent, useId, useState } from 'react'
import { Images, Upload, X } from 'lucide-react'
import {
  listMediaFiles,
  type MediaFile,
  uploadMediaFile,
} from '../../services/storageService'

type ImageFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
}

export function ImageField({ label, value, onChange, hint }: ImageFieldProps) {
  const inputId = useId()
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const publicUrl = await uploadMediaFile(file)
      onChange(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-28 w-24 shrink-0 object-cover bg-cream-dark"
          />
        ) : (
          <div className="flex h-28 w-24 shrink-0 items-center justify-center bg-cream-dark text-[10px] tracking-wider text-stone uppercase">
            No image
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="url"
            value={value}
            onChange={(event) => {
              setError(null)
              onChange(event.target.value)
            }}
            placeholder="https://… or select / upload an image"
            className="w-full border border-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setError(null)
                setPickerOpen(true)
              }}
              className="inline-flex cursor-pointer items-center gap-2 border border-ink px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink uppercase transition hover:bg-ink hover:text-cream"
            >
              <Images className="size-3.5" />
              Select existing
            </button>
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center gap-2 border border-line px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink"
            >
              <Upload className="size-3.5" />
              {uploading ? 'Uploading…' : 'Upload new'}
            </label>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                void handleFile(event.target.files?.[0])
                event.target.value = ''
              }}
            />
          </div>
          {hint ? <p className="text-xs text-stone">{hint}</p> : null}
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
        </div>
      </div>

      {pickerOpen ? (
        <ImagePickerModal
          selectedUrl={value}
          onSelect={(url) => {
            onChange(url)
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </div>
  )
}

type ImagePickerModalProps = {
  selectedUrl: string
  onSelect: (url: string) => void
  onClose: () => void
}

function ImagePickerModal({
  selectedUrl,
  onSelect,
  onClose,
}: ImagePickerModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const handleClose = useEffectEvent(() => onClose())

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const media = await listMediaFiles()
        if (!cancelled) setFiles(media)
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Could not load uploaded images.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      cancelled = true
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[70] flex items-end justify-center bg-ink/55 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-picker-title"
        className="relative flex max-h-[90svh] w-full max-w-3xl flex-col overflow-hidden bg-cream sm:rounded-sm"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2
              id="image-picker-title"
              className="font-display text-2xl tracking-wide text-ink"
            >
              Select image
            </h2>
            <p className="mt-1 text-xs tracking-wide text-stone">
              Choose an already uploaded image instead of uploading again.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close image picker"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-ink transition hover:bg-cream-dark"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {loading ? (
            <p className="py-12 text-center text-sm text-stone">Loading images…</p>
          ) : error ? (
            <p className="py-12 text-center text-sm text-red-700">{error}</p>
          ) : files.length === 0 ? (
            <p className="py-12 text-center text-sm text-stone">
              No uploaded images yet. Use Upload new to add one.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {files.map((file) => {
                const isSelected = file.publicUrl === selectedUrl
                return (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => onSelect(file.publicUrl)}
                    className={`group relative aspect-[4/5] overflow-hidden bg-cream-dark outline-none transition ${
                      isSelected
                        ? 'ring-2 ring-ink ring-offset-2 ring-offset-cream'
                        : 'hover:ring-1 hover:ring-ink/40'
                    }`}
                  >
                    <img
                      src={file.publicUrl}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    {isSelected ? (
                      <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-2 py-1.5 text-[10px] tracking-[0.14em] text-cream uppercase">
                        Current
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
