import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { routes } from '../../content/site'
import { describeSelection } from '../../content/links'
import { useSelection } from '../../hooks/SelectionContext'

/** Shows the plan/level the visitor picked on the pricing page, carried across routes. */
export function SelectionSummary() {
  const { selection, setSelection } = useSelection()
  const summary = describeSelection(selection)
  if (!summary) {
    return (
      <Link to={routes.pricing} className="selection selection--empty">
        <span className="selection__label">No plan selected yet</span>
        <span className="selection__value">Compare the Hourly-Based and Monthly Fixed plans →</span>
      </Link>
    )
  }
  return (
    <div className="selection">
      <div>
        <span className="selection__label">Your selection</span>
        <span className="selection__value">{summary}</span>
        <span className="selection__note">Included automatically when you contact us.</span>
      </div>
      <button type="button" className="selection__clear" aria-label="Clear selection" onClick={() => setSelection({ plan: null, tier: null })}>
        <X size={16} />
      </button>
    </div>
  )
}
