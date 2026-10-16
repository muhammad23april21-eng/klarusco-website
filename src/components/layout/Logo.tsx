import { Link } from 'react-router-dom'
import { brand } from '../../content/site'

/**
 * Klarus & Co typographic wordmark with its slogan lockup (no icon). To use final
 * logo artwork later, replace the contents of the <Link> with an <img> or inline SVG.
 */
export function Logo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { primary, ampersand, secondary } = brand.wordmark
  return (
    <Link to="/" className={`logo logo--${tone}`} aria-label={`${brand.name} — ${brand.slogan.join(', ')} — home`}>
      <span className="logo__text" aria-hidden="true">
        <span className="logo__name">
          {primary}
          <span className="logo__amp">{ampersand}</span>
          {secondary}
        </span>
        <span className="logo__slogan">
          {brand.slogan.map((line) => (
            <span key={line} className="logo__slogan-line">
              {line}
            </span>
          ))}
        </span>
      </span>
    </Link>
  )
}
