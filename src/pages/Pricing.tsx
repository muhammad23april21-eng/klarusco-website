import { useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock, UserRoundCheck } from 'lucide-react'
import { contact, images, plans, quote, routes, type Plan, type PlanId, type TierId } from '../content/site'
import { useSelection } from '../hooks/SelectionContext'
import { ease } from '../components/motion'
import { Eyebrow, MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { ButtonLink } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'

const planIcons = { hourly: Clock, monthly: UserRoundCheck }
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
            <span aria-current="page">Pricing</span>
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

function PlanChooser({ active, onChoose }: { active: PlanId; onChoose: (id: PlanId) => void }) {
  return (
    <div className="chooser" role="radiogroup" aria-label="Engagement option">
      {plans.map((p, i) => {
        const Icon = planIcons[p.id]
        const checked = active === p.id
        return (
          <Reveal key={p.id} delay={i * 0.1} className="chooser__wrap">
            <button
              type="button"
              role="radio"
              aria-checked={checked}
              className={`chooser__opt ${checked ? 'is-on' : ''}`}
              onClick={() => onChoose(p.id)}
              onKeyDown={(e) => {
                if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
                  e.preventDefault()
                  onChoose(plans[(i + 1) % plans.length].id)
                }
              }}
              tabIndex={checked ? 0 : -1}
            >
              {checked && <motion.span layoutId="chooser-bg" className="chooser__bg" transition={{ duration: 0.6, ease }} />}
              <span className="chooser__top">
                <span className="chooser__icon">
                  <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                </span>
                <span className="chooser__radio" aria-hidden="true">
                  {checked && <Check size={13} strokeWidth={3} />}
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
            </button>
          </Reveal>
        )
      })}
    </div>
  )
}

function TierLedger({ plan }: { plan: Plan }) {
  const { selection, setSelection } = useSelection()
  const navigate = useNavigate()
  const go = (tier: TierId, to: string) => {
    setSelection({ plan: plan.id, tier })
    navigate(to)
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
                <div className="ledger__actions">
                  <button type="button" className="btn btn--gold" onClick={() => go(t.id, routes.contact)}>
                    <span>Request a Quote</span>
                    <ArrowRight className="btn__arrow" size={16} aria-hidden="true" />
                  </button>
                  <button type="button" className="ledger__meet" onClick={() => go(t.id, routes.meeting)}>
                    <CalendarDays size={15} aria-hidden="true" /> Book a Meeting
                  </button>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Pricing() {
  usePageTitle('Get a Quote & Pricing')
  const [params, setParams] = useSearchParams()
  const { selection, setSelection } = useSelection()
  const ledgerRef = useRef<HTMLElement>(null)

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

      <section className="section section--white chooser-section" aria-labelledby="chooser-title">
        <div className="container">
          <div className="chooser-section__head">
            <span className="step-tag">Step 1</span>
            <h2 id="chooser-title" className="display-3">
              Choose Your Support Model
            </h2>
          </div>
          <PlanChooser active={active} onChoose={choose} />
          <div className="chooser-section__next">
            <button
              type="button"
              className="btn btn--forest btn--lg"
              onClick={() => ledgerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <span>{quote.nextLabel}</span>
              <ArrowRight className="btn__arrow" size={18} aria-hidden="true" />
            </button>
            <span className="chooser-section__hint" aria-live="polite">
              {plan.name} selected
            </span>
          </div>
        </div>
      </section>

      <section ref={ledgerRef} className="section ledger" aria-labelledby="ledger-title">
        <div className="ledger__pattern" aria-hidden="true" />
        <div className="container">
          <div className="ledger__switch-row">
            <span className="step-tag step-tag--light">Step 2 · Choose Your Expertise Level</span>
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
            <ButtonLink to={routes.meeting} variant="outline-dark" arrow={false} icon={<CalendarDays size={17} aria-hidden="true" />}>
              Book a Meeting
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  )
}
