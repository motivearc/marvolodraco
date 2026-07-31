import { MessageCircle } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { buildWhatsAppGeneralUrl } from '../utils/whatsapp'

export function FloatingWhatsApp() {
  const { activeWhatsApp } = useContent()

  return (
    <a
      href={buildWhatsAppGeneralUrl(activeWhatsApp.number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1ebe57] md:right-8 md:bottom-8"
    >
      <MessageCircle size={24} fill="currentColor" strokeWidth={0} />
    </a>
  )
}
