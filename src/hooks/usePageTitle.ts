import { useEffect } from 'react'
import { brand } from '../content/site'

const base = 'Bookkeeping, Accounting & Financial Support'

/** Sets a descriptive document title (and keeps the meta description in sync) for the current page. */
export function usePageTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} — ${brand.name}` : `${brand.name} — ${base}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', brand.metaDescription)
  }, [page])
}
