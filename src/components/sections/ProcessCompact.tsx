import { motion } from 'framer-motion'
import { howItWorks } from '../../content/site'
import { ease, inView } from '../motion'
import { stepIcons } from '../icons'

/** Horizontal (desktop) / vertical (mobile) four-step timeline used as a preview on the homepage. */
export function ProcessCompact() {
  return (
    <motion.ol className="pc" initial="hidden" whileInView="show" viewport={inView}>
      <motion.span
        className="pc__line"
        aria-hidden="true"
        variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { duration: 1.6, ease } } }}
      />
      {howItWorks.steps.map((step, i) => {
        const Icon = stepIcons[i]
        return (
          <motion.li
            key={step.title}
            className="pc__step"
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.3 + i * 0.22 } },
            }}
          >
            <span className="pc__node">
              <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
              <span className="pc__num">{String(i + 1).padStart(2, '0')}</span>
            </span>
            <div className="pc__body">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}
