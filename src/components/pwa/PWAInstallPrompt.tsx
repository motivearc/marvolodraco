import { usePWAInstall } from '../../hooks/usePWAInstall'

export function PWAInstallPrompt() {
  const {
    showBanner,
    installedConfirmation,
    installTitle,
    installMessage,
    canNativeInstall,
    dismissBanner,
    dismissInstalledConfirmation,
    openInstructions,
    requestInstall,
  } = usePWAInstall()

  if (installedConfirmation) {
    return (
      <div
        role="status"
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-[max(0.75rem,env(safe-area-inset-left))] z-[45] w-[min(20rem,calc(100%-1.5rem))] rounded-2xl border border-line bg-cream/95 p-4 text-ink shadow-[0_10px_30px_rgba(28,27,26,0.12)] backdrop-blur-md md:bottom-[calc(6.5rem+env(safe-area-inset-bottom))]"
      >
        <p className="text-sm font-medium">App installed successfully.</p>
        <button
          type="button"
          onClick={dismissInstalledConfirmation}
          className="mt-3 text-xs tracking-[0.14em] text-stone uppercase"
        >
          Dismiss
        </button>
      </div>
    )
  }

  if (!showBanner) return null

  return (
    <section
      aria-label={installTitle}
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-[max(0.75rem,env(safe-area-inset-left))] z-[45] max-h-[40dvh] w-[min(22rem,calc(100%-5.75rem))] overflow-y-auto rounded-2xl border border-line/80 bg-cream/95 p-4 text-ink shadow-[0_10px_30px_rgba(28,27,26,0.12)] backdrop-blur-md md:bottom-[calc(6.5rem+env(safe-area-inset-bottom))] lg:left-8"
    >
      <p className="font-display text-xl leading-none">{installTitle}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-soft">{installMessage}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void requestInstall()}
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-cream uppercase"
        >
          Install App
        </button>
        <button
          type="button"
          onClick={dismissBanner}
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-line px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-ink-soft uppercase"
        >
          Not Now
        </button>
      </div>
      {canNativeInstall ? (
        <button
          type="button"
          onClick={openInstructions}
          className="mt-2 text-xs text-stone underline-offset-2 hover:underline"
        >
          How to install
        </button>
      ) : null}
    </section>
  )
}
