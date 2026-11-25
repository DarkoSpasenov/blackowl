import { site } from '@/content/site'
import { type Dictionary, type Locale, href } from '@/lib/i18n'
import { TLink } from './Transition'

export default function Footer({ lang, t }: { lang: Locale; t: Dictionary }) {
  const year = new Date().getFullYear()
  return (
    <footer className="ftr">
      <div className="ftr__big" aria-hidden="true">
        <span>BLACK</span>
        <span className="ftr__owl">OWL</span>
      </div>
      <div className="ftr__grid">
        <div>
          <p className="ftr__k">{t.common.address}</p>
          <p>
            {site.address.street[lang]}
            <br />
            {site.address.postalCode} {site.address.city[lang]}, {site.address.country[lang]}
          </p>
        </div>
        <div>
          <p className="ftr__k">{t.common.phone}</p>
          <a href={site.phoneHref}>{site.phone}</a>
        </div>
        <div>
          <p className="ftr__k">{t.common.instagram}</p>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">{site.instagramHandle}</a>
          {site.artists.map((a) => (
            <a key={a.handle} href={a.instagram} target="_blank" rel="noopener noreferrer" className="ftr__sub">{a.handle}</a>
          ))}
        </div>
        <nav aria-label={t.nav.primary}>
          <p className="ftr__k">{t.nav.menu}</p>
          {(['home', 'about', 'gallery', 'contact'] as const).map((k) => (
            <TLink key={k} href={href(lang, k)}>{t.nav[k]}</TLink>
          ))}
        </nav>
      </div>
      <div className="ftr__base">
        <span>© {year} {site.name}</span>
        <span>{t.common.est} {site.foundedDisplay} · {site.address.city[lang]}</span>
      </div>
    </footer>
  )
}
