import { motion } from 'framer-motion'
import { Blocks, Info } from 'lucide-react'
import { images, routes, systems } from '../content/site'
import { ease, inView } from '../components/motion'
import { PageBanner } from '../components/sections/PageBanner'
import { ButtonLink } from '../components/ui/Button'
import { Eyebrow, MaskImage, Reveal } from '../components/ui/Reveal'
import { usePageTitle } from '../hooks/usePageTitle'

/** Official brand marks (Simple Icons, in each brand's colour), stored locally in public/images/systems. */
const systemLogos: Record<string, string> = {
  Oracle: '/images/systems/oracle.svg',
  SAP: '/images/systems/sap.svg',
  QuickBooks: '/images/systems/quickbooks.svg',
  Odoo: '/images/systems/odoo.svg',
  Xero: '/images/systems/xero.svg',
  Sage: '/images/systems/sage.svg',
  'Zoho Books': '/images/systems/zoho.svg',
  'Microsoft Dynamics': '/images/systems/dynamics365.svg',
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
      />

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
                <span className="sys-wall__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="sys-wall__brand">
                  <span className="sys-wall__logo" aria-hidden="true">
                    <img src={systemLogos[s]} alt="" width={28} height={28} loading="lazy" decoding="async" />
                  </span>
                  <span className="sys-wall__name">{s}</span>
                </span>
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

    </>
  )
}
