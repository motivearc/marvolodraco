export type InstallPlatform = 'ios' | 'android' | 'chromium' | 'other'

type IosNavigator = Navigator & { standalone?: boolean }

export function isIosDevice() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const classicIos = /iPad|iPhone|iPod/.test(ua)
  const iPadOs =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return classicIos || iPadOs
}

export function isIosSafari() {
  if (!isIosDevice()) return false
  const ua = navigator.userAgent
  const otherIosBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|GSA/i.test(ua)
  return /Safari/i.test(ua) && !otherIosBrowser
}

export function isAndroidDevice() {
  if (typeof navigator === 'undefined') return false
  return /Android/i.test(navigator.userAgent)
}

export function isFirefox() {
  if (typeof navigator === 'undefined') return false
  return /Firefox|FxiOS/i.test(navigator.userAgent)
}

export function getInstallPlatform(): InstallPlatform {
  if (typeof navigator === 'undefined') return 'other'
  if (isIosDevice()) return 'ios'
  if (isAndroidDevice()) return 'android'
  if (/Edg|Chrome|Chromium|OPR/i.test(navigator.userAgent)) return 'chromium'
  return 'other'
}

export function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false
  const standalone = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone = (window.navigator as IosNavigator).standalone === true
  return standalone || iosStandalone
}
