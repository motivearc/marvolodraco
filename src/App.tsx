import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import { AdminPage } from './pages/AdminPage'
import { StorefrontPage } from './pages/StorefrontPage'

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StorefrontPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  )
}
