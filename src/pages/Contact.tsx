import { contact, images } from '../content/site'
import { PageBanner } from '../components/sections/PageBanner'
import { ContactForm } from '../components/sections/ContactForm'
import { Reveal } from '../components/ui/Reveal'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Contact() {
  usePageTitle('Contact Us')
  return (
    <>
      <PageBanner image={images.contactOffice} eyebrow="Contact Us" title="Contact Us" intro={contact.secondary} overlay="mono" layout="left" />

      <section className="section section--white contact" aria-labelledby="quote-form-title">
        <div className="container">
          <Reveal className="contact__form-wrap contact__form-wrap--centered" delay={0.1}>
            <div className="contact__form-head">
              <h2 id="quote-form-title" className="display-3">
                Contact Us
              </h2>
              <p>Tell us about your business and accounting requirements. Our team will review your information and get back to you.</p>
            </div>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
