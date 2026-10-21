import { useRef } from 'react'
import type { MouseEvent, PointerEvent } from 'react'

const AXIS_LOCK_PX = 10
const SWIPE_THRESHOLD_PX = 48

type SwipeState = {
  pointerId: number
  x: number
  y: number
  locked: 'x' | 'y' | null
}

export function useHorizontalSwipe(onSwipe: (direction: -1 | 1) => void) {
  const stateRef = useRef<SwipeState | null>(null)
  const suppressClickRef = useRef(false)

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    suppressClickRef.current = false
    stateRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      locked: null,
    }
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const state = stateRef.current
    if (!state || state.pointerId !== event.pointerId || state.locked === 'y') {
      return
    }

    const dx = event.clientX - state.x
    const dy = event.clientY - state.y
    if (!state.locked) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return
      state.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (state.locked === 'y') return
    }

    try {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId)
      }
    } catch {
      // Pointer capture is unavailable for this event. The swipe still
      // completes from the pointerup that follows a gesture inside the node.
    }
  }

  function finish(event: PointerEvent<HTMLElement>) {
    const state = stateRef.current
    if (!state || state.pointerId !== event.pointerId) return
    stateRef.current = null
    if (state.locked !== 'x') return

    suppressClickRef.current = true
    const dx = event.clientX - state.x
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return
    onSwipe(dx < 0 ? 1 : -1)
  }

  function onPointerCancel(event: PointerEvent<HTMLElement>) {
    if (stateRef.current?.pointerId === event.pointerId) {
      stateRef.current = null
    }
  }

  function onClickCapture(event: MouseEvent<HTMLElement>) {
    if (!suppressClickRef.current) return
    suppressClickRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: finish,
    onPointerCancel,
    onClickCapture,
  }
}
