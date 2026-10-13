import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Selection } from '../content/links'

interface Ctx {
  selection: Selection
  setSelection: (s: Selection) => void
}

const SelectionContext = createContext<Ctx | null>(null)

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>({ plan: null, tier: null })
  const value = useMemo(() => ({ selection, setSelection }), [selection])
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSelection() {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error('useSelection must be used inside SelectionProvider')
  return ctx
}
