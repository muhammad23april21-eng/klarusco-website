import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local PHP server for the /api endpoints during `npm run dev` (start it with `npm run dev:api`).
const devApi = process.env.KLARUS_DEV_API ?? 'http://127.0.0.1:8099'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Development only: Vite cannot run PHP, so /api requests go to the local PHP server.
      '/api': {
        target: devApi,
        configure: (proxy) => {
          // The local mail.ini may only allow the production origins; requests from this
          // dev server come from your own machine, so drop the browser's Origin header.
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
        },
      },
    },
  },
  build: {
    // Keep flag-icons SVGs as separate files so only the flags actually shown are downloaded
    assetsInlineLimit: (filePath) => (filePath.includes('flag-icons') ? false : undefined),
  },
})
