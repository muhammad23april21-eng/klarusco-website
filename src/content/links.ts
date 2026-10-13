import { config, plans, type PlanId, type TierId } from './site'

export interface Selection {
  plan: PlanId | null
  tier: TierId | null
}

/** Human-readable summary of the visitor's pricing selection, e.g. "Monthly Fixed Plan — Supervisor ($1,500 / Month)". */
export function describeSelection({ plan, tier }: Selection): string | null {
  if (!plan) return null
  const p = plans.find((x) => x.id === plan)
  if (!p) return null
  const t = p.pricing.tiers.find((x) => x.id === tier)
  return t ? `${p.name} — ${t.title} (${t.price} / ${t.unit})` : p.name
}

function enquiryText(selection: Selection): string {
  const summary = describeSelection(selection)
  return summary
    ? `Hello, I would like to discuss my bookkeeping and accounting requirements. I am interested in: ${summary}.`
    : 'Hello, I would like to discuss my bookkeeping and accounting requirements.'
}

export function whatsappHref(selection: Selection): string | null {
  if (!config.whatsappNumber) return null
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(enquiryText(selection))}`
}

export function emailHref(selection: Selection): string | null {
  if (!config.email) return null
  const subject = describeSelection(selection) ? `Quote request: ${describeSelection(selection)}` : 'Accounting support enquiry'
  return `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryText(selection) + '\n\nAbout my business:\n')}`
}
