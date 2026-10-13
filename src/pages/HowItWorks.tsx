import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Check, MessageSquareText } from 'lucide-react'
import { howItWorks, images, plans, routes } from '../content/site'
import { stepIcons } from '../components/icons'
import { ease, inView } from '../components/motion'
import { PageBanner } from '../components/sections/PageBanner'
import { ButtonLink } from '../components/ui/Button'
import { Eyebrow, MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { usePageTitle } from '../hooks/usePageTitle'

/* Small visual vignettes that illustrate each step using only wording from the document. */

function VignetteRequirements() {
  return (
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
  )
}

function VignetteModel() {
  return (
    <div className="vig vig--model">
      {plans.map((p, i) => (
        <motion.div
          key={p.id}
          className={`vig__option ${i === 1 ? 'is-on' : ''}`}
          variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease, delay: 0.3 + i * 0.15 } } }}
        >
          <span className="vig__radio" aria-hidden="true" />
          <span>
            <strong>{p.name}</strong>
            <small>{p.id === 'hourly' ? 'Flexible hourly support' : 'Dedicated monthly professional'}</small>
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function VignetteLevel() {
  const levels = ['Bookkeeper', 'Accounting Supervisor', 'Accounting Manager']
  return (
    <div className="vig vig--levels">
      {levels.map((l, i) => (
        <motion.div
          key={l}
          className="vig__level"
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: 0.3 + i * 0.12 } } }}
        >
          <span className="vig__bars" aria-hidden="true">
            {[0, 1, 2].map((b) => (
              <i key={b} className={b <= i ? 'on' : undefined} />
            ))}
          </span>
          {l}
        </motion.div>
      ))}
    </div>
  )
}

function VignetteStart() {
  const items = ['We agree on the scope of work', 'Assign the appropriate professional', 'Begin supporting your business']
  return (
    <ul className="vig vig--checklist">
      {items.map((t, i) => (
        <motion.li key={t} variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease, delay: 0.3 + i * 0.15 } } }}>
          <span className="vig__check">
            <Check size={13} strokeWidth={3} aria-hidden="true" />
          </span>
          {t}
        </motion.li>
      ))}
    </ul>
  )
}

const vignettes = [VignetteRequirements, VignetteModel, VignetteLevel, VignetteStart]

export default function HowItWorks() {
  usePageTitle('How It Works')
  const trackRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 70%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <>
      <PageBanner
        image={images.processDiscussion}
        eyebrow="How It Works"
        title={howItWorks.heading}
        layout="left"
        overlay="charcoal"
        height="tall"
      >
        <ol className="banner__steps">
          {howItWorks.steps.map((s, i) => (
            <li key={s.title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </li>
          ))}
        </ol>
      </PageBanner>

      <section className="section section--ivory journey" aria-label="Four steps">
        <div className="container">
          <ol className="journey__track" ref={trackRef}>
            <span className="journey__rail" aria-hidden="true">
              <motion.span className="journey__fill" style={{ scaleY: progress }} />
            </span>
            {howItWorks.steps.map((step, i) => {
              const Icon = stepIcons[i]
              const Vignette = vignettes[i]
              return (
                <motion.li
                  key={step.title}
                  className={`journey__step ${i % 2 ? 'is-right' : ''}`}
                  initial="hidden"
                  whileInView="show"
                  viewport={inView}
                >
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
                    <span className="journey__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="journey__label">Step {i + 1}</span>
                    <h2>{step.title}</h2>
                    <p>{step.body}</p>
                  </motion.div>
                  <motion.div
                    className="journey__visual"
                    variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.2 } } }}
                  >
                    <Vignette />
                  </motion.div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="journey-cta" aria-labelledby="journey-cta-title">
        <MaskImage src={images.aboutTeam} alt="Colleagues joining hands over a desk" className="journey-cta__img" direction="right" />
        <div className="journey-cta__copy">
          <Eyebrow tone="forest">Step 1</Eyebrow>
          <TextReveal id="journey-cta-title" className="display-2" text={howItWorks.steps[0].title} />
          <Reveal delay={0.15}>
            <p className="lead">{howItWorks.steps[0].body}</p>
          </Reveal>
          <Reveal delay={0.25} className="journey-cta__actions">
            <ButtonLink to={routes.contact}>Contact Us</ButtonLink>
            <ButtonLink to={routes.pricing} variant="outline-dark">
              Choose your plan
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  )
}
