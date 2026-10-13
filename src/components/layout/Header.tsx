import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Menu, X } from 'lucide-react'
import { brand, hero, nav, routes } from '../../content/site'
import { ease } from '../motion'
import { Logo } from './Logo'

/** Pages whose banner starts on a light background need dark header text before scrolling. */
const lightBannerRoutes: string[] = [routes.pricing]

export function Header() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const overLight = lightBannerRoutes.includes(pathname)
  const solid = scrolled || open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const tone = solid || overLight ? 'dark' : 'light'

  return (
    <header className={`header header--${tone} ${solid ? 'is-solid' : ''}`}>
      <div className={`topbar ${scrolled ? 'is-hidden' : ''}`}>
        <div className="container topbar__inner">
          <span className="topbar__note">
            <span className="topbar__rule" aria-hidden="true" />
            {brand.descriptor}
          </span>
          <span className="topbar__links">
            <span>{hero.tagline.join(' ')}</span>
          </span>
        </div>
      </div>

      <div className="container header__inner">
        <Logo tone={tone === 'dark' ? 'dark' : 'light'} />

        <nav className="nav" aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <NavLink to={routes.meeting} className="header__meeting">
            <CalendarDays size={16} aria-hidden="true" />
            <span>Book a Meeting</span>
          </NavLink>
          <NavLink to={routes.pricing} className="btn btn--gold header__cta">
            <span>Get a Quote</span>
            <ArrowRight className="btn__arrow" size={16} aria-hidden="true" />
          </NavLink>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease }}
          >
            <nav aria-label="Mobile">
              <ul>
                {nav.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease }}
                  >
                    <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                      <span className="mobile-menu__num">{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="mobile-menu__ctas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <NavLink to={routes.pricing} className="btn btn--gold">
                <span>Get a Quote</span>
              </NavLink>
              <NavLink to={routes.meeting} className="btn btn--ghost-light">
                <span>Book a Meeting</span>
              </NavLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
