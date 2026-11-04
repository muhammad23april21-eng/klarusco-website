import { useEffect, useId, useMemo, useRef, useState, type InputHTMLAttributes } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import type { CountryCode } from 'libphonenumber-js/min'
import { countries, findCountry } from '../../content/countries'
import 'flag-icons/css/flag-icons.min.css'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  country: CountryCode
  onCountryChange: (code: CountryCode) => void
  value: string
  onChange: (value: string) => void
  invalid?: boolean
}

function Flag({ code }: { code: string }) {
  return <span className={`fi fi-${code.toLowerCase()} phone__flag`} aria-hidden="true" />
}

/**
 * One phone field with an integrated country selector (flag + dialling code) at the start.
 * The visitor types only their number after the code.
 */
export function PhoneInput({ country, onCountryChange, value, onChange, invalid, id, ...inputProps }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  const current = findCountry(country)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, '')
    if (!q) return countries
    return countries.filter((c) => c.name.toLowerCase().includes(q) || c.dial.slice(1).startsWith(q) || c.code.toLowerCase() === q)
  }, [query])

  useEffect(() => {
    if (!open) return
    searchRef.current?.focus()
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    listRef.current?.children[highlight]?.scrollIntoView({ block: 'nearest' })
  }, [highlight])

  const openList = () => {
    setQuery('')
    setHighlight(Math.max(0, countries.findIndex((c) => c.code === country)))
    setOpen(true)
  }
  const pick = (code: CountryCode) => {
    onCountryChange(code)
    setOpen(false)
    document.getElementById(id ?? '')?.focus()
  }

  return (
    <div ref={rootRef} className={`phone ${invalid ? 'is-invalid' : ''} ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="phone__country"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Country code: ${current?.name ?? country} ${current?.dial ?? ''}`}
        onClick={() => (open ? setOpen(false) : openList())}
      >
        <Flag code={country} />
        <span className="phone__dial">{current?.dial}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <input
        {...inputProps}
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        className="phone__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {open && (
        <div className="phone__menu">
          <div className="phone__search">
            <Search size={15} aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search country or code"
              aria-label="Search country or dialling code"
              aria-controls={listId}
              aria-activedescendant={filtered[highlight] ? `${listId}-${filtered[highlight].code}` : undefined}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setHighlight(0)
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setHighlight((h) => Math.min(h + 1, filtered.length - 1))
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setHighlight((h) => Math.max(h - 1, 0))
                } else if (e.key === 'Enter') {
                  e.preventDefault()
                  if (filtered[highlight]) pick(filtered[highlight].code)
                } else if (e.key === 'Escape') {
                  e.preventDefault()
                  setOpen(false)
                }
              }}
            />
          </div>
          <ul ref={listRef} id={listId} role="listbox" aria-label="Country codes" className="phone__list">
            {filtered.map((c, i) => (
              <li
                key={c.code}
                id={`${listId}-${c.code}`}
                role="option"
                aria-selected={c.code === country}
                className={`${i === highlight ? 'is-highlight' : ''} ${c.code === country ? 'is-selected' : ''}`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  pick(c.code)
                }}
              >
                <Flag code={c.code} />
                <span className="phone__name">{c.name}</span>
                <span className="phone__code">{c.dial}</span>
              </li>
            ))}
            {filtered.length === 0 && <li className="phone__empty">No matching country</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
