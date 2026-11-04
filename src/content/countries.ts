import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js/min'

export interface Country {
  code: CountryCode
  name: string
  dial: string
}

const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['en'], { type: 'region' }) : null

/** Every country with its English name and international dialling code, sorted by name. */
export const countries: Country[] = getCountries()
  .map((code) => ({ code, name: regionNames?.of(code) ?? code, dial: `+${getCountryCallingCode(code)}` }))
  .sort((a, b) => a.name.localeCompare(b.name))

export const defaultCountry: CountryCode = 'PK'

export const findCountry = (code: string) => countries.find((c) => c.code === code)
