import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, MoveDown } from 'lucide-react'
import { about, hero, howItWorks, images, plans, quote, routes, services, systems, whyUs } from '../content/site'
import { icons } from '../components/icons'
import { ease, inView, stagger } from '../components/motion'
import { ButtonLink } from '../components/ui/Button'
import { Img } from '../components/ui/Img'
import { Eyebrow, MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { BarsViz, LineChartViz } from '../components/ui/ChartViz'
import { ProcessCompact } from '../components/sections/ProcessCompact'
import { CtaBand } from '../components/sections/CtaBand'
import { usePageTitle } from '../hooks/usePageTitle'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function HomeHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      <motion.div className="hero__bg" style={{ y: bgY }}>
        <motion.div className="hero__zoom" initial={{ scale: 1.18 }} animate={{ scale: 1.02 }} transition={{ duration: 3.2, ease }}>
          <Img src={images.heroReports} alt="" loading="eager" fetchPriority="high" />
        </motion.div>
      </motion.div>
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <motion.div className="container hero__inner" style={{ y: copyY, opacity: copyOpacity }}>
        <div className="hero__copy">
          <motion.p
            className="hero__kicker"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
          >
            <span className="hero__kicker-line" aria-hidden="true" />
            {hero.experience}
          </motion.p>
          <TextReveal as="h1" id="hero-title" immediate delay={0.45} className="hero__title" text={hero.headline} />
          <motion.p
            className="hero__tagline"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 1.2 } } }}
          >
            {hero.tagline.map((t) => (
              <motion.span key={t} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}>
                {t}
              </motion.span>
            ))}
          </motion.p>
          <motion.p
            className="hero__body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.6 }}
          >
            {hero.intro}
          </motion.p>
          <motion.div
            className="hero__ctas"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 1.8 } } }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}>
              <ButtonLink to={hero.primaryCta.to} size="lg">
                {hero.primaryCta.label}
              </ButtonLink>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}>
              <ButtonLink
                to={hero.secondaryCta.to}
                variant="ghost-light"
                size="lg"
                arrow={false}
                icon={<CalendarDays size={18} aria-hidden="true" />}
              >
                {hero.secondaryCta.label}
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>

        <motion.aside
          className="hero__panel"
          aria-label="Illustrative reporting visual"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 1.4 }}
        >
          <LineChartViz tone="dark" immediate />
          <div className="hero__panel-foot">
            {['Bookkeeping', 'Financial Reporting', 'Budgeting & Forecasting'].map((t) => (
              <span key={t}>
                <Check size={13} strokeWidth={2.6} aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>
        </motion.aside>
      </motion.div>

      <motion.a
        href="#credibility"
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('credibility')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <span className="hero__scroll-track" aria-hidden="true">
          <span className="hero__scroll-dot" />
        </span>
        <span>Scroll to explore</span>
        <MoveDown size={14} aria-hidden="true" />
      </motion.a>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Credibility strip                                                   */
/* ------------------------------------------------------------------ */

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, to, { duration: 1.8, ease, onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [isInView, to])
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

// Every figure here is a count taken directly from the document's content.
const credibility = [
  { value: 20, suffix: '+', label: 'Years of professional experience' },
  { value: services.items.length, label: 'Accounting & financial services' },
  { value: systems.items.length, label: 'Accounting & ERP systems we work with' },
  { value: plans.length, label: 'Flexible engagement options' },
]

function Credibility() {
  return (
    <section id="credibility" className="cred" aria-label="At a glance">
      <motion.div className="container cred__inner" initial="hidden" whileInView="show" viewport={inView} variants={stagger.container}>
        {credibility.map((c) => (
          <motion.div key={c.label} className="cred__item" variants={stagger.item}>
            <span className="cred__value">
              <CountUp to={c.value} suffix={c.suffix} />
            </span>
            <span className="cred__label">{c.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Editorial introduction                                              */
/* ------------------------------------------------------------------ */

function Intro() {
  const [experience, value] = about.themes
  return (
    <section className="intro section">
      <div className="container intro__grid">
        <div className="intro__media">
          <MaskImage src={images.introMeeting} alt="Two professionals reviewing financial matters at a meeting table" className="intro__img-main" />
          <MaskImage src={images.homeAnalysis} alt="Financial reports and charts on a desk" className="intro__img-inset" direction="left" delay={0.3} />
          <Reveal className="intro__badge" delay={0.5}>
            <span className="intro__badge-num">
              20<sup>+</sup>
            </span>
            <span>Years of professional experience</span>
          </Reveal>
        </div>

        <div className="intro__copy">
          <Eyebrow tone="forest">About KlarusCo</Eyebrow>
          <TextReveal className="display-2" text={experience.title} />
          <Reveal delay={0.15}>
            <p className="lead">{experience.body}</p>
            <p>{hero.body}</p>
          </Reveal>
          <Reveal delay={0.25} className="intro__value">
            <span className="intro__value-label">{value.label}</span>
            <div>
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <ButtonLink to={routes.about} variant="text">
              More about us
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Services preview — an interactive index with an image that follows  */
/* ------------------------------------------------------------------ */

function ServicesPreview() {
  const [active, setActive] = useState(0)
  const current = services.items[active]
  return (
    <section className="svc-index section section--white" aria-labelledby="svc-index-title">
      <div className="container">
        <div className="svc-index__head">
          <div>
            <Eyebrow tone="forest">{services.eyebrow}</Eyebrow>
            <TextReveal id="svc-index-title" className="display-2" text={services.heading} />
          </div>
          <Reveal delay={0.15}>
            <p className="lead">{services.intro}</p>
          </Reveal>
        </div>

        <div className="svc-index__body">
          <ul className="svc-index__list">
            {services.items.map((s, i) => {
              const Icon = icons[s.icon]
              return (
                <li key={s.slug}>
                <Reveal delay={i * 0.05}>
                  <Link
                    to={`${routes.services}#${s.slug}`}
                    className={`svc-row ${i === active ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <span className="svc-row__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="svc-row__icon">
                      <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                    </span>
                    <span className="svc-row__text">
                      <span className="svc-row__title">
                        {s.title}
                        {s.badge && <em className="svc-row__badge">{s.badge}</em>}
                      </span>
                      <span className="svc-row__desc">{s.body[0]}</span>
                    </span>
                    <ArrowUpRight className="svc-row__arrow" size={22} aria-hidden="true" />
                  </Link>
                </Reveal>
                </li>
              )
            })}
          </ul>

          <div className="svc-index__stage" aria-hidden="true">
            {services.items.map((s, i) => (
              <motion.div
                key={s.slug}
                className="svc-index__img"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.06 }}
                transition={{ duration: 0.9, ease }}
              >
                <Img src={s.image} alt="" />
              </motion.div>
            ))}
            <div className="svc-index__caption">
              <span>{String(active + 1).padStart(2, '0')} / 06</span>
              <strong>{current.title}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Why choose us — image-led split                                     */
/* ------------------------------------------------------------------ */

function WhyChooseUs() {
  return (
    <section className="why" aria-labelledby="why-title">
      <div className="why__media">
        <MaskImage src={images.whyCollaboration} alt="Two colleagues celebrating at a desk with paperwork and a laptop" direction="right" />
        <div className="why__quote">
          <Eyebrow tone="light">Our Focus</Eyebrow>
          <p>
            {hero.tagline.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
        </div>
      </div>
      <div className="why__content">
        <Eyebrow tone="forest">Our Commitment</Eyebrow>
        <TextReveal id="why-title" className="display-2" text={whyUs.heading} />
        <motion.ul className="why__list" initial="hidden" whileInView="show" viewport={inView} variants={stagger.container}>
          {whyUs.items.map((b) => {
            const Icon = icons[b.icon]
            return (
              <motion.li key={b.title} variants={stagger.item} className="why__item">
                <span className="why__icon">
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </div>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Systems showcase — typographic marquee on forest green              */
/* ------------------------------------------------------------------ */

function SystemsShowcase() {
  const row = [...systems.items, ...systems.items]
  return (
    <section className="sys-show section section--forest" aria-labelledby="sys-show-title">
      <div className="container sys-show__head">
        <div>
          <Eyebrow tone="gold">Technology</Eyebrow>
          <TextReveal id="sys-show-title" className="display-2 text-ivory" text={systems.heading} />
        </div>
        <Reveal delay={0.15} className="sys-show__aside">
          <p>{systems.intro}</p>
          <ButtonLink to={routes.systems} variant="ghost-light">
            Explore systems
          </ButtonLink>
        </Reveal>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {row.map((name, i) => (
            <span key={i} className={`marquee__item ${i % 2 ? 'is-outline' : ''}`}>
              {name}
              <span className="marquee__sep">◆</span>
            </span>
          ))}
        </div>
      </div>
      <ul className="sr-only">
        {systems.items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <div className="container sys-show__custom">
        <Reveal className="sys-show__custom-inner">
          <span className="sys-show__custom-label">{systems.custom.title}</span>
          <p>{systems.custom.body}</p>
        </Reveal>
        <div className="sys-show__viz">
          <BarsViz tone="dark" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Process preview                                                     */
/* ------------------------------------------------------------------ */

function ProcessPreview() {
  return (
    <section className="section section--ivory process-preview" aria-labelledby="process-title">
      <div className="container">
        <div className="process-preview__head">
          <div>
            <Eyebrow tone="forest">{howItWorks.eyebrow}</Eyebrow>
            <TextReveal id="process-title" className="display-2" text={howItWorks.heading} />
          </div>
          <Reveal delay={0.2}>
            <ButtonLink to={routes.howItWorks} variant="text">
              See the full process
            </ButtonLink>
          </Reveal>
        </div>
        <ProcessCompact />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Pricing teaser                                                      */
/* ------------------------------------------------------------------ */

function PricingTeaser() {
  return (
    <section className="section section--white teaser" aria-labelledby="teaser-title">
      <div className="container teaser__grid">
        <div className="teaser__copy">
          <Eyebrow tone="forest">{quote.eyebrow}</Eyebrow>
          <TextReveal id="teaser-title" className="display-2" text={quote.heading} />
          <Reveal delay={0.15}>
            <p className="lead">{quote.intro[0]}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <ButtonLink to={routes.pricing}>View full pricing</ButtonLink>
          </Reveal>
        </div>

        <div className="teaser__plans">
          {plans.map((p, i) => {
            const prices = p.pricing.tiers.map((t) => t.price)
            const unit = p.pricing.tiers[0].unit
            return (
              <Reveal key={p.id} delay={0.1 + i * 0.12}>
                <Link to={`${routes.pricing}?plan=${p.id}`} className={`teaser-plan teaser-plan--${p.id}`}>
                  <span className="teaser-plan__name">{p.name}</span>
                  {p.subtitle && <span className="teaser-plan__sub">{p.subtitle}</span>}
                  {p.highlight && <span className="teaser-plan__sub">{p.highlight}</span>}
                  <span className="teaser-plan__range">
                    {prices[0]}
                    <span className="teaser-plan__dash">–</span>
                    {prices[prices.length - 1]}
                    <small>/ {unit}</small>
                  </span>
                  <span className="teaser-plan__levels">
                    {p.pricing.tiers.map((t) => (
                      <span key={t.id}>
                        {t.title} <b>{t.price}</b>
                      </span>
                    ))}
                  </span>
                  <span className="teaser-plan__go">
                    Choose this plan <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  usePageTitle()
  return (
    <>
      <HomeHero />
      <Credibility />
      <Intro />
      <ServicesPreview />
      <WhyChooseUs />
      <SystemsShowcase />
      <ProcessPreview />
      <PricingTeaser />
      <CtaBand image={images.ctaSkyline} />
    </>
  )
}
