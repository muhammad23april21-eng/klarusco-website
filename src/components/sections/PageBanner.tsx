import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { ease } from '../motion'
import { Img } from '../ui/Img'
import { TextReveal } from '../ui/Reveal'

interface Props {
  image: string
  imageAlt?: string
  eyebrow: string
  title: string
  intro?: string
  /** Visual composition — each page picks the one that suits its content. */
  layout?: 'left' | 'center' | 'bottom'
  overlay?: 'forest' | 'charcoal' | 'mono'
  height?: 'tall' | 'medium'
  children?: ReactNode
}

/** Full-width photographic page banner with parallax, overlay and a word-by-word headline reveal. */
export function PageBanner({
  image,
  imageAlt = '',
  eyebrow,
  title,
  intro,
  layout = 'left',
  overlay = 'forest',
  height = 'medium',
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])

  return (
    <section ref={ref} className={`banner banner--${layout} banner--${height} banner--${overlay}`}>
      <motion.div className="banner__bg" style={{ y }}>
        <motion.div
          className="banner__zoom"
          initial={{ scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
        >
          <Img src={image} alt={imageAlt} loading="eager" fetchPriority="high" />
        </motion.div>
      </motion.div>
      <div className="banner__overlay" aria-hidden="true" />
      <div className="banner__grain" aria-hidden="true" />

      <motion.div className="container banner__inner" style={{ opacity: fade }}>
        <motion.nav
          aria-label="Breadcrumb"
          className="crumbs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          <Link to="/">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{eyebrow}</span>
        </motion.nav>
        <TextReveal as="h1" immediate delay={0.35} className="banner__title" text={title} />
        {intro && (
          <motion.p
            className="banner__intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.8 }}
          >
            {intro}
          </motion.p>
        )}
        {children && (
          <motion.div
            className="banner__extra"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1 }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
      <motion.span
        className="banner__rule"
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.6, ease, delay: 0.6 }}
      />
    </section>
  )
}
