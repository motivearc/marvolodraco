import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PWABottomNavigation } from './components/pwa/PWABottomNavigation'
import { PWAInstallInstructions } from './components/pwa/PWAInstallInstructions'
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt'
import { PWAInstallProvider } from './components/pwa/PWAInstallProvider'
import { PWAManifestLink } from './components/pwa/PWAManifestLink'
import { PWAOfflineNotice } from './components/pwa/PWAOfflineNotice'
import { PWAUpdatePrompt } from './components/pwa/PWAUpdatePrompt'
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import { AdminPage } from './pages/AdminPage'
import { StorefrontPage } from './pages/StorefrontPage'
import { isAdminPwaShell } from './utils/adminPwa'

function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <PWAInstallProvider>
            <PWAManifestLink />
            <PWAOfflineNotice />
            <PWAUpdatePrompt />
            <PWAInstallPrompt />
            <PWAInstallInstructions />
            {children}
          </PWAInstallProvider>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  )
}

export default function App() {
  // Dedicated admin.html entry: always the admin app (login + dashboard).
  // Home Screen installs that open admin.html never fall through to the storefront.
  if (isAdminPwaShell()) {
    return (
      <AppShell>
        <AdminPage />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <PWABottomNavigation />
      <Routes>
        <Route path="/" element={<StorefrontPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin.html" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
