import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { brand } from '../data/brand'
import { buildWhatsAppGeneralUrl } from '../utils/whatsapp'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'Collection', href: '#collection' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const { activeWhatsApp } = useContent()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const whatsappUrl = buildWhatsAppGeneralUrl(activeWhatsApp.number)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-line/70 bg-cream/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 lg:px-10">
        <a href="#home" className="inline-flex shrink-0 items-center" aria-label={brand.name}>
          <img
            src="/logo.png"
            alt={brand.name}
            className="h-10 w-auto object-contain md:h-12"
          />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm tracking-wide text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-sm bg-ink px-4 py-2.5 text-xs font-medium tracking-[0.14em] text-cream uppercase transition hover:bg-ink-soft sm:inline-flex"
          >
            WhatsApp Order
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center text-ink lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-t border-line/60 bg-cream transition-all duration-300 lg:hidden ${
          open ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block py-3 text-base text-ink-soft"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-sm bg-ink px-4 py-3 text-xs font-medium tracking-[0.14em] text-cream uppercase"
              onClick={() => setOpen(false)}
            >
              WhatsApp Order
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
