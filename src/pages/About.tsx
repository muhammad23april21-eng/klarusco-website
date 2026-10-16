import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { about, hero, images, systems, whyUs } from '../content/site'
import { ease } from '../components/motion'
import { PageBanner } from '../components/sections/PageBanner'
import { CtaBand } from '../components/sections/CtaBand'
import { Img } from '../components/ui/Img'
import { Eyebrow, MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { LineChartViz, RingsViz } from '../components/ui/ChartViz'
import { usePageTitle } from '../hooks/usePageTitle'

const themeImages = [images.aboutTeam, images.homeAnalysis, images.svcReporting, images.systemsWorkspace]

function ThemesExplorer() {
  const [active, setActive] = useState(0)
  const theme = about.themes[active]
  return (
    <section className="section section--ivory themes" aria-labelledby="themes-title">
      <div className="container">
        <div className="themes__head">
          <Eyebrow tone="forest">What defines us</Eyebrow>
          <TextReveal id="themes-title" className="display-2" text="Experience, Value, Solutions & Approach" />
        </div>

        <div className="themes__body">
          <div className="themes__tabs" role="tablist" aria-label="About us themes" aria-orientation="vertical">
            {about.themes.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                id={`theme-tab-${i}`}
                aria-selected={i === active}
                aria-controls="theme-panel"
                className={`themes__tab ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + about.themes.length) % about.themes.length
                    setActive(next)
                    document.getElementById(`theme-tab-${next}`)?.focus()
                  }
                }}
                tabIndex={i === active ? 0 : -1}
              >
                <span className="themes__tab-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="themes__tab-label">{t.label}</span>
                {i === active && <motion.span layoutId="theme-indicator" className="themes__indicator" transition={{ duration: 0.5, ease }} />}
              </button>
            ))}
          </div>

          <div id="theme-panel" role="tabpanel" aria-labelledby={`theme-tab-${active}`} className="themes__panel">
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
                  <Img src={themeImages[active]} alt="" />
                </motion.div>
                <motion.div
                  className="themes__text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.15 }}
                >
                  <span className="themes__label">{theme.label}</span>
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
  const [, value, , approach] = about.themes
  const costBenefit = whyUs.items.find((b) => b.icon === 'cost')!
  const techBenefit = whyUs.items.find((b) => b.icon === 'technology')!

  return (
    <>
      <PageBanner
        image={images.aboutOffice}
        eyebrow="About Us"
        title="About Klarus & Co"
        intro={about.themes[0].title}
        layout="center"
        height="tall"
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
              <p>{hero.body}</p>
            </Reveal>
          </div>
          <MaskImage src={images.aboutExecutive} alt="Business professional in a suit" className="statement__portrait" delay={0.2} />
        </div>
      </section>

      <ThemesExplorer />

      {/* Value proposition */}
      <section className="section section--sage value" aria-labelledby="value-title">
        <div className="container value__grid">
          <div className="value__viz" aria-hidden="true">
            <RingsViz size={240} />
            <span className="value__viz-label">{value.label}</span>
          </div>
          <div>
            <Eyebrow tone="forest">{value.label}</Eyebrow>
            <TextReveal id="value-title" className="display-2" text={value.title} />
            <Reveal delay={0.15}>
              <p className="lead">{value.body}</p>
            </Reveal>
            <Reveal delay={0.25} className="value__note">
              <h3>{costBenefit.title}</h3>
              <p>{costBenefit.body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section section--forest approach" aria-labelledby="approach-title">
        <div className="container approach__grid">
          <div>
            <Eyebrow tone="gold">{approach.label}</Eyebrow>
            <TextReveal id="approach-title" className="display-2 text-ivory" text={approach.title} />
            <Reveal delay={0.15}>
              <p className="lead text-ivory-soft">{approach.body}</p>
              <p className="text-ivory-soft">{techBenefit.body}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <ul className="approach__systems" aria-label="Systems we work with">
                {systems.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="approach__viz">
            <LineChartViz tone="dark" />
          </Reveal>
        </div>
      </section>

      <CtaBand image={images.svcConsultancy} />
    </>
  )
}
