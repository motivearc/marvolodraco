import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applyManifestForPath } from '../../utils/pwa'

/**
 * Keep the document manifest aligned after client-side navigations.
 * Install still requires a full /admin document load (see usePWAInstall).
 */
export function PWAManifestLink() {
  const { pathname } = useLocation()

  useEffect(() => {
    applyManifestForPath(pathname)
  }, [pathname])

  return null
}
