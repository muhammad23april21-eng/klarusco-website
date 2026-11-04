import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Clock, MessageSquareText, UserRoundCheck } from 'lucide-react'
import { contact, howItWorks, images, plans, quote, routes, type Plan, type PlanId } from '../content/site'
import { useSelection } from '../hooks/SelectionContext'
import { ease, inView } from '../components/motion'
import { stepIcons } from '../components/icons'
import { Eyebrow, MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { ButtonLink } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'

const planIcons = { hourly: Clock, monthly: UserRoundCheck }

/**
 * Step 1 — "Tell Us About Your Business", taken from the (temporarily disabled) How It Works page,
 * using the same timeline markup and styles (journey__*, vig__*).
 */
function TellUsStep() {
  const step = howItWorks.steps[0]
  const Icon = stepIcons[0]
  return (
    <section className="section section--ivory journey" aria-label={step.title}>
      <div className="container">
        <ol className="journey__track">
          <span className="journey__rail" aria-hidden="true" />
          <motion.li className="journey__step" initial="hidden" whileInView="show" viewport={inView}>
            <motion.span
              className="journey__node"
              aria-hidden="true"
              variants={{ hidden: { scale: 0.4, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.6, ease } } }}
            >
              <Icon size={22} strokeWidth={1.4} />
            </motion.span>
            <motion.div
              className="journey__text"
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.1 } } }}
            >
              <span className="journey__num">01</span>
              <span className="journey__label">Step 1</span>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
            </motion.div>
            <motion.div
              className="journey__visual"
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.2 } } }}
            >
              <div className="vig vig--message">
                <div className="vig__bar">
                  <MessageSquareText size={16} aria-hidden="true" />
                  <span>Your requirements</span>
                </div>
                <p className="vig__quote">Share your bookkeeping and accounting requirements with us.</p>
                <div className="vig__lines" aria-hidden="true">
                  <span style={{ width: '88%' }} />
                  <span style={{ width: '72%' }} />
                  <span style={{ width: '54%' }} />
                </div>
              </div>
            </motion.div>
          </motion.li>
        </ol>
      </div>
    </section>
  )
}
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

/** Five days × eight hours — a literal picture of the monthly plan's dedicated professional. */
function WeekViz() {
  return (
    <div className="week" role="img" aria-label="A dedicated professional working 5 days a week, 8 hours a day">
      {days.map((d, di) => (
        <div key={d} className="week__day">
          <span className="week__label">{d}</span>
          <div className="week__hours">
            {Array.from({ length: 8 }).map((_, h) => (
              <motion.span
                key={h}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, ease, delay: 0.2 + di * 0.08 + h * 0.03 }}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="week__legend">
        <strong>5</strong> days a week <span>·</span> <strong>8</strong> hours a day
      </div>
    </div>
  )
}

/** Uneven bars that read as "billed on actual hours worked" without implying any figures. */
function HoursViz() {
  const pattern = [3, 6, 2, 5, 1, 4, 7, 2, 3, 5]
  return (
    <div className="hours" role="img" aria-label="Billed based on the actual hours worked">
      <div className="hours__bars">
        {pattern.map((h, i) => (
          <motion.span
            key={i}
            style={{ height: `${(h / 8) * 100}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.2 + i * 0.05 }}
          />
        ))}
      </div>
      <div className="hours__legend">Billed based on the actual hours worked</div>
    </div>
  )
}

function PricingBanner() {
  return (
    <section className="price-banner">
      <div className="container price-banner__grid">
        <div className="price-banner__copy">
          <motion.nav
            aria-label="Breadcrumb"
            className="crumbs crumbs--dark"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <Link to="/">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">How It Works</span>
          </motion.nav>
          <motion.p className="eyebrow eyebrow--forest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {quote.eyebrow}
          </motion.p>
          <TextReveal as="h1" immediate delay={0.35} className="price-banner__title" text={quote.heading} />
          {quote.intro.map((p, i) => (
            <motion.p
              key={p}
              className={i === 0 ? 'lead' : undefined}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.8 + i * 0.12 }}
            >
              {p}
            </motion.p>
          ))}
        </div>
        <div className="price-banner__media">
          <MaskImage src={images.pricingDesk} alt="Tidy desk with notebook, laptop, coffee and pens" className="price-banner__img" immediate delay={0.3} />
          <span className="price-banner__frame" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

/** The two engagement options, shown as static information cards (not selectable). */
function PlanCards() {
  return (
    <div className="chooser">
      {plans.map((p, i) => {
        const Icon = planIcons[p.id]
        return (
          <Reveal key={p.id} delay={i * 0.1} className="chooser__wrap">
            <div className={`chooser__opt chooser__opt--${p.id}`}>
              <span className="chooser__top">
                <span className="chooser__icon">
                  <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                </span>
              </span>
              <span className="chooser__name">{p.name}</span>
              {p.subtitle && <span className="chooser__sub">{p.subtitle}</span>}
              {p.highlight && <span className="chooser__sub">{p.highlight}</span>}
              <span className="chooser__desc">
                {p.description.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

function TierLedger({ plan }: { plan: Plan }) {
  const { selection, setSelection } = useSelection()
  const navigate = useNavigate()
  // One shared quote request for the plan: keeps a level chosen earlier for this plan, otherwise sends the plan only
  const requestQuote = () => {
    setSelection({ plan: plan.id, tier: selection.plan === plan.id ? selection.tier : null })
    navigate(routes.contact)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={plan.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="ledger__intro">
          <div>
            <Eyebrow tone="gold">{plan.name}</Eyebrow>
            <h2 id="ledger-title" className="display-2 text-ivory">
              {plan.pricing.heading}
            </h2>
            {plan.pricing.intro.map((p) => (
              <p key={p} className="text-ivory-soft">
                {p}
              </p>
            ))}
          </div>
          <div className="ledger__viz">{plan.id === 'monthly' ? <WeekViz /> : <HoursViz />}</div>
        </div>

        <ul className="ledger__rows">
          {plan.pricing.tiers.map((t, i) => {
            const chosen = selection.plan === plan.id && selection.tier === t.id
            return (
              <motion.li
                key={t.id}
                className={`ledger__row ${chosen ? 'is-chosen' : ''}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.1 }}
              >
                <div className="ledger__level">
                  <span className="ledger__bars" aria-hidden="true">
                    {[0, 1, 2].map((b) => (
                      <i key={b} className={b <= i ? 'on' : undefined} />
                    ))}
                  </span>
                  <h3>{t.title}</h3>
                </div>
                <p className="ledger__price">
                  <span className="ledger__amount">{t.price}</span>
                  <span className="ledger__unit">/ {t.unit}</span>
                </p>
                <p className="ledger__body">{t.body}</p>
              </motion.li>
            )
          })}
        </ul>
        <div className="ledger__cta">
          <button type="button" className="btn btn--gold btn--lg" onClick={requestQuote}>
            <span>Request a Quote</span>
            <ArrowRight className="btn__arrow" size={17} aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Pricing() {
  usePageTitle('How It Works')
  const [params, setParams] = useSearchParams()
  const { selection, setSelection } = useSelection()

  const fromUrl = params.get('plan')
  const active: PlanId = fromUrl === 'hourly' || fromUrl === 'monthly' ? fromUrl : (selection.plan ?? 'hourly')
  const plan = plans.find((p) => p.id === active)!

  // Keep the shared selection in sync when the page is opened with ?plan=…
  useEffect(() => {
    if ((fromUrl === 'hourly' || fromUrl === 'monthly') && selection.plan !== fromUrl) {
      setSelection({ plan: fromUrl, tier: null })
    }
  }, [fromUrl, selection.plan, setSelection])

  const choose = (id: PlanId) => {
    setSelection({ plan: id, tier: selection.plan === id ? selection.tier : null })
    setParams({ plan: id }, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PricingBanner />
      <TellUsStep />

      <section className="section section--white chooser-section" aria-labelledby="chooser-title">
        <div className="container">
          <div className="chooser-section__head">
            <span className="step-tag">Step 2</span>
            <h2 id="chooser-title" className="display-3">
              Choose Your Support Model
            </h2>
          </div>
          <PlanCards />
        </div>
      </section>

      <section className="section ledger" aria-labelledby="ledger-title">
        <div className="ledger__pattern" aria-hidden="true" />
        <div className="container">
          <div className="ledger__switch-row">
            <span className="step-tag step-tag--light">Step 3 · Choose Your Expertise Level</span>
            <div className="seg" role="tablist" aria-label="Pricing plan">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={active === p.id}
                  className={active === p.id ? 'is-on' : undefined}
                  onClick={() => choose(p.id)}
                >
                  {active === p.id && <motion.span layoutId="seg-pill" className="seg__pill" transition={{ duration: 0.45, ease }} />}
                  <span className="seg__label">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
          <TierLedger plan={plan} />
        </div>
      </section>

      <section className="section section--sage unsure" aria-labelledby="unsure-title">
        <div className="container unsure__inner">
          <div>
            <TextReveal id="unsure-title" className="display-2" text={contact.heading} />
            <Reveal delay={0.15}>
              <p className="lead">{contact.body}</p>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="unsure__actions">
            <ButtonLink to={routes.contact}>Contact Us</ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  )
}
