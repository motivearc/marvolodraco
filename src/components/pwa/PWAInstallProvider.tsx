import type { ReactNode } from 'react'
import {
  PWAInstallContext,
  usePWAInstallController,
} from '../../hooks/usePWAInstall'

export function PWAInstallProvider({ children }: { children: ReactNode }) {
  const value = usePWAInstallController()
  return (
    <PWAInstallContext.Provider value={value}>
      {children}
    </PWAInstallContext.Provider>
  )
}
