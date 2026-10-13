import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { images, routes, services, type Service } from '../content/site'
import { icons } from '../components/icons'
import { ease } from '../components/motion'
import { ButtonLink } from '../components/ui/Button'
import { Img } from '../components/ui/Img'
import { MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { BarsViz, LineChartViz } from '../components/ui/ChartViz'
import { CtaBand } from '../components/sections/CtaBand'
import { usePageTitle } from '../hooks/usePageTitle'

const [bookkeeping, reporting, consultancy, budgeting, costControl, actuarial] = services.items

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

function QuoteLink({ light = false }: { light?: boolean }) {
  return (
    <ButtonLink to={routes.pricing} variant={light ? 'ghost-light' : 'text'}>
      Get a Quote
    </ButtonLink>
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

function ServiceNav() {
  return (
    <nav className="svc-nav" aria-label="Services on this page">
      <div className="container svc-nav__inner">
        {services.items.map((s, i) => (
          <a key={s.slug} href={`#${s.slug}`}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {s.title}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default function Services() {
  usePageTitle('Our Services')
  return (
    <>
      <ServicesBanner />
      <ServiceNav />

      {/* 01 Bookkeeping — feature split */}
      <section id={bookkeeping.slug} className="svc-feature" aria-labelledby={`${bookkeeping.slug}-title`}>
        <MaskImage src={bookkeeping.image} alt="Calculator, pen and financial paperwork on a desk" className="svc-feature__img" direction="right" />
        <div className="svc-feature__copy">
          <ServiceHead s={bookkeeping} index={0} />
          {bookkeeping.badge && <span className="badge-gold">{bookkeeping.badge}</span>}
          <TextReveal id={`${bookkeeping.slug}-title`} className="display-1" text={bookkeeping.title} />
          <Reveal delay={0.15}>
            {bookkeeping.body.map((p, i) => (
              <p key={p} className={i === 0 ? 'lead' : undefined}>
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.25} className="svc-actions">
            <ButtonLink to={routes.pricing}>Get a Quote</ButtonLink>
            <ButtonLink to={routes.howItWorks} variant="text">
              How it works
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* 02 Financial Reporting — copy + image with live chart overlay */}
      <section id={reporting.slug} className="section section--white svc-overlay" aria-labelledby={`${reporting.slug}-title`}>
        <div className="container svc-overlay__grid">
          <div className="svc-overlay__copy">
            <ServiceHead s={reporting} index={1} />
            <TextReveal id={`${reporting.slug}-title`} className="display-2" text={reporting.title} />
            <Reveal delay={0.15}>
              <p className="lead">{reporting.body[0]}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <QuoteLink />
            </Reveal>
          </div>
          <div className="svc-overlay__media">
            <MaskImage src={reporting.image} alt="Laptop displaying financial charts" direction="left" />
            <Reveal className="svc-overlay__chart" delay={0.5}>
              <LineChartViz />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 Management Consultancy — full-bleed image */}
      <section id={consultancy.slug} className="svc-bleed" aria-labelledby={`${consultancy.slug}-title`}>
        <div className="svc-bleed__bg">
          <Img src={consultancy.image} alt="" />
        </div>
        <div className="svc-bleed__overlay" aria-hidden="true" />
        <div className="container svc-bleed__inner">
          <div className="svc-bleed__copy">
            <ServiceHead s={consultancy} index={2} tone="light" />
            <TextReveal id={`${consultancy.slug}-title`} className="display-1 text-ivory" text={consultancy.title} />
            <Reveal delay={0.15}>
              <p className="lead text-ivory-soft">{consultancy.body[0]}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <QuoteLink light />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 + 05 Budgeting & Forecasting / Cost Control — paired editorial */}
      <section className="section section--sage svc-pair" aria-label={`${budgeting.title} and ${costControl.title}`}>
        <div className="container svc-pair__grid">
          {[budgeting, costControl].map((s, i) => (
            <article key={s.slug} id={s.slug} className={`svc-pair__item svc-pair__item--${i}`} aria-labelledby={`${s.slug}-title`}>
              <MaskImage src={s.image} alt={i === 0 ? 'Hand-drawn growth chart with ruler and pens' : 'Calculator and financial documents'} className="svc-pair__img" delay={i * 0.15} />
              <div className="svc-pair__copy">
                <ServiceHead s={s} index={3 + i} />
                <TextReveal id={`${s.slug}-title`} as="h2" className="display-3" text={s.title} />
                <Reveal delay={0.1}>
                  <p>{s.body[0]}</p>
                </Reveal>
                <Reveal delay={0.2}>
                  <QuoteLink />
                </Reveal>
              </div>
              {i === 0 && (
                <div className="svc-pair__viz">
                  <BarsViz />
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* 06 Actuarial Valuation — typographic with arch-framed image */}
      <section id={actuarial.slug} className="section section--ivory svc-typo" aria-labelledby={`${actuarial.slug}-title`}>
        <span className="svc-typo__glyph" aria-hidden="true">
          Σ
        </span>
        <div className="container svc-typo__grid">
          <div className="svc-typo__copy">
            <ServiceHead s={actuarial} index={5} />
            <TextReveal id={`${actuarial.slug}-title`} className="display-1" text={actuarial.title} />
            <Reveal delay={0.15}>
              <p className="lead">{actuarial.body[0]}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <QuoteLink />
            </Reveal>
          </div>
          <MaskImage src={actuarial.image} alt="Professional reviewing and signing documents" className="svc-typo__img" />
        </div>
      </section>

      {/* Quote CTA strip */}
      <section className="svc-quote">
        <div className="container svc-quote__inner">
          <Reveal>
            <p className="svc-quote__text">Every business has different accounting and financial management requirements.</p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link to={routes.pricing} className="svc-quote__link">
              Choose the plan that fits your business <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand image={images.pricingDesk} />
    </>
  )
}
