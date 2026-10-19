import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Award, Cpu, Layers, PiggyBank } from 'lucide-react'
import { about, hero, images } from '../content/site'
import { ease } from '../components/motion'
import { PageBanner } from '../components/sections/PageBanner'
import { Img } from '../components/ui/Img'
import { Eyebrow, MaskImage, Reveal, TextReveal } from '../components/ui/Reveal'
import { usePageTitle } from '../hooks/usePageTitle'

const themeImages = [images.aboutTeam, images.homeAnalysis, images.svcReporting, images.systemsWorkspace]
const themeIcons = [Award, PiggyBank, Layers, Cpu]

/**
 * What Defines Us — same interaction as the Home services index: hovering, focusing
 * or tapping a row swaps the image on the right and expands that row's content.
 */
function DefinesUs() {
  const [active, setActive] = useState(0)
  const current = about.themes[active]
  const total = String(about.themes.length).padStart(2, '0')
  return (
    <section className="svc-index section section--ivory defines" aria-labelledby="themes-title">
      <div className="container">
        <div className="svc-index__head">
          <div>
            <Eyebrow tone="forest">What defines us</Eyebrow>
            <TextReveal id="themes-title" className="display-2" text="Experience, Value, Solutions & Approach" />
          </div>
        </div>

        <div className="svc-index__body">
          <ul className="svc-index__list">
            {about.themes.map((t, i) => {
              const Icon = themeIcons[i]
              return (
                <li key={t.label}>
                  <Reveal delay={i * 0.05}>
                    <button
                      type="button"
                      className={`svc-row ${i === active ? 'is-active' : ''}`}
                      aria-pressed={i === active}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                    >
                      <span className="svc-row__num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="svc-row__icon">
                        <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                      </span>
                      <span className="svc-row__text">
                        <span className="svc-row__label">{t.label}</span>
                        <span className="svc-row__title">{t.title}</span>
                        <span className="svc-row__desc">{t.body}</span>
                      </span>
                      <ArrowUpRight className="svc-row__arrow" size={22} aria-hidden="true" />
                    </button>
                  </Reveal>
                </li>
              )
            })}
          </ul>

          <div className="svc-index__stage" aria-hidden="true">
            {about.themes.map((t, i) => (
              <motion.div
                key={t.label}
                className="svc-index__img"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.06 }}
                transition={{ duration: 0.9, ease }}
              >
                <Img src={themeImages[i]} alt="" />
              </motion.div>
            ))}
            <div className="svc-index__caption">
              <span>
                {String(active + 1).padStart(2, '0')} / {total}
              </span>
              <em>{current.label}</em>
              <strong>{current.title}</strong>
            </div>
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

      <DefinesUs />
    </>
  )
}
