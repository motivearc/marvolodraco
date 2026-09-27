import { useEffect, useState } from 'react'
import { Feather, Home, LayoutGrid, Mail, Sparkles, type LucideIcon } from 'lucide-react'
import { pwaBottomNavItems, type PwaNavIcon } from '../../config/pwa'
import { useCustomerPwaNav } from '../../hooks/useIsStandalone'

const icons: Record<PwaNavIcon, LucideIcon> = {
  home: Home,
  sparkles: Sparkles,
  'layout-grid': LayoutGrid,
  feather: Feather,
  mail: Mail,
}

export function PWABottomNavigation() {
  const visible = useCustomerPwaNav()
  const active = useActiveSection(visible)

  if (!visible) return null

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-[calc(12px+env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-24px-env(safe-area-inset-left)-env(safe-area-inset-right))] max-w-[480px] -translate-x-1/2"
    >
      <ul className="flex items-stretch rounded-2xl border border-white/40 bg-cream/80 p-1 shadow-[0_10px_30px_rgba(28,27,26,0.14)] backdrop-blur-md">
        {pwaBottomNavItems.map((item) => {
          const Icon = icons[item.icon]
          const isActive = active === item.href
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <a
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-12 w-full flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1.5 text-[10px] leading-none transition active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                  isActive ? 'bg-ink text-cream' : 'text-ink-soft'
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="max-w-full truncate">{item.shortLabel}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState(() => window.location.hash || '#home')

  useEffect(() => {
    if (!enabled) return

    const update = () => {
      const marker = 96
      let current = pwaBottomNavItems[0]?.href ?? '#home'
      for (const item of pwaBottomNavItems) {
        const element = document.getElementById(item.href.slice(1))
        if (!element) continue
        if (element.getBoundingClientRect().top - marker <= 0) {
          current = item.href
        }
      }

      if (current === '#collection') {
        const arrivals = document.getElementById('new-arrivals')
        if (arrivals) {
          const top = arrivals.getBoundingClientRect().top
          if (top > -120 && top < window.innerHeight * 0.5) {
            current = '#new-arrivals'
          }
        }
      }

      setActive(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('hashchange', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('hashchange', update)
    }
  }, [enabled])

  return active
}
