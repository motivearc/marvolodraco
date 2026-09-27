import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PWABottomNavigation } from './components/pwa/PWABottomNavigation'
import { PWAInstallInstructions } from './components/pwa/PWAInstallInstructions'
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt'
import { PWAInstallProvider } from './components/pwa/PWAInstallProvider'
import { PWAOfflineNotice } from './components/pwa/PWAOfflineNotice'
import { PWAUpdatePrompt } from './components/pwa/PWAUpdatePrompt'
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import { AdminPage } from './pages/AdminPage'
import { StorefrontPage } from './pages/StorefrontPage'

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <PWAInstallProvider>
            <PWAOfflineNotice />
            <PWAUpdatePrompt />
            <PWAInstallPrompt />
            <PWAInstallInstructions />
            <PWABottomNavigation />
            <Routes>
              <Route path="/" element={<StorefrontPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PWAInstallProvider>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  )
}
