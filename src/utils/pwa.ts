import { pwaConfig } from '../config/pwa'

export const PWA_DISMISS_KEY = 'pwa-install-dismissed'

export function isAdminRoute(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/')
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
