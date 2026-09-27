import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { pwaConfig } from '../config/pwa'
import { useContent } from '../context/ContentContext'
import { brand } from '../data/brand'
import { useCustomerPwaNav } from '../hooks/useIsStandalone'
import { usePWAInstall } from '../hooks/usePWAInstall'
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
  const customerPwaNav = useCustomerPwaNav()
  const { showInstallAction, requestInstall } = usePWAInstall()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const whatsappUrl = buildWhatsAppGeneralUrl(activeWhatsApp.number)
  const showMenuInstall =
    pwaConfig.showInstallInMobileMenu && showInstallAction && !customerPwaNav

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-line/70 bg-cream/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between py-4 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:px-8 lg:px-10">
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
          {customerPwaNav ? null : (
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </nav>

      <div
        className={`overflow-hidden border-t border-line/60 bg-cream transition-all duration-300 lg:hidden ${
          customerPwaNav
            ? 'hidden'
            : open
              ? 'max-h-[480px] opacity-100'
              : 'max-h-0 opacity-0'
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
          {showMenuInstall ? (
            <li>
              <button
                type="button"
                className="block w-full py-3 text-left text-base text-ink"
                onClick={() => {
                  setOpen(false)
                  void requestInstall()
                }}
              >
                Install App
              </button>
            </li>
          ) : null}
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
