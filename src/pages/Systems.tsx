import { useState } from 'react'
import { motion } from 'framer-motion'
import { Blocks, Info } from 'lucide-react'
import { images, routes, systems } from '../content/site'
import { ease, inView } from '../components/motion'
import { PageBanner } from '../components/sections/PageBanner'
import { CtaBand } from '../components/sections/CtaBand'
import { ButtonLink } from '../components/ui/Button'
import { Eyebrow, MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { usePageTitle } from '../hooks/usePageTitle'

/** Radial ecosystem: the client's financial records at the centre, connected to each system. */
function Ecosystem() {
  const [hover, setHover] = useState<number | null>(null)
  const cx = 300
  const cy = 300
  const r = 220
  const nodes = systems.items.map((name, i) => {
    const a = (i / systems.items.length) * Math.PI * 2 - Math.PI / 2
    return { name, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  })

  return (
    <motion.svg
      viewBox="0 0 600 600"
      className="eco"
      initial="hidden"
      whileInView="show"
      viewport={inView}
      role="img"
      aria-label={`Diagram connecting your financial records with ${systems.items.join(', ')}`}
    >
      <circle cx={cx} cy={cy} r={r} className="eco__orbit" />
      <circle cx={cx} cy={cy} r={r - 70} className="eco__orbit eco__orbit--inner" />
      {nodes.map((n, i) => (
        <motion.line
          key={`l-${n.name}`}
          x1={cx}
          y1={cy}
          x2={n.x}
          y2={n.y}
          className={`eco__link ${hover === i ? 'is-hot' : ''}`}
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1, ease, delay: 0.3 + i * 0.08 } } }}
        />
      ))}
      <motion.g variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease } } }} style={{ transformOrigin: '300px 300px' }}>
        <circle cx={cx} cy={cy} r="78" className="eco__core" />
        <text x={cx} y={cy - 6} textAnchor="middle" className="eco__core-text">
          Your financial
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" className="eco__core-text">
          records
        </text>
      </motion.g>
      {nodes.map((n, i) => (
        <motion.g
          key={n.name}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 0.8 + i * 0.08 } } }}
          className={`eco__node ${hover === i ? 'is-hot' : ''}`}
        >
          <rect x={n.x - 74} y={n.y - 22} width="148" height="44" />
          <text x={n.x} y={n.y + 6} textAnchor="middle">
            {n.name}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  )
}

export default function Systems() {
  usePageTitle(systems.heading)
  return (
    <>
      <PageBanner
        image={images.systemsTech}
        imageAlt=""
        eyebrow="Systems"
        title={systems.heading}
        intro={systems.intro}
        layout="bottom"
        overlay="forest"
      >
        <ul className="banner__chips" aria-label="Systems">
          {systems.items.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </PageBanner>

      {/* Ecosystem */}
      <section className="section section--ivory eco-section" aria-labelledby="eco-title">
        <div className="container eco-section__grid">
          <div className="eco-section__copy">
            <Eyebrow tone="forest">Technology</Eyebrow>
            <TextReveal id="eco-title" className="display-2" text="Leading accounting and ERP systems" />
            <Reveal delay={0.15}>
              <p className="lead">We can also adapt to the systems and processes already used by your business.</p>
            </Reveal>
            <Reveal delay={0.25}>
              <ol className="eco-section__list">
                {systems.items.map((s, i) => (
                  <li key={s}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
          <div className="eco-section__diagram">
            <Ecosystem />
          </div>
        </div>
      </section>

      {/* Typographic wall */}
      <section className="section section--white sys-wall" aria-label="Systems">
        <div className="container">
          <motion.ul
            className="sys-wall__grid"
            initial="hidden"
            whileInView="show"
            viewport={inView}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            {systems.items.map((s, i) => (
              <motion.li
                key={s}
                className="sys-wall__item"
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
              >
                <span className="sys-wall__mono" aria-hidden="true">
                  {s.charAt(0)}
                </span>
                <span className="sys-wall__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="sys-wall__name">{s}</span>
              </motion.li>
            ))}
          </motion.ul>
          <p className="disclaimer">
            <Info size={14} aria-hidden="true" />
            {systems.disclaimer}
          </p>
        </div>
      </section>

      {/* Customized Solutions */}
      <section className="custom-sol" aria-labelledby="custom-title">
        <MaskImage src={images.systemsWorkspace} alt="Modern workstation by a window overlooking the city" className="custom-sol__img" direction="right" />
        <Reveal className="custom-sol__panel" delay={0.2}>
          <span className="custom-sol__icon">
            <Blocks size={28} strokeWidth={1.3} aria-hidden="true" />
          </span>
          <Eyebrow tone="gold">Beyond standard systems</Eyebrow>
          <h2 id="custom-title" className="display-2 text-ivory">
            {systems.custom.title}
          </h2>
          <p className="lead text-ivory-soft">{systems.custom.body}</p>
          <ButtonLink to={routes.contact} variant="ghost-light">
            Discuss your requirements
          </ButtonLink>
        </Reveal>
      </section>

      <CtaBand image={images.introMeeting} />
    </>
  )
}
