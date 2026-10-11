import { pwaConfig } from '../config/pwa'
import { brand } from '../data/brand'
import { useContent } from '../context/ContentContext'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { buildWhatsAppGeneralUrl } from '../utils/whatsapp'

const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'Collection', href: '#collection' },
  { label: 'About', href: '#about' },
  { label: 'Size Guide', href: '#size-guide' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  const { whatsapp, activeWhatsApp } = useContent()
  const { showInstallAction, requestInstall } = usePWAInstall()
  const filledContacts = whatsapp.contacts.filter(
    (contact) => contact.active && contact.number,
  )
  const showFooterInstall = pwaConfig.showInstallInFooter && showInstallAction

  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-line bg-ink px-5 py-16 text-cream md:px-8 md:py-20 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <a
            href="#home"
            className="font-display text-3xl tracking-[0.08em] uppercase"
          >
            {brand.name}
          </a>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-sand">
            Premium clothing designed for effortless confidence, comfort and
            everyday sophistication. Browse the catalogue and order directly
            through WhatsApp.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-medium tracking-[0.18em] text-sand uppercase">
            Navigate
          </h3>
          <ul className="space-y-2.5">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-cream/80 transition hover:text-cream"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {showFooterInstall ? (
              <li>
                <button
                  type="button"
                  onClick={() => void requestInstall()}
                  className="text-left text-sm text-cream/80 transition hover:text-cream"
                >
                  Install App
                </button>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-medium tracking-[0.18em] text-sand uppercase">
            Contact
          </h3>
          <ul className="space-y-2.5 text-sm text-cream/80">
            {(filledContacts.length
              ? filledContacts
              : [activeWhatsApp]
            ).map((contact) => (
              <li key={`${contact.label}-${contact.number}`}>
                <a
                  href={buildWhatsAppGeneralUrl(contact.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-cream"
                >
                  WhatsApp
                  {filledContacts.length > 1 ? ` · ${contact.label}` : ''}:{' '}
                  {contact.display || contact.number}
                </a>
              </li>
            ))}
            <li>
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-cream"
              >
                Instagram: {brand.instagramHandle}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${brand.email}`}
                className="transition hover:text-cream"
              >
                {brand.email}
              </a>
            </li>
          </ul>

          <h3 className="mt-8 mb-4 text-xs font-medium tracking-[0.18em] text-sand uppercase">
            Policies
          </h3>
          <ul className="space-y-2.5 text-sm text-cream/80">
            <li>
              <a href="#faq" className="transition hover:text-cream">
                Delivery Policy
              </a>
            </li>
            <li>
              <a href="#faq" className="transition hover:text-cream">
                Exchange Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-sand/80 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </p>
        <p>Catalogue only — orders completed via WhatsApp.</p>
      </div>

      <div className="mx-auto mt-4 max-w-7xl text-center text-[11px] text-sand/60 sm:text-xs">
        <span>Developed by </span>
        <a
          href="https://motivearc.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-cream"
        >
          Motive Arc
          <sup className="ml-0.5 text-[9px]">™</sup>
        </a>
      </div>
    </footer>
  )
}
