import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { LookbookImage } from '../../types/content'
import { clampFocus, lookbookObjectPosition } from '../../utils/lookbook'

type LookbookFrameFieldProps = {
  image: LookbookImage
  onChange: (focus: { focusX: number; focusY: number }) => void
}

function frameClass(span: LookbookImage['span']) {
  if (span === 'tall') return 'aspect-[3/4] max-w-[200px]'
  if (span === 'wide') return 'aspect-[2/1] max-w-md'
  return 'aspect-square max-w-[220px]'
}

export function LookbookFrameField({ image, onChange }: LookbookFrameFieldProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const src = image.src.trim()

  function setFocusFromPoint(clientX: number, clientY: number) {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const focusX = clampFocus(((clientX - rect.left) / rect.width) * 100)
    const focusY = clampFocus(((clientY - rect.top) / rect.height) * 100)
    onChange({ focusX, focusY })
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!src) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    setFocusFromPoint(event.clientX, event.clientY)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return
    setFocusFromPoint(event.clientX, event.clientY)
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    setDragging(false)
  }

  if (!src) {
    return (
      <p className="text-sm text-stone">
        Add an image first, then drag inside the frame to set the crop focus.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
          Frame focus
        </p>
        <p className="mt-1 text-sm text-ink-soft/80">
          Drag inside the frame to choose which part of the photo stays visible.
        </p>
      </div>

      <div
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full cursor-crosshair touch-none overflow-hidden border border-line bg-cream-dark select-none ${frameClass(image.span)} ${
          dragging ? 'ring-2 ring-ink' : ''
        }`}
        role="slider"
        aria-label="Lookbook image frame focus"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`Focus ${Math.round(image.focusX)}% horizontal, ${Math.round(image.focusY)}% vertical`}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{ objectPosition: lookbookObjectPosition(image) }}
          className="pointer-events-none h-full w-full object-cover"
        />
        <span
          className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cream bg-ink/70 shadow"
          style={{ left: `${clampFocus(image.focusX)}%`, top: `${clampFocus(image.focusY)}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Horizontal {Math.round(clampFocus(image.focusX))}%
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={clampFocus(image.focusX)}
            onChange={(event) =>
              onChange({
                focusX: Number(event.target.value),
                focusY: clampFocus(image.focusY),
              })
            }
            className="w-full accent-ink"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            Vertical {Math.round(clampFocus(image.focusY))}%
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={clampFocus(image.focusY)}
            onChange={(event) =>
              onChange({
                focusX: clampFocus(image.focusX),
                focusY: Number(event.target.value),
              })
            }
            className="w-full accent-ink"
          />
        </label>
      </div>
    </div>
  )
}
