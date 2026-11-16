import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Clock, MessageSquareText, UserRoundCheck, type LucideIcon } from 'lucide-react'
import { contact, howItWorksPage as page, images, plans, routes, type Plan, type PlanId } from '../content/site'
import { useSelection } from '../hooks/SelectionContext'
import { ease } from '../components/motion'
import { MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { ButtonLink } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'

/** Plans in the order the content document lists them (Monthly first). */
const planOrder: PlanId[] = ['monthly', 'hourly']
const planName = (id: PlanId) => page.step2.plans.find((p) => p.id === id)?.name ?? id

/** Shared step header: icon tile + "Step N" label above the heading, then the step's description. */
function StepHeader({
  icon: Icon,
  label,
  title,
  body,
  id,
  tone = 'dark',
}: {
  icon: LucideIcon
  label: string
  title: string
  body: string
  id: string
  tone?: 'dark' | 'light'
}) {
  return (
    <div className={`hiw-step__head hiw-step__head--${tone}`}>
      <span className="hiw-step__marker">
        <span className="hiw-step__icon" aria-hidden="true">
          <Icon size={20} strokeWidth={1.5} />
        </span>
        <span className="hiw-step__label">{label}</span>
      </span>
      <h2 id={id} className="display-2">
        <span className="sr-only">{label}: </span>
        {title}
      </h2>
      <p className="lead">{body}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Header / hero                                                       */
/* ------------------------------------------------------------------ */

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
          <TextReveal as="h1" immediate delay={0.35} className="price-banner__title" text={page.heading} />
          <motion.p
            className="price-banner__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.65 }}
          >
            {page.subheading}
          </motion.p>
          {page.intro.map((p, i) => (
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
          <MaskImage src={images.hiwDashboard} alt="Financial analytics dashboard with charts on a screen" className="price-banner__img" immediate delay={0.3} />
          <span className="price-banner__frame" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Step 1 — heading and content only                                   */
/* ------------------------------------------------------------------ */

function TellUsStep() {
  const s = page.step1
  return (
    <section className="section section--ivory hiw-step hiw-step--one" aria-labelledby="step1-title">
      <div className="container">
        <Reveal>
          <StepHeader icon={MessageSquareText} label={s.label} title={s.title} body={s.body} id="step1-title" />
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Step 2 — original design (restored)                                 */
/* ------------------------------------------------------------------ */

const chooserIcons = { hourly: Clock, monthly: UserRoundCheck }

/** The two engagement options, shown as static information cards (not selectable). Content: page.step2. */
function PlanCards() {
  return (
    <div className="chooser">
      {plans.map((p, i) => {
        const Icon = chooserIcons[p.id]
        const card = page.step2.plans.find((c) => c.id === p.id)!
        return (
          <Reveal key={p.id} delay={i * 0.1} className="chooser__wrap">
            <div className={`chooser__opt chooser__opt--${p.id}`}>
              <span className="chooser__top">
                <span className="chooser__icon">
                  <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                </span>
              </span>
              <span className="chooser__name">{card.name}</span>
              <span className="chooser__desc">
                <span>{card.body}</span>
              </span>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

function SupportModelStep() {
  const s = page.step2
  return (
    <section className="section section--white chooser-section" aria-labelledby="chooser-title">
      <div className="container">
        <div className="chooser-section__head">
          <span className="step-tag">{s.label}</span>
          <h2 id="chooser-title" className="display-3">
            {s.title}
          </h2>
          <p className="lead chooser-section__lead">{s.body}</p>
        </div>
        <PlanCards />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Step 3 — design kept exactly as before (navy ledger: header + plan switch, tier rows) */
/* ------------------------------------------------------------------ */

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

function StepThree({ active, onChoose }: { active: PlanId; onChoose: (id: PlanId) => void }) {
  const s = page.step3
  const plan = plans.find((p) => p.id === active)!
  return (
    <section id="step-3" className="section ledger hiw-step hiw-step--three" aria-labelledby="step3-title">
      <div className="ledger__pattern" aria-hidden="true" />
      <div className="container">
        <div className="hiw-step__row">
          <Reveal>
            <StepHeader icon={UserRoundCheck} label={s.label} title={s.title} body={s.body} id="step3-title" tone="light" />
          </Reveal>
          <div className="seg" role="tablist" aria-label="Support model">
            {planOrder.map((id) => (
              <button key={id} type="button" role="tab" aria-selected={active === id} className={active === id ? 'is-on' : undefined} onClick={() => onChoose(id)}>
                {active === id && <motion.span layoutId="seg-pill" className="seg__pill" transition={{ duration: 0.45, ease }} />}
                <span className="seg__label">{planName(id)}</span>
              </button>
            ))}
          </div>
        </div>
        <TierLedger plan={plan} />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Closing — design kept exactly as before                             */
/* ------------------------------------------------------------------ */

function Closing() {
  return (
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
  )
}

export default function Pricing() {
  usePageTitle('How It Works')
  const [params, setParams] = useSearchParams()
  const { selection, setSelection } = useSelection()

  const fromUrl = params.get('plan')
  const active: PlanId = fromUrl === 'hourly' || fromUrl === 'monthly' ? fromUrl : (selection.plan ?? planOrder[0])

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
      <SupportModelStep />
      <StepThree active={active} onChoose={choose} />
      <Closing />
    </>
  )
}
