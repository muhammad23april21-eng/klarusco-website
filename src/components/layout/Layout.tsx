import { useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { ease } from '../motion'

/** Keeps the outgoing page's element alive while it animates out. */
function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

/** After a route change, scroll to the requested #hash (if any) or to the top. */
function useScrollRestoration(ready: boolean) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!ready) return
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, ready])
}

export function Layout() {
  const location = useLocation()
  const [entered, setEntered] = useState(location.pathname)
  useScrollRestoration(entered === location.pathname)

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <AnimatePresence mode="wait" onExitComplete={() => setEntered(location.pathname)}>
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6, ease } }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease } }}
        >
          <FrozenOutlet />
        </motion.main>
      </AnimatePresence>
      <motion.div
        key={`curtain-${location.pathname}`}
        className="route-curtain"
        aria-hidden="true"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.35 }}
      />
      <Footer />
    </>
  )
}
