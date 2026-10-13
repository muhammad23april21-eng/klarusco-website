import { motion } from 'framer-motion'
import { ease, inView } from '../motion'

/**
 * Decorative, data-free financial visuals. Shapes are abstract and every panel that
 * could be read as data carries an "Illustrative" label — no figures are implied.
 */

const linePath = 'M0 92 C 30 86, 52 70, 80 74 S 130 52, 160 56 S 212 30, 240 34 S 286 14, 320 10'
const budgetPath = 'M0 86 C 40 80, 76 74, 110 66 S 170 54, 200 48 S 262 34, 320 26'

export function LineChartViz({ tone = 'light', label = 'Illustrative', immediate = false }: { tone?: 'light' | 'dark'; label?: string; immediate?: boolean }) {
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: inView }
  return (
    <motion.div className={`viz viz--${tone}`} initial="hidden" {...trigger} role="img" aria-label="Illustrative reporting chart">
      <div className="viz__head">
        <span className="viz__title">Financial reporting</span>
        <span className="viz__tag">{label}</span>
      </div>
      <svg viewBox="0 0 320 110" className="viz__svg" aria-hidden="true">
        <defs>
          <linearGradient id={`area-${tone}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#C6A66B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C6A66B" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 50, 80].map((y) => (
          <line key={y} x1="0" x2="320" y1={y} y2={y} className="viz__grid" />
        ))}
        <motion.path
          d={`${linePath} L320 110 L0 110 Z`}
          fill={`url(#area-${tone})`}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.2, duration: 1 } } }}
        />
        <motion.path
          d={budgetPath}
          className="viz__line viz__line--muted"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.6, ease, delay: 0.2 } } }}
        />
        <motion.path
          d={linePath}
          className="viz__line"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.8, ease, delay: 0.35 } } }}
        />
        <motion.circle
          cx="320"
          cy="10"
          r="4"
          className="viz__dot"
          variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { delay: 2, type: 'spring', stiffness: 260, damping: 16 } } }}
        />
      </svg>
      <div className="viz__legend" aria-hidden="true">
        <span>
          <i className="viz__key" /> Actual
        </span>
        <span>
          <i className="viz__key viz__key--muted" /> Budget
        </span>
      </div>
    </motion.div>
  )
}

const barHeights = [42, 58, 50, 66, 61, 78, 72, 88]

export function BarsViz({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <motion.div
      className={`viz-bars viz-bars--${tone}`}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      aria-hidden="true"
    >
      {barHeights.map((h, i) => (
        <motion.span
          key={i}
          style={{ height: `${h}%` }}
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.9, ease } } }}
        />
      ))}
    </motion.div>
  )
}

/** Concentric progress rings — an abstract "reconciled / reviewed / reported" motif. */
export function RingsViz({ size = 160 }: { size?: number }) {
  const rings = [
    { r: 64, p: 0.82 },
    { r: 50, p: 0.64 },
    { r: 36, p: 0.74 },
  ]
  return (
    <motion.svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className="viz-rings"
      initial="hidden"
      whileInView="show"
      viewport={inView}
      aria-hidden="true"
    >
      {rings.map(({ r, p }, i) => (
        <g key={r} transform="rotate(-90 80 80)">
          <circle cx="80" cy="80" r={r} className="viz-rings__track" />
          <motion.circle
            cx="80"
            cy="80"
            r={r}
            className={`viz-rings__arc viz-rings__arc--${i}`}
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: p, transition: { duration: 1.6, ease, delay: 0.2 + i * 0.2 } } }}
          />
        </g>
      ))}
    </motion.svg>
  )
}
