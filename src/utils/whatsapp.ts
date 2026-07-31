import { brand } from '../data/brand'

type WhatsAppOrderParams = {
  phoneNumber: string
  productName: string
  colour: string
  size: string
  price: number
}

/** Digits only — WhatsApp wa.me links reject spaces and +. */
export function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, '')
}

export function buildWhatsAppOrderUrl({
  phoneNumber,
  productName,
  colour,
  size,
  price,
}: WhatsAppOrderParams): string {
  const message = `Hi ${brand.name}, I would like to order the following item:

Product: ${productName}
Colour: ${colour}
Size: ${size}
Price: RM${price}

Is this item currently available?`

  const number = normalizeWhatsAppNumber(phoneNumber) || brand.whatsappNumber
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function buildWhatsAppGeneralUrl(
  phoneNumber: string,
  message?: string,
): string {
  const text =
    message ??
    `Hi ${brand.name}, I would like to know more about your collection.`
  const number = normalizeWhatsAppNumber(phoneNumber) || brand.whatsappNumber
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function formatPrice(price: number): string {
  return `RM${price}`
}
