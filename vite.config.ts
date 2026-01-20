import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API requests to backend during development
    proxy: {
      '/api': {
        target: 'https://localhost:7257',
        changeOrigin: true,
        secure: false, // Accept self-signed certificates
        rejectUnauthorized: false,
        ws: true,
        logLevel: 'debug',
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy Error:', err.message);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`✅ ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`📤 Sending: ${req.method} ${req.url}`);
          });
        }
      }
    }
  }
})
