import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const networkOnly = { handler: 'NetworkOnly' as const }

export default defineConfig({
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
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-192-maskable.png',
        'icons/icon-512-maskable.png',
      ],
      manifest: {
        name: 'Marvolo',
        short_name: 'Marvolo',
        description:
          'Discover premium clothing designed for effortless confidence, comfort and everyday sophistication.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        lang: 'en',
        theme_color: '#1c1b1a',
        background_color: '#f6f3ee',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
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
