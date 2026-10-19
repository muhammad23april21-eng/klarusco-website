import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { images, routes, services, type Service } from '../content/site'
import { icons } from '../components/icons'
import { ease } from '../components/motion'
import { ButtonLink } from '../components/ui/Button'
import { Img } from '../components/ui/Img'
import { MaskImage, TextReveal } from '../components/ui/Reveal'
import { usePageTitle } from '../hooks/usePageTitle'

/** Descriptive alt text for each service photo (kept from the previous per-service sections). */
const imageAlt: Record<string, string> = {
  bookkeeping: 'Calculator, pen and financial paperwork on a desk',
  'financial-reporting': 'Laptop displaying financial charts',
  'management-consultancy': 'Team meeting around a conference table',
  'budgeting-and-forecasting': 'Hand-drawn growth chart with ruler and pens',
  'cost-control': 'Calculator and financial documents',
  'actuarial-valuation': 'Professional reviewing and signing documents',
}

function ServiceHead({ s, index, tone = 'dark' }: { s: Service; index: number; tone?: 'dark' | 'light' }) {
  const Icon = icons[s.icon]
  return (
    <div className={`svc-head svc-head--${tone}`}>
      <span className="svc-head__icon">
        <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
      </span>
      <span className="svc-head__num">Service {String(index + 1).padStart(2, '0')}</span>
    </div>
  )
}

function ServicesBanner() {
  return (
    <section className="svc-banner">
      <div className="svc-banner__panel">
        <div className="svc-banner__copy">
          <motion.nav
            aria-label="Breadcrumb"
            className="crumbs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <Link to="/">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">Services</span>
          </motion.nav>
          <TextReveal as="h1" immediate delay={0.35} className="banner__title" text={services.heading} />
          <motion.p className="banner__intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.8 }}>
            {services.intro}
          </motion.p>
        </div>
      </div>
      <div className="svc-banner__collage" aria-hidden="true">
        <MaskImage src={images.svcBookkeeping} alt="" className="svc-banner__img svc-banner__img--a" immediate delay={0.2} />
        <MaskImage src={images.svcBudgeting} alt="" className="svc-banner__img svc-banner__img--b" immediate delay={0.45} />
        <MaskImage src={images.svcReporting} alt="" className="svc-banner__img svc-banner__img--c" direction="left" immediate delay={0.7} />
      </div>
    </section>
  )
}

/** The original secondary services navbar — now drives the single showcase section below it. */
function ServiceNav({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const innerRef = useRef<HTMLDivElement>(null)
  // On narrow screens the navbar scrolls sideways: keep the selected service visible (without moving the page)
  useEffect(() => {
    const inner = innerRef.current
    const link = inner?.children[active] as HTMLElement | undefined
    if (!inner || !link || inner.scrollWidth <= inner.clientWidth) return
    const left = link.offsetLeft - inner.offsetLeft
    if (left < inner.scrollLeft || left + link.offsetWidth > inner.scrollLeft + inner.clientWidth) {
      inner.scrollTo({ left: Math.max(0, left - 16), behavior: 'smooth' })
    }
  }, [active])
  return (
    <nav className="svc-nav" aria-label="Services on this page">
      <div className="container svc-nav__inner" ref={innerRef}>
        {services.items.map((s, i) => (
          <a
            key={s.slug}
            href={`#${s.slug}`}
            className={i === active ? 'is-active' : undefined}
            aria-current={i === active ? 'true' : undefined}
            aria-controls="svc-showcase-panel"
            onMouseEnter={() => onSelect(i)}
            onFocus={() => onSelect(i)}
            onClick={(e) => {
              e.preventDefault()
              onSelect(i)
              // If the showcase has scrolled out of view, bring it back under the sticky navbar
              const panel = document.getElementById('svc-showcase-panel')
              if (panel && panel.getBoundingClientRect().top < 0) {
                document.getElementById('services-showcase')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {s.title}
          </a>
        ))}
      </div>
    </nav>
  )
}

/** Single main services section: shows the service selected in the navbar (Bookkeeping by default). */
function ServiceShowcase({ active }: { active: number }) {
  const s = services.items[active]
  const total = String(services.items.length).padStart(2, '0')
  return (
    <section id="services-showcase" className="section section--ivory svc-explorer" aria-label={services.eyebrow}>
      {/* Anchors for /services#<slug> links (e.g. from the footer): the layout scrolls here */}
      {services.items.map((item) => (
        <span key={item.slug} id={item.slug} className="svc-explorer__anchor" aria-hidden="true" />
      ))}
      <div className="container">
        <div id="svc-showcase-panel" className="svc-explorer__panel" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.slug}
              className="svc-explorer__panel-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <motion.figure
                className="svc-explorer__img"
                initial={{ clipPath: 'inset(0 0 0 100%)' }}
                animate={{ clipPath: 'inset(0 0 0 0%)' }}
                transition={{ duration: 0.9, ease }}
              >
                <motion.div className="svc-explorer__img-inner" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }}>
                  <Img src={s.image} alt={imageAlt[s.slug] ?? ''} />
                </motion.div>
                <figcaption className="svc-explorer__caption" aria-hidden="true">
                  {String(active + 1).padStart(2, '0')} / {total}
                </figcaption>
              </motion.figure>
              <motion.div
                className="svc-explorer__text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.15 }}
              >
                <ServiceHead s={s} index={active} />
                {s.badge && <span className="badge-gold">{s.badge}</span>}
                <h2 className="display-2">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={p} className={i === 0 ? 'lead' : undefined}>
                    {p}
                  </p>
                ))}
                <div className="svc-actions">
                  <ButtonLink to={routes.pricing}>Get a Quote</ButtonLink>
                  <ButtonLink to={routes.howItWorks} variant="text">
                    How it works
                  </ButtonLink>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default function Services() {
  usePageTitle('Our Services')
  const { hash } = useLocation()
  const fromHash = services.items.findIndex((item) => `#${item.slug}` === hash)
  const [active, setActive] = useState(fromHash >= 0 ? fromHash : 0)
  // Footer links like /services#cost-control select that service
  const [lastHash, setLastHash] = useState(hash)
  if (hash !== lastHash) {
    setLastHash(hash)
    if (fromHash >= 0) setActive(fromHash)
  }

  return (
    <>
      <ServicesBanner />
      <ServiceNav active={active} onSelect={setActive} />
      <ServiceShowcase active={active} />
    </>
  )
}
