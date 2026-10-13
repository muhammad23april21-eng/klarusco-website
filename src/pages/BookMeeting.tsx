import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ExternalLink, Settings2 } from 'lucide-react'
import { config, images, meeting, routes } from '../content/site'
import { ease } from '../components/motion'
import { Img } from '../components/ui/Img'
import { ButtonLink } from '../components/ui/Button'
import { Eyebrow, Reveal, TextReveal } from '../components/ui/Reveal'
import { ContactChannels } from '../components/sections/ContactChannels'
import { SelectionSummary } from '../components/sections/SelectionSummary'
import { usePageTitle } from '../hooks/usePageTitle'

/** Static, clearly-labelled preview of where an online scheduler will appear. */
function SchedulerPlaceholder() {
  const cells = Array.from({ length: 35 })
  return (
    <div className="sched">
      <div className="sched__mock" aria-hidden="true">
        <div className="sched__head">
          <span className="sched__month" />
          <span className="sched__nav">
            <i />
            <i />
          </span>
        </div>
        <div className="sched__dow">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="sched__grid">
          {cells.map((_, i) => {
            const weekend = i % 7 >= 5
            const open = !weekend && i % 3 !== 0 && i > 6
            return <span key={i} className={i === 17 ? 'is-picked' : open ? 'is-open' : weekend ? 'is-off' : undefined} />
          })}
        </div>
        <div className="sched__slots">
          {[0, 1, 2, 3].map((s) => (
            <span key={s} className={s === 1 ? 'is-picked' : undefined} />
          ))}
        </div>
      </div>
      <div className="sched__notice" role="note">
        <Settings2 size={18} aria-hidden="true" />
        <div>
          <strong>Online booking not yet connected</strong>
          <p>
            Add your scheduling link (Calendly, Cal.com, Microsoft Bookings, etc.) as <code>VITE_BOOKING_URL</code> and the live
            calendar will appear here. Until then, please use the contact options to arrange a meeting.
          </p>
          <ButtonLink to={routes.contact} variant="forest">
            Contact us to arrange a meeting
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

export default function BookMeeting() {
  usePageTitle('Book a Meeting')
  const hasBooking = Boolean(config.bookingUrl)

  return (
    <>
      <section className="meet-banner">
        <div className="meet-banner__media" aria-hidden="true">
          <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease }} className="meet-banner__zoom">
            <Img src={images.meetingHandshake} alt="" loading="eager" />
          </motion.div>
        </div>
        <div className="meet-banner__fade" aria-hidden="true" />
        <div className="container meet-banner__inner">
          <motion.nav aria-label="Breadcrumb" className="crumbs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Link to="/">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{meeting.eyebrow}</span>
          </motion.nav>
          <motion.p className="eyebrow eyebrow--gold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {meeting.eyebrow}
          </motion.p>
          <TextReveal as="h1" immediate delay={0.4} className="banner__title" text={meeting.heading} />
          <motion.p className="banner__intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.8 }}>
            {meeting.body}
          </motion.p>
          <motion.div className="meet-banner__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1 }}>
            {hasBooking ? (
              <ButtonLink to={config.bookingUrl} size="lg" arrow={false} icon={<ExternalLink size={17} aria-hidden="true" />}>
                {meeting.cta}
              </ButtonLink>
            ) : (
              <a href="#scheduler" className="btn btn--gold btn--lg">
                <span>{meeting.cta}</span>
              </a>
            )}
          </motion.div>
        </div>
      </section>

      <section id="scheduler" className="section section--ivory meet" aria-labelledby="meet-title">
        <div className="container meet__grid">
          <aside className="meet__aside">
            <Eyebrow tone="forest">Before we meet</Eyebrow>
            <TextReveal id="meet-title" as="h2" className="display-3" text="Tell Us About Your Business" />
            <Reveal delay={0.1}>
              <p>Share your bookkeeping and accounting requirements with us.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <SelectionSummary />
            </Reveal>
            <Reveal delay={0.2} className="meet__alt">
              <span className="meet__alt-label">Prefer another way?</span>
              <ContactChannels showMeeting={false} />
            </Reveal>
          </aside>

          <Reveal className="meet__panel" delay={0.1}>
            {hasBooking ? (
              <iframe className="meet__embed" src={config.bookingUrl} title="Schedule a meeting" loading="lazy" />
            ) : (
              <SchedulerPlaceholder />
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
