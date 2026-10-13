import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { contact, routes } from '../../content/site'
import { ButtonLink } from '../ui/Button'
import { Eyebrow, TextReveal, Reveal } from '../ui/Reveal'
import { Img } from '../ui/Img'

/** Full-bleed image call-to-action with a parallax background. */
export function CtaBand({
  image,
  eyebrow = 'Get Started',
  title = contact.heading,
  body = contact.body,
}: {
  image: string
  eyebrow?: string
  title?: string
  body?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section ref={ref} className="cta-band" aria-label="Call to action">
      <motion.div className="cta-band__bg" style={{ y }} aria-hidden="true">
        <Img src={image} alt="" />
      </motion.div>
      <div className="cta-band__overlay" aria-hidden="true" />
      <div className="container cta-band__inner">
        <div className="cta-band__copy">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <TextReveal as="h2" className="display-2 text-ivory" text={title} />
          <Reveal delay={0.2}>
            <p className="cta-band__body">{body}</p>
          </Reveal>
        </div>
        <Reveal delay={0.3} className="cta-band__actions">
          <ButtonLink to={routes.pricing} size="lg">
            Get a Quote
          </ButtonLink>
          <ButtonLink to={routes.meeting} variant="ghost-light" size="lg" arrow={false} icon={<CalendarDays size={18} aria-hidden="true" />}>
            Book a Meeting
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
