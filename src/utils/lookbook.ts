import type { LookbookImage } from '../types/content'

export function clampFocus(value: number) {
  if (!Number.isFinite(value)) return 50
  return Math.min(100, Math.max(0, value))
}

export function lookbookObjectPosition(image: Pick<LookbookImage, 'focusX' | 'focusY'>) {
  return `${clampFocus(image.focusX)}% ${clampFocus(image.focusY)}%`
}

export function emptyLookbookImage(): LookbookImage {
  return {
    src: '',
    alt: 'Lookbook image',
    span: 'normal',
    focusX: 50,
    focusY: 50,
  }
}
