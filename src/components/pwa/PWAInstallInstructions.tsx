import { useEffect, useId, useRef, type ReactNode } from 'react'
import {
  Check,
  Home,
  Menu,
  MoreVertical,
  Plus,
  Share,
  Smartphone,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { usePWAInstall } from '../../hooks/usePWAInstall'
import { isIosSafari } from '../../utils/deviceDetection'
import { isAdminRoute } from '../../utils/pwa'

const customerBenefits = [
  'Faster access from your Home Screen',
  'A Home Screen icon for Marvolo',
  'An app-style interface on your phone, with quick section navigation',
  'Less browser interface when you open it from the Home Screen',
]

const adminBenefits = [
  'Faster access to the dashboard from your Home Screen',
  'A Home Screen icon',
  'The same admin tools, opened with less browser interface',
]

export function PWAInstallInstructions() {
  const { instructionsOpen, closeInstructions, platform } = usePWAInstall()
  const { pathname } = useLocation()
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const admin = isAdminRoute(pathname)
  const benefits = admin ? adminBenefits : customerBenefits

  useEffect(() => {
    if (!instructionsOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeInstructions()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [instructionsOpen, closeInstructions])

  if (!instructionsOpen) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/55 p-0 sm:items-center sm:p-6"
      onClick={closeInstructions}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-modal flex w-full max-w-lg flex-col overflow-hidden bg-cream shadow-xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-stone uppercase">
              Optional
            </p>
            <h2 id={titleId} className="font-display text-3xl text-ink">
              {admin ? 'Install Admin App' : 'Install Our App'}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeInstructions}
            aria-label="Close installation instructions"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-ink"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <h3 className="text-xs font-medium tracking-[0.16em] text-stone uppercase">
            Why install?
          </h3>
          <ul className="mt-3 space-y-2">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex gap-2 text-sm text-ink-soft">
                <Check className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">{renderSteps(platform)}</div>

          <p className="mt-6 border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
            After installation, open the app from your Home Screen to activate
            the app-style experience.
          </p>
        </div>
      </div>
    </div>
  )
}

function renderSteps(platform: ReturnType<typeof usePWAInstall>['platform']) {
  if (platform === 'ios') {
    const safari = isIosSafari()
    return (
      <InstructionList title="How to Install on iPhone">
        <Step icon={Share} label="Open this website using Safari." />
        {!safari ? (
          <Step
            icon={Smartphone}
            label="If you are in another browser, copy the address and open it in Safari first."
          />
        ) : null}
        <Step
          icon={Share}
          label="Tap the Share icon at the bottom or top of Safari."
        />
        <Step
          icon={Plus}
          label='Scroll down and tap "Add to Home Screen".'
        />
        <Step
          icon={Check}
          label='Make sure "Open as Web App" is enabled if the option is shown.'
        />
        <Step icon={Plus} label='Tap "Add".' />
        <Step icon={Home} label="Return to the Home Screen." />
        <Step
          icon={Smartphone}
          label="Tap the new app icon to launch the website as an app."
        />
      </InstructionList>
    )
  }

  if (platform === 'android') {
    return (
      <InstructionList title="How to Install on Android">
        <Step icon={Smartphone} label="Open this website in Chrome." />
        <Step icon={MoreVertical} label="Tap the three-dot menu." />
        <Step
          icon={Plus}
          label='Select "Install App" or "Add to Home Screen".'
        />
        <Step icon={Check} label="Confirm installation." />
        <Step icon={Home} label="Open the app from your Home Screen." />
      </InstructionList>
    )
  }

  if (platform === 'chromium') {
    return (
      <InstructionList title="How to Install">
        <Step icon={Menu} label="Open the browser menu." />
        <Step
          icon={Plus}
          label='Find "Apps" or "Install this site as an app". You can also use the install icon in the address bar.'
        />
        <Step icon={Check} label="Confirm installation." />
        <Step icon={Home} label="Open the app from your desktop or app list." />
      </InstructionList>
    )
  }

  return (
    <p className="text-sm leading-relaxed text-ink-soft">
      Your current browser may not support installing this website as an app.
      You can continue using the website normally.
    </p>
  )
}

function InstructionList({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <h3 className="text-xs font-medium tracking-[0.16em] text-stone uppercase">
        {title}
      </h3>
      <ol className="mt-3 space-y-3">{children}</ol>
    </div>
  )
}

function Step({
  icon: Icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-ink">
      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-ink">
        <Icon size={16} aria-hidden="true" />
      </span>
      <span>{label}</span>
    </li>
  )
}
