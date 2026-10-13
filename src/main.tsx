import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionGlobalConfig } from 'framer-motion'
import '@fontsource-variable/cormorant-garamond'
import '@fontsource-variable/manrope'
import './styles/index.css'
import App from './App'

// Dev-only: append ?static to the URL to render every animation in its final state (useful for screenshots).
if (import.meta.env.DEV && new URLSearchParams(location.search).has('static')) {
  MotionGlobalConfig.skipAnimations = true
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
