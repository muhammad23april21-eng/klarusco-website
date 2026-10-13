import { motion, type HTMLMotionProps } from 'framer-motion'
import { Fragment, type ReactNode } from 'react'
import { ease, inView } from '../motion'
import { Img } from './Img'

/** Fades and lifts content once as it scrolls into view. Reduced motion is handled globally by MotionConfig. */
export function Reveal({ delay = 0, y = 24, ...props }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.9, ease, delay }}
      {...props}
    />
  )
}

/** Splits a heading into words and slides each one up from behind a mask. */
export function TextReveal({
  text,
  as = 'h2',
  className,
  delay = 0,
  immediate = false,
  id,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  delay?: number
  /** Animate on mount instead of on scroll (used in page heroes). */
  immediate?: boolean
  id?: string
}) {
  const Tag = motion[as]
  const words = text.split(' ')
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: inView }
  return (
    <Tag
      id={id}
      className={className}
      aria-label={text}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="tr-word" aria-hidden="true">
            <motion.span
              className="tr-inner"
              variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1, ease } } }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

/** Image that unveils with a clip-path wipe while gently settling from a slight zoom. */
export function MaskImage({
  src,
  alt,
  className,
  direction = 'up',
  delay = 0,
  children,
  immediate = false,
}: {
  src: string
  alt: string
  className?: string
  direction?: 'up' | 'left' | 'right'
  delay?: number
  children?: ReactNode
  immediate?: boolean
}) {
  const hidden = {
    up: 'inset(100% 0% 0% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  }[direction]
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: inView }
  return (
    <motion.figure
      className={`mask-image ${className ?? ''}`}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: { clipPath: hidden },
        show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.3, ease, delay } },
      }}
    >
      <motion.div
        className="mask-image__inner"
        variants={{ hidden: { scale: 1.18 }, show: { scale: 1, transition: { duration: 1.8, ease, delay } } }}
      >
        <Img src={src} alt={alt} />
      </motion.div>
      {children}
    </motion.figure>
  )
}

export function Eyebrow({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'forest' | 'light' }) {
  return <p className={`eyebrow eyebrow--${tone}`}>{children}</p>
}
