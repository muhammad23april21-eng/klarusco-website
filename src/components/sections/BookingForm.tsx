import { useId, useState, type FormEvent } from 'react'
import { AlertCircle, ArrowLeft, Info, Loader2, MessageCircle } from 'lucide-react'
import { config, popupContact } from '../../content/site'
import { countries, findCountry } from '../../content/countries'

/*
 * Details form inside the contact-options popup, used by two options:
 *  - "meeting":  sends a meeting request (email to the team + confirmation to the visitor).
 *  - "whatsapp": opens WhatsApp with the details typed in (the visitor presses Send) and
 *                emails the team that the visitor chose WhatsApp.
 * The date and time are preferences only — the team confirms availability manually.
 * Window: today + 7 days, Monday–Friday, one-hour slots 9 AM – 6 PM Pakistan time (PKT, UTC+5).
 * public/api/booking.php re-checks all of this.
 */

export type DetailsMode = 'meeting' | 'whatsapp'

const PKT_OFFSET_MS = 5 * 60 * 60 * 1000 // Pakistan has no daylight saving
const WINDOW_DAYS = 7
const SLOTS = [
  { hour: 9, label: '9–10 AM' },
  { hour: 10, label: '10–11 AM' },
  { hour: 11, label: '11 AM–12 PM' },
  { hour: 12, label: '12–1 PM' },
  { hour: 13, label: '1–2 PM' },
  { hour: 14, label: '2–3 PM' },
  { hour: 15, label: '3–4 PM' },
  { hour: 16, label: '4–5 PM' },
  { hour: 17, label: '5–6 PM' },
]

interface WindowDay {
  date: string // YYYY-MM-DD (PKT)
  weekdayShort: string
  dayMonth: string
  longText: string // "Tuesday, 17 November 2026"
  weekend: boolean
  /** Start hours that have already begun (today only) */
  pastHours: number[]
}

/** Today + the next 7 days in Pakistan time, computed from the visitor's clock. */
function bookingWindow(): WindowDay[] {
  const t = new Date(Date.now() + PKT_OFFSET_MS) // read with UTC getters = Pakistan wall-clock time
  const days: WindowDay[] = []
  for (let i = 0; i <= WINDOW_DAYS; i++) {
    const d = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() + i))
    const fmt = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-GB', { ...o, timeZone: 'UTC' })
    days.push({
      date: d.toISOString().slice(0, 10),
      weekdayShort: fmt({ weekday: 'short' }),
      dayMonth: fmt({ day: 'numeric', month: 'short' }),
      longText: fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      weekend: d.getUTCDay() === 0 || d.getUTCDay() === 6,
      pastHours: i === 0 ? SLOTS.filter((s) => s.hour <= t.getUTCHours()).map((s) => s.hour) : [],
    })
  }
  return days
}

export interface BookingPrefill {
  name: string
  email: string
  phone: string
  company: string
  /** ISO country code, as used by the contact form */
  countryCode: string
}

export interface DetailsResult {
  mode: DetailsMode
  dayText: string
  time: string
  /** WhatsApp link (mode "whatsapp"), so the visitor can open it again */
  waUrl?: string
  /** False when the browser blocked the new WhatsApp tab */
  waOpened?: boolean
}

interface Props {
  mode: DetailsMode
  prefill?: BookingPrefill
  /** Contact-form payload submitted just before; included in the team's email. */
  enquiry?: object
  onBack: () => void
  onDone: (result: DetailsResult) => void
}

type FieldKey = 'name' | 'email' | 'phone' | 'company' | 'country' | 'date' | 'time' | 'purpose'
type Errors = Partial<Record<FieldKey, string>>

const visitorTimezone = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  } catch {
    return ''
  }
})()

export function BookingForm({ mode, prefill, enquiry, onBack, onDone }: Props) {
  const uid = useId()
  const [days, setDays] = useState(bookingWindow)
  const [values, setValues] = useState({
    name: prefill?.name ?? '',
    email: prefill?.email ?? '',
    phone: prefill?.phone ?? '',
    company: prefill?.company ?? '',
    country: prefill?.countryCode ?? '',
    date: '',
    hour: null as number | null,
    purpose: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState('')

  const selectedDay = days.find((d) => d.date === values.date)
  const slotLabel = SLOTS.find((s) => s.hour === values.hour)?.label

  const validate = (v: typeof values): Errors => {
    const e: Errors = {}
    if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
    if (!v.email.trim()) e.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
    if (!/^\+?[0-9 ()-]{6,40}$/.test(v.phone.trim()) || v.phone.replace(/\D/g, '').length < 6)
      e.phone = 'Please enter a valid WhatsApp or phone number.'
    if (v.company.trim().length < 2) e.company = 'Please enter your company name.'
    if (!v.country) e.country = 'Please select your country.'
    if (!v.date) e.date = 'Please choose a preferred date.'
    if (v.hour === null) e.time = 'Please choose a preferred time.'
    if (v.purpose.trim().length < 5) e.purpose = 'Please tell us briefly what you would like to discuss.'
    return e
  }

  const update = (patch: Partial<typeof values>) => {
    const next = { ...values, ...patch }
    setValues(next)
    if (submitted) setErrors(validate(next))
    setFormError('')
  }

  const countryName = findCountry(values.country)?.name ?? values.country

  /** WhatsApp message with every detail; the visitor reviews it and presses Send. */
  const whatsappUrl = (day: WindowDay, slot: string) => {
    const text = [
      'Hello Klarus & Co, I would like to discuss my requirements.',
      '',
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Company: ${values.company.trim()}`,
      `Country: ${countryName}`,
      `Preferred meeting: ${day.longText}, ${slot} PKT`,
      `Meeting purpose: ${values.purpose.trim()}`,
    ].join('\n')
    return `https://wa.me/${popupContact.whatsappNumber}?text=${encodeURIComponent(text)}`
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSubmitted(true)
    // The window moves on every day / hour: recompute before checking the choice.
    const fresh = bookingWindow()
    setDays(fresh)
    const freshDay = fresh.find((d) => d.date === values.date)
    let v = values
    if (values.date && (!freshDay || freshDay.weekend || (values.hour !== null && freshDay.pastHours.includes(values.hour)))) {
      v = { ...values, date: freshDay && !freshDay.weekend ? values.date : '', hour: null }
      setValues(v)
    }
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    const day = fresh.find((d) => d.date === v.date)!
    const slot = SLOTS.find((s) => s.hour === v.hour)!.label

    // WhatsApp must open straight from the click, before any network request, or browsers block it.
    let waUrl: string | undefined
    let waOpened: boolean | undefined
    if (mode === 'whatsapp') {
      waUrl = whatsappUrl(day, slot)
      const win = window.open(waUrl, '_blank')
      if (win) win.opener = null
      waOpened = Boolean(win)
    }

    if (!config.bookingEndpoint) {
      if (mode === 'whatsapp') onDone({ mode, dayText: day.longText, time: `${slot} PKT`, waUrl, waOpened })
      else setFormError('Online meeting requests are not available right now. Please contact us by email or WhatsApp instead.')
      return
    }

    const trap = (e.currentTarget as HTMLFormElement).elements.namedItem('website')
    setSending(true)
    setFormError('')
    try {
      const res = await fetch(config.bookingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          kind: mode,
          name: v.name.trim(),
          email: v.email.trim(),
          phone: v.phone.trim(),
          company: v.company.trim(),
          country: countryName,
          date: v.date,
          hour: v.hour,
          purpose: v.purpose.trim(),
          timezone: visitorTimezone,
          enquiry: enquiry ?? null,
          website: trap instanceof HTMLInputElement ? trap.value : '',
        }),
      })
      const body = (await res.json().catch(() => null)) as { ok?: boolean; fields?: string[] } | null
      if (res.ok && body?.ok === true) {
        onDone({ mode, dayText: day.longText, time: `${slot} PKT`, waUrl, waOpened })
        return
      }
      if (mode === 'whatsapp') {
        // WhatsApp is already open with their message; only our heads-up email failed.
        onDone({ mode, dayText: day.longText, time: `${slot} PKT`, waUrl, waOpened })
        return
      }
      if (res.status === 422 && (body?.fields?.includes('date') || body?.fields?.includes('time'))) {
        setDays(bookingWindow())
        setValues((x) => ({ ...x, hour: null }))
        setFormError('That date or time is no longer available. Please choose another preferred time.')
      } else if (res.status === 422) {
        setFormError('Some details could not be accepted. Please check the form and try again.')
      } else if (res.status === 429) {
        setFormError('Too many requests. Please wait a while and try again, or contact us by email or WhatsApp.')
      } else {
        setFormError('Sorry, your meeting request could not be sent. Please try again, or contact us by email or WhatsApp.')
      }
    } catch {
      if (mode === 'whatsapp') onDone({ mode, dayText: day.longText, time: `${slot} PKT`, waUrl, waOpened })
      else setFormError('Sorry, your meeting request could not be sent. Please check your connection and try again.')
    } finally {
      setSending(false)
    }
  }

  const field = (k: FieldKey) => ({
    id: `${uid}-${k}`,
    'aria-invalid': Boolean(errors[k]),
    'aria-describedby': errors[k] ? `${uid}-${k}-err` : undefined,
  })
  const err = (k: FieldKey) =>
    errors[k] ? (
      <span id={`${uid}-${k}-err`} className="field__error">
        <AlertCircle size={13} aria-hidden="true" /> {errors[k]}
      </span>
    ) : null
  const label = (k: FieldKey, text: string) => (
    <label htmlFor={`${uid}-${k}`}>
      {text} <span aria-hidden="true">*</span>
    </label>
  )

  return (
    <form className="cbook" onSubmit={onSubmit} noValidate aria-busy={sending}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <fieldset className="cbook__fields" disabled={sending}>
        <div className="cbook__row">
          <div className="field">
            {label('name', 'Full Name')}
            <input {...field('name')} type="text" autoComplete="name" value={values.name} onChange={(e) => update({ name: e.target.value })} />
            {err('name')}
          </div>
          <div className="field">
            {label('email', 'Email')}
            <input {...field('email')} type="email" autoComplete="email" value={values.email} onChange={(e) => update({ email: e.target.value })} />
            {err('email')}
          </div>
        </div>
        <div className="cbook__row">
          <div className="field">
            {label('phone', 'WhatsApp / Phone Number')}
            <input {...field('phone')} type="tel" autoComplete="tel" placeholder="+92 300 1234567" value={values.phone} onChange={(e) => update({ phone: e.target.value })} />
            {err('phone')}
          </div>
          <div className="field">
            {label('company', 'Company Name')}
            <input {...field('company')} type="text" autoComplete="organization" value={values.company} onChange={(e) => update({ company: e.target.value })} />
            {err('company')}
          </div>
        </div>
        <div className="field">
          {label('country', 'Country')}
          <select {...field('country')} value={values.country} onChange={(e) => update({ country: e.target.value })}>
            <option value="" disabled>
              Select country
            </option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {err('country')}
        </div>

        <div className="field">
          <span className="cbook__label" id={`${uid}-date-label`}>
            Preferred Meeting Date <span aria-hidden="true">*</span>
          </span>
          <div className={`cbook__days${errors.date ? ' is-invalid' : ''}`} role="group" aria-labelledby={`${uid}-date-label`}>
            {days.map((d, i) => {
              const noSlotsLeft = !d.weekend && d.pastHours.length === SLOTS.length
              const disabled = d.weekend || noSlotsLeft
              const note = d.weekend ? 'Weekend' : noSlotsLeft ? 'Closed' : 'Available'
              return (
                <button
                  key={d.date}
                  id={i === 0 ? `${uid}-date` : undefined}
                  type="button"
                  className="cbook__day"
                  data-date={d.date}
                  disabled={disabled}
                  aria-pressed={values.date === d.date}
                  aria-label={`${d.longText}: ${note}`}
                  onClick={() => update({ date: d.date, hour: null })}
                >
                  <span className="cbook__dname">{d.weekdayShort}</span>
                  <span className="cbook__dnum">{d.dayMonth}</span>
                  <small>{note}</small>
                </button>
              )
            })}
          </div>
          {err('date')}
        </div>

        <div className="field">
          <span className="cbook__label" id={`${uid}-time-label`}>
            Preferred Meeting Time (Pakistan Standard Time, PKT) <span aria-hidden="true">*</span>
          </span>
          {!selectedDay ? (
            <p className="cbook__hint">Choose a date to see the one-hour time slots.</p>
          ) : (
            <div className="cbook__slots" role="group" aria-labelledby={`${uid}-time-label`}>
              {SLOTS.map((s, i) => {
                const past = selectedDay.pastHours.includes(s.hour)
                return (
                  <button
                    key={s.hour}
                    id={i === 0 ? `${uid}-time` : undefined}
                    type="button"
                    className={`cbook__slot${past ? ' is-past' : ''}`}
                    data-hour={s.hour}
                    disabled={past}
                    aria-pressed={values.hour === s.hour}
                    onClick={() => update({ hour: s.hour })}
                  >
                    <span>{s.label}</span>
                    {past && <small>Passed</small>}
                  </button>
                )
              })}
            </div>
          )}
          {err('time')}
          <p className="cbook__tz">
            Times are Pakistan Standard Time (PKT, UTC+5), Monday to Friday, within the next 7 days.
            {visitorTimezone && visitorTimezone !== 'Asia/Karachi' ? ` Your timezone: ${visitorTimezone}.` : ''}
          </p>
        </div>

        <div className="field">
          {label('purpose', 'Meeting Purpose')}
          <textarea {...field('purpose')} rows={3} maxLength={1000} value={values.purpose} onChange={(e) => update({ purpose: e.target.value })} />
          {err('purpose')}
        </div>
      </fieldset>

      {selectedDay && slotLabel && (
        <p className="cbook__summary">
          <Info size={15} aria-hidden="true" />
          <span>
            Preferred: <strong>{selectedDay.longText}</strong>, <strong>{slotLabel} PKT</strong>. This is a request
            &mdash; our team will confirm availability with you.
          </span>
        </p>
      )}

      {formError && (
        <div className="form-msg form-msg--error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <p>{formError}</p>
        </div>
      )}

      <div className="cbook__actions">
        <button type="button" className="cbook__back" onClick={onBack} disabled={sending}>
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </button>
        <button type="submit" className="btn btn--forest" disabled={sending}>
          {sending ? (
            <Loader2 className="spin" size={17} aria-hidden="true" />
          ) : mode === 'whatsapp' ? (
            <MessageCircle size={17} aria-hidden="true" />
          ) : null}
          <span>{sending ? 'Sending…' : mode === 'whatsapp' ? 'Continue to WhatsApp' : 'Send Meeting Request'}</span>
        </button>
      </div>
    </form>
  )
}
