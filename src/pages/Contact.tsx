import { contact, images } from '../content/site'
import { PageBanner } from '../components/sections/PageBanner'
import { ContactChannels } from '../components/sections/ContactChannels'
import { ContactForm } from '../components/sections/ContactForm'
import { SelectionSummary } from '../components/sections/SelectionSummary'
import { Eyebrow, Reveal, TextReveal } from '../components/ui/Reveal'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Contact() {
  usePageTitle('Contact Us')
  return (
    <>
      <PageBanner image={images.contactOffice} eyebrow="Contact Us" title="Contact Us" intro={contact.secondary} overlay="mono" layout="left" />

      <section className="section section--white contact" aria-labelledby="contact-title">
        <div className="container contact__grid">
          <div className="contact__aside">
            <Eyebrow tone="forest">Get in touch</Eyebrow>
            <TextReveal id="contact-title" className="display-2" text={contact.heading} />
            <Reveal delay={0.15}>
              <p className="lead">{contact.body}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <SelectionSummary />
            </Reveal>
            <Reveal delay={0.25}>
              <ContactChannels />
            </Reveal>
          </div>

          <Reveal className="contact__form-wrap" delay={0.1}>
            <div className="contact__form-head">
              <h2 className="display-3">Send us a message</h2>
              <p>{contact.secondary}</p>
            </div>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
