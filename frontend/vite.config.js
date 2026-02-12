import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Read API base from environment or use default
const API_PROXY = process.env.VITE_API_BASE_URL || 'http://localhost:5000';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: API_PROXY,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(API_PROXY + '/api')
  }
}))
