import { pwaConfig } from '../config/pwa'

export const PWA_DISMISS_KEY = 'pwa-install-dismissed'
export const ADMIN_MANIFEST_HREF = '/admin.webmanifest'
export const CUSTOMER_MANIFEST_HREF = '/site.webmanifest'
export const ADMIN_PWA_INSTALL_PENDING_KEY = 'admin-pwa-install-pending'
export const ADMIN_MANIFEST_READY_KEY = 'admin-manifest-ready'

export function isAdminRoute(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

/** Keep the active manifest in sync with the current path. */
export function applyManifestForPath(pathname: string) {
  const admin = isAdminRoute(pathname)
  const href = admin ? ADMIN_MANIFEST_HREF : CUSTOMER_MANIFEST_HREF
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
      admin ? `${pwaConfig.shortName} Admin` : pwaConfig.shortName,
    )
  }

  // Only a full document load of /admin (index.html boot script) may set
  // ADMIN_MANIFEST_READY_KEY. Client-side navigations must clear it so install
  // forces a reload and the browser binds to admin.webmanifest.
  try {
    if (!admin) {
      sessionStorage.removeItem(ADMIN_MANIFEST_READY_KEY)
    }
  } catch {
    // Private mode can block storage.
  }

  return admin
}

export function isAdminManifestReady() {
  try {
    if (sessionStorage.getItem(ADMIN_MANIFEST_READY_KEY) !== '1') return false
  } catch {
    return false
  }

  const href =
    document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.href ?? ''
  return href.includes('admin.webmanifest')
}

export function readAdminInstallPending() {
  try {
    return sessionStorage.getItem(ADMIN_PWA_INSTALL_PENDING_KEY) === '1'
  } catch {
    return false
  }
}

export function setAdminInstallPending(pending: boolean) {
  try {
    if (pending) {
      sessionStorage.setItem(ADMIN_PWA_INSTALL_PENDING_KEY, '1')
    } else {
      sessionStorage.removeItem(ADMIN_PWA_INSTALL_PENDING_KEY)
    }
  } catch {
    // Private mode can block storage.
  }
}

/**
 * Full document load of /admin so the browser binds install to admin.webmanifest
 * (client-side React navigation alone is not enough).
 */
export function hardNavigateForAdminInstall() {
  setAdminInstallPending(true)
  const url = new URL('/admin', window.location.origin)
  url.searchParams.set('pwa', 'admin')
  window.location.replace(url.toString())
}

export function readInstallDismissed(now = Date.now()) {
  try {
    const raw = localStorage.getItem(PWA_DISMISS_KEY)
    if (!raw) return false
    const dismissedAt = Number(raw)
    if (!Number.isFinite(dismissedAt)) return false
    const cooldownMs = pwaConfig.dismissalDays * 24 * 60 * 60 * 1000
    return now - dismissedAt < cooldownMs
  } catch {
    return false
  }
}

export function rememberInstallDismissed() {
  try {
    localStorage.setItem(PWA_DISMISS_KEY, String(Date.now()))
  } catch {
    // Private mode can block storage. The banner still closes for this visit.
  }
}
