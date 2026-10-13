import { nav } from '../content/site'
import { ButtonLink } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'
import { Link } from 'react-router-dom'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <section className="notfound">
      <div className="container notfound__inner">
        <span className="notfound__code" aria-hidden="true">
          404
        </span>
        <h1 className="display-2 text-ivory">This page could not be found</h1>
        <p className="text-ivory-soft">The page you’re looking for may have moved. Try one of these instead:</p>
        <ul className="notfound__links">
          {nav.map((n) => (
            <li key={n.to}>
              <Link to={n.to}>{n.label}</Link>
            </li>
          ))}
        </ul>
        <ButtonLink to="/">Back to home</ButtonLink>
      </div>
    </section>
  )
}
