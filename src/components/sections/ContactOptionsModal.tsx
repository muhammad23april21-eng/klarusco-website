import { useEffect, useRef, useState, type MouseEvent, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, CheckCircle2, Mail, MessageCircle, X } from 'lucide-react'
import { parsePhoneNumberFromString } from 'libphonenumber-js/min'
import { popupContact } from '../../content/site'
import { ease } from '../motion'
import { BookingForm, type BookingPrefill, type DetailsMode, type DetailsResult } from './BookingForm'

interface Props {
  open: boolean
  onClose: () => void
  /** True when the request was also delivered to the form backend. */
  sent: boolean
  /** Called after the visitor has completed an option (its action has already been triggered). */
  onSelect?: (key: string) => void
  /** Details from the submitted contact form, used to pre-fill the details form. */
  prefill?: BookingPrefill
  /** Contact-form payload, passed on to the team's email. */
  enquiry?: object
}

type View = 'options' | DetailsMode | 'done'

/** Shown after a valid Contact Us submission: WhatsApp, email or a meeting request. */
export function ContactOptionsModal({ open, onClose, sent, onSelect, prefill, enquiry }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="copts"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <Panel closeRef={closeRef} onClose={onClose} sent={sent} onSelect={onSelect} prefill={prefill} enquiry={enquiry} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

interface PanelProps extends Pick<Props, 'onClose' | 'sent' | 'onSelect' | 'prefill' | 'enquiry'> {
  closeRef: RefObject<HTMLButtonElement | null>
}

/** Popup body. Mounted each time the popup opens, so it always starts on the three options. */
function Panel({ closeRef, onClose, sent, onSelect, prefill, enquiry }: PanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>('options')
  const [result, setResult] = useState<DetailsResult | null>(null)

  // Start each view at the top of the (scrollable) panel
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
  }, [view])

  const waDisplay = parsePhoneNumberFromString(`+${popupContact.whatsappNumber}`)?.formatInternational() ?? `+${popupContact.whatsappNumber}`
  const mail = `mailto:${popupContact.email}?subject=${encodeURIComponent('Quote Request – Klarus & Co')}`

  const options = [
    { key: 'wa', icon: MessageCircle, label: 'Contact via WhatsApp', detail: waDisplay, form: 'whatsapp' as const },
    { key: 'mail', icon: Mail, label: 'Contact via Email', detail: popupContact.email, form: null },
    { key: 'meet', icon: CalendarDays, label: 'Book a Meeting', detail: 'Choose a time that suits you', form: 'meeting' as const },
  ]

  const optionBody = (Icon: typeof Mail, label: string, detail: string) => (
    <>
      <span className="copts__icon" aria-hidden="true">
        <Icon size={22} strokeWidth={1.5} />
      </span>
      <span className="copts__text">
        <span className="copts__label">{label}</span>
        <span className="copts__detail">{detail}</span>
      </span>
      <ArrowUpRight className="copts__arrow" size={18} aria-hidden="true" />
    </>
  )

  const isForm = view === 'meeting' || view === 'whatsapp'

  return (
    <motion.div
      ref={panelRef}
      className={`copts__panel${isForm ? ' copts__panel--wide' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="copts-title"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease }}
    >
      <button ref={closeRef} type="button" className="copts__close" onClick={onClose} aria-label="Close">
        <X size={20} aria-hidden="true" />
      </button>
      <span className="copts__badge" aria-hidden="true">
        {view === 'meeting' ? (
          <CalendarDays size={26} strokeWidth={1.5} />
        ) : view === 'whatsapp' ? (
          <MessageCircle size={26} strokeWidth={1.5} />
        ) : (
          <CheckCircle2 size={26} strokeWidth={1.5} />
        )}
      </span>

      {isForm && (
        <>
          <h2 id="copts-title" className="copts__title">
            {view === 'meeting' ? 'Book a meeting' : 'Contact us on WhatsApp'}
          </h2>
          <p className="copts__intro">
            {view === 'meeting'
              ? 'Tell us when suits you. Choose a preferred weekday within the next 7 days and a one-hour time between 9:00 AM and 6:00 PM Pakistan Standard Time (PKT).'
              : 'Add your details and preferred meeting time. We will open WhatsApp with your message ready — you then press Send.'}
          </p>
          <BookingForm
            key={view}
            mode={view}
            prefill={prefill}
            enquiry={enquiry}
            onBack={() => setView('options')}
            onDone={(r) => {
              setResult(r)
              setView('done')
            }}
          />
        </>
      )}

      {view === 'done' && result && (
        <>
          <h2 id="copts-title" className="copts__title">
            {result.mode === 'meeting' ? 'Meeting request received' : 'Continue in WhatsApp'}
          </h2>
          {result.mode === 'meeting' ? (
            <p className="copts__intro">
              Your meeting request has been received. Our team will review your preferred date and time and share the
              Google Meet link with you via email or WhatsApp before the meeting.
            </p>
          ) : (
            <p className="copts__intro">
              {result.waOpened === false
                ? 'Your browser did not open WhatsApp automatically. Use the button below to open it with your message ready, then press Send.'
                : 'WhatsApp has opened with your message ready. Please press Send in WhatsApp to send it to us.'}
            </p>
          )}
          <dl className="cbook__done">
            <div>
              <dt>Preferred date</dt>
              <dd>{result.dayText}</dd>
            </div>
            <div>
              <dt>Preferred time</dt>
              <dd>{result.time} (Pakistan Standard Time)</dd>
            </div>
          </dl>
          <p className="copts__note">
            {result.mode === 'meeting'
              ? 'This is a request, not a confirmed appointment. We have emailed you a copy of the details.'
              : 'Your message is only sent once you press Send in WhatsApp. This is a request, not a confirmed appointment.'}
          </p>
          <div className="cbook__done-actions">
            {result.mode === 'whatsapp' && result.waUrl && (
              <a className="btn btn--outline-dark" href={result.waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} aria-hidden="true" />
                <span>{result.waOpened === false ? 'Open WhatsApp' : 'Open WhatsApp again'}</span>
              </a>
            )}
            <button type="button" className="btn btn--forest" onClick={() => onSelect?.(result.mode === 'meeting' ? 'meet' : 'wa')}>
              <span>Done</span>
            </button>
          </div>
        </>
      )}

      {view === 'options' && (
        <>
          <h2 id="copts-title" className="copts__title">
            {sent ? 'Thank you — your request has been received' : 'Thank you for your details'}
          </h2>
          <p className="copts__intro">Choose how you would like to connect with our team.</p>

          <ul className="copts__list">
            {options.map(({ key, icon, label, detail, form }) => (
              <li key={key}>
                {form ? (
                  // WhatsApp and Book a Meeting collect the details inside this popup
                  <button type="button" className="copts__opt" onClick={() => setView(form)}>
                    {optionBody(icon, label, detail)}
                  </button>
                ) : (
                  <a
                    className="copts__opt"
                    href={mail}
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Open the visitor's email app directly so no parent handler can intercept the click.
                      e.preventDefault()
                      e.stopPropagation()
                      window.location.href = mail
                      onSelect?.(key)
                    }}
                  >
                    {optionBody(icon, label, detail)}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </motion.div>
  )
}
