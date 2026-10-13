import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { brand } from '../../data/brand'
import { isAdminRoute } from '../../utils/pwa'

const CUSTOMER_MANIFEST = '/site.webmanifest'
const ADMIN_MANIFEST = '/admin.webmanifest'

/**
 * Point the document at the storefront or admin manifest so "Add to Home Screen"
 * / install uses the matching start_url (/, or /admin) instead of always Home.
 */
export function PWAManifestLink() {
  const { pathname } = useLocation()
  const admin = isAdminRoute(pathname)

  useEffect(() => {
    const href = admin ? ADMIN_MANIFEST : CUSTOMER_MANIFEST
    const links = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="manifest"]'),
    )

    const primary = links[0] ?? document.createElement('link')
    if (!links[0]) {
      primary.rel = 'manifest'
      document.head.appendChild(primary)
    }
    if (primary.getAttribute('href') !== href) {
      primary.setAttribute('href', href)
    }

    for (const extra of links.slice(1)) {
      extra.remove()
    }

    const appleTitle = document.querySelector(
      'meta[name="apple-mobile-web-app-title"]',
    )
    if (appleTitle) {
      appleTitle.setAttribute(
        'content',
        admin ? `${brand.name} Admin` : brand.name,
      )
    }
  }, [admin])

  return null
}
