import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { isStandaloneDisplay } from '../utils/deviceDetection'
import { isAdminRoute } from '../utils/pwa'
import { useIsMobile } from './useIsMobile'

export function useIsStandalone() {
  const [standalone, setStandalone] = useState(isStandaloneDisplay)

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)')
    const update = () => setStandalone(isStandaloneDisplay())
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return standalone
}

/** Floating customer navigation: installed PWA, phone-sized layout, not admin. */
export function useCustomerPwaNav() {
  const standalone = useIsStandalone()
  const mobile = useIsMobile()
  const { pathname } = useLocation()
  return standalone && mobile && !isAdminRoute(pathname)
}
