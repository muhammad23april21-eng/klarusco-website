import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { about, aboutWhy, hero, images } from '../content/site'
import { ease } from '../components/motion'
import { PageBanner } from '../components/sections/PageBanner'
import { Img } from '../components/ui/Img'
import { Eyebrow, MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { usePageTitle } from '../hooks/usePageTitle'

const themeImages = [images.aboutTeam, images.homeAnalysis, images.aboutReporting, images.systemsWorkspace]

const whyImages = [images.svcBookkeeping, images.svcBudgeting, images.svcCost, images.svcActuarial]
const whyItems = aboutWhy.items.map((item) => ({ label: item.title, title: item.title, body: item.body }))

interface ExplorerItem {
  label: string
  title: string
  body: string
}

interface ExplorerProps {
  id: string
  eyebrow?: string
  heading: string
  intro?: string
  items: ExplorerItem[]
  itemImages: string[]
  /** Small label above each panel title; defaults to the tab label. */
  panelLabel?: string
  tablistLabel: string
  className?: string
}

/** Interactive tabbed section (left tabs, right image + text panel). */
function ThemesExplorer({ id, eyebrow, heading, intro, items, itemImages, panelLabel, tablistLabel, className = '' }: ExplorerProps) {
  const [active, setActive] = useState(0)
  const theme = items[active]
  return (
    <section className={`section section--ivory themes ${className}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="themes__head">
          {eyebrow && <Eyebrow tone="forest">{eyebrow}</Eyebrow>}
          <TextReveal id={`${id}-title`} className="display-2" text={heading} />
          {intro && (
            <Reveal delay={0.15}>
              <p className="lead themes__intro">{intro}</p>
            </Reveal>
          )}
        </div>

        <div className="themes__body">
          <div className="themes__tabs" role="tablist" aria-label={tablistLabel} aria-orientation="vertical">
            {items.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${id}-panel`}
                className={`themes__tab ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
                    setActive(next)
                    document.getElementById(`${id}-tab-${next}`)?.focus()
                  }
                }}
                tabIndex={i === active ? 0 : -1}
              >
                <span className="themes__tab-label">{t.label}</span>
                {i === active && <motion.span layoutId={`${id}-indicator`} className="themes__indicator" transition={{ duration: 0.5, ease }} />}
              </button>
            ))}
          </div>

          <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="themes__panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="themes__panel-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="themes__img"
                  initial={{ clipPath: 'inset(0 0 0 100%)' }}
                  animate={{ clipPath: 'inset(0 0 0 0%)' }}
                  transition={{ duration: 0.9, ease }}
                >
                  <Img src={itemImages[active]} alt="" />
                </motion.div>
                <motion.div
                  className="themes__text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.15 }}
                >
                  <span className="themes__label">{panelLabel ?? theme.label}</span>
                  <h3>{theme.title}</h3>
                  <p>{theme.body}</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  usePageTitle('About Us')

  return (
    <>
      <PageBanner
        image={images.aboutOffice}
        eyebrow="About Us"
        title="About Klarus & Co"
        layout="center"
        height="medium"
        overlay="charcoal"
      />

      {/* Statement — figure, story, portrait */}
      <section className="section section--white statement" aria-labelledby="statement-title">
        <div className="container statement__grid">
          <Reveal className="statement__figure" y={40}>
            <span className="statement__num" aria-hidden="true">
              20<span>+</span>
            </span>
            <span className="statement__caption">{hero.experience}</span>
          </Reveal>
          <div className="statement__copy">
            <Eyebrow tone="forest">Who we are</Eyebrow>
            <TextReveal id="statement-title" className="display-2" text={hero.tagline.join(' ')} />
            <Reveal delay={0.15}>
              <p className="lead">{hero.intro}</p>
              <p className="lead">{about.approach}</p>
              <p>{hero.body}</p>
            </Reveal>
          </div>
          <MaskImage src={images.aboutExecutive} alt="Business professional in a suit" className="statement__portrait" delay={0.2} />
        </div>
      </section>

      <ThemesExplorer
        id="themes"
        eyebrow="What defines us"
        heading="Experience, Value, Solutions & Approach"
        items={about.themes}
        itemImages={themeImages}
        tablistLabel="About us themes"
      />

      <ThemesExplorer
        id="why"
        heading={aboutWhy.heading}
        intro={aboutWhy.intro}
        items={whyItems}
        itemImages={whyImages}
        panelLabel="Why businesses choose us"
        tablistLabel="Why businesses choose us"
        className="themes--why"
      />
    </>
  )
}
