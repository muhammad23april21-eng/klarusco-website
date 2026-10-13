import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

type Variant = 'gold' | 'forest' | 'ghost-light' | 'outline-dark' | 'text'

interface Props {
  to: string
  children: ReactNode
  variant?: Variant
  size?: 'md' | 'lg'
  arrow?: boolean
  icon?: ReactNode
  className?: string
  onClick?: () => void
}

/** Router-aware call-to-action link with the site's shared button styles. */
export function ButtonLink({ to, children, variant = 'gold', size = 'md', arrow = true, icon, className, onClick }: Props) {
  const external = /^(https?:|mailto:|tel:)/.test(to)
  const cls = `btn btn--${variant} ${size === 'lg' ? 'btn--lg' : ''} ${className ?? ''}`
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <ArrowRight className="btn__arrow" size={17} aria-hidden="true" />}
    </>
  )
  if (external) {
    return (
      <a href={to} className={cls} onClick={onClick} target={to.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return (
    <Link to={to} className={cls} onClick={onClick}>
      {inner}
    </Link>
  )
}
