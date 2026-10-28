import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Charts (recharts is the biggest dep)
          'charts': ['recharts'],
          // Icons + utilities
          'ui': ['lucide-react', 'clsx'],
          // QR decoding
          'qr': ['jsqr'],
        },
      },
    },
    // Raise warning threshold slightly so only genuinely huge chunks warn
    chunkSizeWarningLimit: 600,
  },
})
