import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const rootDir = dirname(fileURLToPath(import.meta.url))
const networkOnly = { handler: 'NetworkOnly' as const }

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        admin: resolve(rootDir, 'admin.html'),
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        'favicon.svg',
        'logo.png',
        'apple-touch-icon.png',
        'favicon-32x32.png',
        'favicon-16x16.png',
        'favicon.ico',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
        'site.webmanifest',
        'admin.webmanifest',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-192-maskable.png',
        'icons/icon-512-maskable.png',
      ],
      // Storefront + admin manifests live in /public so each HTML entry can
      // point at the correct start_url without an injected duplicate.
      manifest: false,
      workbox: {
        navigateFallback: '/index.html',
        // Keep admin.html as its own document (do not SPA-fallback it to index).
        navigateFallbackDenylist: [/^\/api\//, /admin\.html$/],
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff2}'],
        runtimeCaching: [
          { urlPattern: /^https:\/\/[^/]*\.supabase\.co\/.*/i, ...networkOnly },
          { urlPattern: /^https:\/\/([^/]*\.)?stripe\.com\/.*/i, ...networkOnly },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
