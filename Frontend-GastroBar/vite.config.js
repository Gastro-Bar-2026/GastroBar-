import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: process.env.GASTROBAR_API_URL || 'http://localhost:3000',
        changeOrigin: true
      },
      '/health': {
        target: process.env.GASTROBAR_API_URL || 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
