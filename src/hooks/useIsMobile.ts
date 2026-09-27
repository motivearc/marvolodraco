import { useEffect, useState } from 'react'

/** Matches the site's lg breakpoint, where the hamburger menu is replaced by the desktop nav. */
const MOBILE_NAV_QUERY = '(max-width: 1023px)'

export function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia(MOBILE_NAV_QUERY).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(MOBILE_NAV_QUERY)
    const update = () => setMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return mobile
}
