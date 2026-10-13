import { useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Mail, MessageCircle, Settings2 } from 'lucide-react'
import { config, plans, type PlanId, type TierId } from '../../content/site'
import { useSelection } from '../../hooks/SelectionContext'
import { ease } from '../motion'

interface Values {
  name: string
  email: string
  company: string
  phone: string
  plan: PlanId | 'unsure'
  level: TierId | 'unsure'
  message: string
}

type Errors = Partial<Record<keyof Values, string>>
type Status = 'idle' | 'submitting' | 'sent' | 'error' | 'unconfigured'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phoneRe = /^[+()\d\s-]{6,20}$/

function validate(v: Values): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!emailRe.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.phone.trim() && !phoneRe.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.'
  if (v.message.trim().length < 10) e.message = 'Please tell us a little more about your requirements (at least 10 characters).'
  else if (v.message.length > 2000) e.message = 'Please keep your message under 2,000 characters.'
  return e
}

const levelLabels: Record<TierId, string> = { bookkeeper: 'Bookkeeper', supervisor: 'Supervisor', manager: 'Manager' }

function summarise(v: Values) {
  const plan = v.plan === 'unsure' ? 'Not sure yet' : plans.find((p) => p.id === v.plan)?.name
  const level = v.level === 'unsure' ? 'Not sure yet' : levelLabels[v.level]
  const details = [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.company ? `Company: ${v.company}` : null,
    v.phone ? `Phone: ${v.phone}` : null,
    `Support model: ${plan}`,
    `Expertise level: ${level}`,
  ].filter(Boolean)
  return `${details.join('\n')}\n\n${v.message}`
}

export function ContactForm() {
  const { selection } = useSelection()
  const uid = useId()
  const [values, setValues] = useState<Values>({
    name: '',
    email: '',
    company: '',
    phone: '',
    plan: selection.plan ?? 'unsure',
    level: selection.tier ?? 'unsure',
    message: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    const next = { ...values, [k]: val }
    setValues(next)
    if (touched[k]) setErrors(validate(next))
    if (status !== 'idle' && status !== 'submitting') setStatus('idle')
  }
  const blur = (k: keyof Values) => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(values))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ name: true, email: true, phone: true, message: true })
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    if (!config.formEndpoint) {
      setStatus('unconfigured')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch(config.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, _subject: 'Website enquiry' }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const text = summarise(values)
  const mailto = config.email
    ? `mailto:${config.email}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(text)}`
    : null
  const wa = config.whatsappNumber ? `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}` : null

  const field = (k: keyof Values) => ({
    id: `${uid}-${k}`,
    name: k,
    'aria-invalid': Boolean(touched[k] && errors[k]),
    'aria-describedby': touched[k] && errors[k] ? `${uid}-${k}-err` : undefined,
    onBlur: () => blur(k),
  })
  const err = (k: keyof Values) =>
    touched[k] && errors[k] ? (
      <span id={`${uid}-${k}-err`} className="field__error">
        <AlertCircle size={13} aria-hidden="true" /> {errors[k]}
      </span>
    ) : null

  if (status === 'sent') {
    return (
      <motion.div className="form-done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} role="status">
        <CheckCircle2 size={40} strokeWidth={1.3} aria-hidden="true" />
        <h3>Thank you — your message has been sent.</h3>
        <p>We’ll be in touch to discuss your bookkeeping and accounting requirements.</p>
      </motion.div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <div className="field">
          <label htmlFor={`${uid}-name`}>
            Full name <span aria-hidden="true">*</span>
          </label>
          <input {...field('name')} type="text" autoComplete="name" required value={values.name} onChange={(e) => set('name', e.target.value)} />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor={`${uid}-email`}>
            Email address <span aria-hidden="true">*</span>
          </label>
          <input {...field('email')} type="email" autoComplete="email" required value={values.email} onChange={(e) => set('email', e.target.value)} />
          {err('email')}
        </div>
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor={`${uid}-company`}>Company</label>
          <input {...field('company')} type="text" autoComplete="organization" value={values.company} onChange={(e) => set('company', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor={`${uid}-phone`}>Phone / WhatsApp</label>
          <input {...field('phone')} type="tel" autoComplete="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
          {err('phone')}
        </div>
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor={`${uid}-plan`}>Support model</label>
          <select {...field('plan')} value={values.plan} onChange={(e) => set('plan', e.target.value as Values['plan'])}>
            <option value="unsure">Not sure yet</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${uid}-level`}>Expertise level</label>
          <select {...field('level')} value={values.level} onChange={(e) => set('level', e.target.value as Values['level'])}>
            <option value="unsure">Not sure yet</option>
            {(Object.keys(levelLabels) as TierId[]).map((t) => (
              <option key={t} value={t}>
                {levelLabels[t]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${uid}-message`}>
          Tell us about your business and your accounting requirements <span aria-hidden="true">*</span>
        </label>
        <textarea {...field('message')} rows={6} required value={values.message} onChange={(e) => set('message', e.target.value)} />
        <span className="field__count" aria-hidden="true">
          {values.message.length} / 2000
        </span>
        {err('message')}
      </div>

      <div className="form__foot">
        <p className="form__req">
          <span aria-hidden="true">*</span> Required fields
        </p>
        <button type="submit" className="btn btn--forest btn--lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? <Loader2 className="spin" size={18} aria-hidden="true" /> : null}
          <span>{status === 'submitting' ? 'Sending…' : 'Send Message'}</span>
          {status !== 'submitting' && <ArrowRight className="btn__arrow" size={17} aria-hidden="true" />}
        </button>
      </div>

      <div aria-live="polite">
        <AnimatePresence>
          {status === 'error' && (
            <motion.div className="form-msg form-msg--error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AlertCircle size={18} aria-hidden="true" />
              <p>Sorry, your message could not be sent. Please try again or use WhatsApp or email.</p>
            </motion.div>
          )}
          {status === 'unconfigured' && (
            <motion.div className="form-msg form-msg--pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Settings2 size={18} aria-hidden="true" />
              <div>
                <p>
                  <strong>Your message has not been sent.</strong> Online form submission isn’t connected yet
                  {mailto || wa ? ' — you can send the same details directly instead:' : '. Contact details will be added soon.'}
                </p>
                {(mailto || wa) && (
                  <div className="form-msg__actions">
                    {mailto && (
                      <a className="btn btn--forest" href={mailto}>
                        <Mail size={16} aria-hidden="true" />
                        <span>Send via email</span>
                      </a>
                    )}
                    {wa && (
                      <a className="btn btn--outline-dark" href={wa} target="_blank" rel="noopener noreferrer">
                        <MessageCircle size={16} aria-hidden="true" />
                        <span>Send via WhatsApp</span>
                      </a>
                    )}
                  </div>
                )}
                <p className="form-msg__dev">
                  Site owner: set <code>VITE_FORM_ENDPOINT</code> to enable direct submission.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
