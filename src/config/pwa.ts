import { brand } from '../data/brand'

/**
 * Optional install behaviour. The website keeps working in every browser
 * whether or not anyone installs it.
 *
 * Set ENABLE_ADMIN_PWA_INSTALL to true to show a small install option on /admin.
 */
export const ENABLE_ADMIN_PWA_INSTALL = false

export const pwaConfig = {
  enableCustomerInstall: true,
  enableAdminInstall: ENABLE_ADMIN_PWA_INSTALL,
  showInstallBanner: true,
  showInstallInMobileMenu: true,
  showInstallInFooter: true,
  dismissalDays: 7,
  installTitle: 'Get the App',
  installMessage:
    'Add this website to your Home Screen for faster access and a more app-like experience.',
  adminInstallTitle: 'Install Admin App',
  adminInstallMessage:
    'Add this site to your Home Screen. Admin keeps the same dashboard and navigation.',
  themeColor: '#1c1b1a',
  backgroundColor: '#f6f3ee',
  name: brand.name,
  shortName: brand.name,
  description: brand.description,
} as const

export type PwaNavIcon =
  | 'home'
  | 'sparkles'
  | 'layout-grid'
  | 'feather'
  | 'mail'

/**
 * Customer sections already used by the site navigation.
 * href values must stay in sync with the storefront section ids.
 */
export const pwaBottomNavItems: {
  label: string
  shortLabel: string
  href: string
  icon: PwaNavIcon
}[] = [
  { label: 'Home', shortLabel: 'Home', href: '#home', icon: 'home' },
  {
    label: 'New Arrivals',
    shortLabel: 'New',
    href: '#new-arrivals',
    icon: 'sparkles',
  },
  {
    label: 'Collection',
    shortLabel: 'Collection',
    href: '#collection',
    icon: 'layout-grid',
  },
  { label: 'About', shortLabel: 'About', href: '#about', icon: 'feather' },
  { label: 'Contact', shortLabel: 'Contact', href: '#contact', icon: 'mail' },
]
