import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress React DevTools "disconnected port" error (harmless browser extension issue)
const originalError = console.error
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('disconnected port')) {
    return
  }
  originalError.apply(console, args)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
