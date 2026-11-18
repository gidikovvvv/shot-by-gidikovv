import { Link } from 'react-router-dom'
import { nav, site } from '@/config/site'
import { categories } from '@/data/categories'
import { Wordmark } from './Header'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="page-x border-t border-line pt-16 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] md:pt-24">
      <div className="mx-auto grid max-w-page gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link to="/" aria-label={`${site.name} — home`} className="text-bone">
            <Wordmark />
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-bone-dim">
            Photography by {site.photographer}. Events, portraits, street and landscape — based in {site.location},
            working wherever the story is.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-4">
          <div>
            <h2 className="eyebrow mb-5 text-mute">Site</h2>
            <ul className="space-y-3 text-sm">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="link-draw text-bone-dim hover:text-bone">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow mb-5 text-mute">Work</h2>
            <ul className="space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/portfolio/${c.slug}`} className="link-draw text-bone-dim hover:text-bone">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="md:col-span-3">
          <h2 className="eyebrow mb-5 text-mute">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="link-draw break-all text-bone-dim hover:text-bone">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw text-bone-dim hover:text-bone"
              >
                Instagram {site.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-page flex-col gap-3 border-t border-line pt-6 text-xs text-mute sm:flex-row sm:justify-between">
        <p>
          © {year} {site.photographer}. All photographs are protected by copyright.
        </p>
        <p>{site.location}</p>
      </div>
    </footer>
  )
}
