import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep flag-icons SVGs as separate files so only the flags actually shown are downloaded
    assetsInlineLimit: (filePath) => (filePath.includes('flag-icons') ? false : undefined),
  },
})
