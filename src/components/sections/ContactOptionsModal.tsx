import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, CheckCircle2, Mail, MessageCircle, X } from 'lucide-react'
import { popupContact } from '../../content/site'
import { ease } from '../motion'

interface Props {
  open: boolean
  onClose: () => void
  /** Plain-text summary of the submitted form, pre-filled into WhatsApp and email. */
  summary: string
  /** True when the request was also delivered to the form backend. */
  sent: boolean
}

/** Shown after a valid Contact Us submission: WhatsApp, email or a meeting. */
export function ContactOptionsModal({ open, onClose, summary, sent }: Props) {
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

  const wa = `https://wa.me/${popupContact.whatsappNumber}?text=${encodeURIComponent(summary)}`
  const mail = `mailto:${popupContact.email}?subject=${encodeURIComponent('Contact request')}&body=${encodeURIComponent(summary)}`

  const options = [
    { key: 'wa', icon: MessageCircle, label: 'Contact via WhatsApp', detail: `+${popupContact.whatsappNumber}`, href: wa, external: true },
    { key: 'mail', icon: Mail, label: 'Contact via Email', detail: popupContact.email, href: mail, external: false },
    { key: 'meet', icon: CalendarDays, label: 'Book a Meeting', detail: 'Choose a time that suits you', href: popupContact.meetingUrl, external: true },
  ]

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
          <motion.div
            className="copts__panel"
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
              <CheckCircle2 size={26} strokeWidth={1.5} />
            </span>
            <h2 id="copts-title" className="copts__title">
              {sent ? 'Thank you — your request has been received' : 'Thank you for your details'}
            </h2>
            <p className="copts__intro">Choose how you would like to connect with our team.</p>

            <ul className="copts__list">
              {options.map(({ key, icon: Icon, label, detail, href, external }) => (
                <li key={key}>
                  <a className="copts__opt" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <span className="copts__icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.5} />
                    </span>
                    <span className="copts__text">
                      <span className="copts__label">{label}</span>
                      <span className="copts__detail">{detail}</span>
                    </span>
                    <ArrowUpRight className="copts__arrow" size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            {popupContact.isPlaceholder && (
              <p className="copts__note">Temporary placeholder contact details — to be replaced with the official WhatsApp number, email and meeting link.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
