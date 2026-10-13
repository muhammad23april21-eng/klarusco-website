import { Link } from 'react-router-dom'
import { brand } from '../../content/site'

/**
 * KlarusCo typographic wordmark (no icon). To use final logo artwork later,
 * replace the contents of the <Link> with an <img> or inline SVG.
 */
export function Logo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <Link to="/" className={`logo logo--${tone}`} aria-label={`${brand.name} — home`}>
      <span className="logo__text" aria-hidden="true">
        <span className="logo__name">
          {brand.wordmark.primary}
          <span className="logo__accent">{brand.wordmark.accent}</span>
        </span>
        <span className="logo__descriptor">{brand.descriptor}</span>
      </span>
    </Link>
  )
}
