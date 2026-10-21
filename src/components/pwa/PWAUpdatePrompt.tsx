import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useCustomerPwaNav } from '../../hooks/useIsStandalone'

export function PWAUpdatePrompt() {
  const customerPwaNav = useCustomerPwaNav()
  const [postponed, setPostponed] = useState(false)
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh || postponed) return null

  return (
    <section
      aria-label="App update"
      className={`fixed left-[max(0.75rem,env(safe-area-inset-left))] z-[70] w-[min(22rem,calc(100%-1.5rem))] rounded-2xl border border-line bg-black p-4 text-ink shadow-[0_10px_30px_rgba(0,0,0,0.45)] ${
        customerPwaNav
          ? 'bottom-[calc(6.5rem+env(safe-area-inset-bottom))]'
          : 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))]'
      }`}
    >
      <p className="text-sm font-medium">New version available.</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setNeedRefresh(false)
            void updateServiceWorker(true)
          }}
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-cream uppercase"
        >
          Update
        </button>
        <button
          type="button"
          onClick={() => setPostponed(true)}
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/40 px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-ink uppercase"
        >
          Later
        </button>
      </div>
    </section>
  )
}
