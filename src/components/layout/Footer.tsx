import { Link } from 'react-router-dom'
import { ArrowUp, CalendarDays, Mail, MessageCircle } from 'lucide-react'
import { brand, hero, nav, routes, services } from '../../content/site'
import { emailHref, whatsappHref } from '../../content/links'
import { Logo } from './Logo'

export function Footer() {
  const wa = whatsappHref({ plan: null, tier: null })
  const mail = emailHref({ plan: null, tier: null })

  return (
    <footer className="footer">
      <div className="footer__lines" aria-hidden="true" />
      <div className="container">
        <div className="footer__main">
          <div className="footer__brand">
            <Logo tone="light" />
            <p className="footer__statement">
              {hero.tagline.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </p>
            <div className="footer__cta">
              <Link to={routes.pricing} className="btn btn--gold">
                <span>Get a Quote</span>
              </Link>
              <Link to={routes.meeting} className="btn btn--ghost-light">
                <span>Book a Meeting</span>
              </Link>
            </div>
            <div className="footer__experience">
              <span className="footer__figure">
                20<sup>+</sup>
              </span>
              <span>Years of professional experience</span>
            </div>
          </div>

          <nav className="footer__col" aria-label="Company">
            <h2 className="footer__heading">Company</h2>
            <ul className="footer__links">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Services">
            <h2 className="footer__heading">Services</h2>
            <ul className="footer__links">
              {services.items.map((s) => (
                <li key={s.slug}>
                  <Link to={`${routes.services}#${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h2 className="footer__heading">Get in touch</h2>
            <ul className="footer__links footer__contact">
              <li>
                <MessageCircle size={16} aria-hidden="true" />
                {wa ? (
                  <a href={wa} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                ) : (
                  <Link to={routes.contact}>WhatsApp</Link>
                )}
              </li>
              <li>
                <Mail size={16} aria-hidden="true" />
                {mail ? <a href={mail}>Email</a> : <Link to={routes.contact}>Email</Link>}
              </li>
              <li>
                <CalendarDays size={16} aria-hidden="true" />
                <Link to={routes.meeting}>Schedule a Meeting</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <button type="button" className="footer__totop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}
