import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarDays, Mail, MessageCircle, Settings2 } from 'lucide-react'
import { routes } from '../../content/site'
import { emailHref, whatsappHref } from '../../content/links'
import { useSelection } from '../../hooks/SelectionContext'

/** WhatsApp / email (and optionally meeting) options; unconfigured channels show a clear setup note. */
export function ContactChannels({ showMeeting = true, tone = 'light' }: { showMeeting?: boolean; tone?: 'light' | 'dark' }) {
  const { selection } = useSelection()
  const channels = [
    { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, href: whatsappHref(selection), action: 'Chat with us on WhatsApp', env: 'VITE_WHATSAPP_NUMBER' },
    { key: 'email', label: 'Email', icon: Mail, href: emailHref(selection), action: 'Send us an email', env: 'VITE_CONTACT_EMAIL' },
  ]
  return (
    <ul className={`channels channels--${tone}`}>
      {channels.map((c) => {
        const Icon = c.icon
        return (
          <li key={c.key}>
            {c.href ? (
              <a className="channel" href={c.href} {...(c.key === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <span className="channel__icon">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="channel__text">
                  <span className="channel__label">{c.label}</span>
                  <span className="channel__action">{c.action}</span>
                </span>
                <ArrowUpRight className="channel__arrow" size={20} aria-hidden="true" />
              </a>
            ) : (
              <div className="channel channel--pending">
                <span className="channel__icon">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="channel__text">
                  <span className="channel__label">{c.label}</span>
                  <span className="channel__config">
                    <Settings2 size={13} aria-hidden="true" /> Contact detail to be added — set <code>{c.env}</code>
                  </span>
                </span>
              </div>
            )}
          </li>
        )
      })}
      {showMeeting && (
        <li>
          <Link className="channel channel--meeting" to={routes.meeting}>
            <span className="channel__icon">
              <CalendarDays size={22} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="channel__text">
              <span className="channel__label">Book a Meeting</span>
              <span className="channel__action">Schedule a Meeting</span>
            </span>
            <ArrowUpRight className="channel__arrow" size={20} aria-hidden="true" />
          </Link>
        </li>
      )}
    </ul>
  )
}
