import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { pwaConfig } from '../config/pwa'
import { getInstallPlatform, type InstallPlatform } from '../utils/deviceDetection'
import {
  isAdminRoute,
  readInstallDismissed,
  rememberInstallDismissed,
} from '../utils/pwa'
import { useIsStandalone } from './useIsStandalone'

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type PWAInstallContextValue = {
  standalone: boolean
  platform: InstallPlatform
  canNativeInstall: boolean
  showInstallAction: boolean
  showBanner: boolean
  installedConfirmation: boolean
  instructionsOpen: boolean
  installTitle: string
  installMessage: string
  openInstructions: () => void
  closeInstructions: () => void
  dismissBanner: () => void
  dismissInstalledConfirmation: () => void
  requestInstall: () => Promise<void>
}

export const PWAInstallContext = createContext<PWAInstallContextValue | null>(null)

export function usePWAInstallController(): PWAInstallContextValue {
  const standalone = useIsStandalone()
  const { pathname } = useLocation()
  const admin = isAdminRoute(pathname)
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const [canNativeInstall, setCanNativeInstall] = useState(false)
  const [dismissed, setDismissed] = useState(readInstallDismissed)
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [installedConfirmation, setInstalledConfirmation] = useState(false)
  const platform = useMemo(() => getInstallPlatform(), [])

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault()
      deferredPrompt.current = event as BeforeInstallPromptEvent
      setCanNativeInstall(true)
    }

    const onInstalled = () => {
      deferredPrompt.current = null
      setCanNativeInstall(false)
      setInstructionsOpen(false)
      setInstalledConfirmation(true)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if (!installedConfirmation) return
    const timer = window.setTimeout(() => setInstalledConfirmation(false), 5000)
    return () => window.clearTimeout(timer)
  }, [installedConfirmation])

  const installAllowed = admin
    ? pwaConfig.enableAdminInstall
    : pwaConfig.enableCustomerInstall
  const showInstallAction = installAllowed && !standalone
  const showBanner =
    showInstallAction &&
    pwaConfig.showInstallBanner &&
    !dismissed &&
    !installedConfirmation &&
    (platform === 'ios' || canNativeInstall)

  const openInstructions = useCallback(() => setInstructionsOpen(true), [])
  const closeInstructions = useCallback(() => setInstructionsOpen(false), [])
  const dismissBanner = useCallback(() => {
    rememberInstallDismissed()
    setDismissed(true)
  }, [])
  const dismissInstalledConfirmation = useCallback(
    () => setInstalledConfirmation(false),
    [],
  )
  const requestInstall = useCallback(async () => {
    const promptEvent = deferredPrompt.current
    if (!promptEvent) {
      setInstructionsOpen(true)
      return
    }

    try {
      await promptEvent.prompt()
      await promptEvent.userChoice
      deferredPrompt.current = null
      setCanNativeInstall(false)
    } catch {
      setInstructionsOpen(true)
    }
  }, [])

  return useMemo(
    () => ({
      standalone,
      platform,
      canNativeInstall,
      showInstallAction,
      showBanner,
      installedConfirmation,
      instructionsOpen,
      installTitle: admin ? pwaConfig.adminInstallTitle : pwaConfig.installTitle,
      installMessage: admin
        ? pwaConfig.adminInstallMessage
        : pwaConfig.installMessage,
      openInstructions,
      closeInstructions,
      dismissBanner,
      dismissInstalledConfirmation,
      requestInstall,
    }),
    [
      standalone,
      platform,
      canNativeInstall,
      showInstallAction,
      showBanner,
      installedConfirmation,
      instructionsOpen,
      admin,
      openInstructions,
      closeInstructions,
      dismissBanner,
      dismissInstalledConfirmation,
      requestInstall,
    ],
  )
}

export function usePWAInstall() {
  const value = useContext(PWAInstallContext)
  if (!value) {
    throw new Error('usePWAInstall must be used within PWAInstallProvider')
  }
  return value
}
