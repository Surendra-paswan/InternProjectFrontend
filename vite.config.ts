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
        target: 'https://localhost:7257', // Change this if your backend runs on a different port
        changeOrigin: true,
        secure: false, // Accept self-signed certificates
        rejectUnauthorized: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy Error:', err.message);
            console.error('💡 Make sure your .NET backend is running on https://localhost:7257');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`✅ ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`📤 Proxying: ${req.method} ${req.url}`);
          });
        }
      }
    }
  }
})
