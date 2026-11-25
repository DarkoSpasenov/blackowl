import { site } from '@/content/site'
import { type Dictionary, type Locale, href, lines } from '@/lib/i18n'
import { Brush, Btn, Eyebrow, MaskTitle } from './ui'

/** Closing call-to-action shared by the pages. */
export default function BookingCta({ lang, t, title, body }: { lang: Locale; t: Dictionary; title: string; body: string }) {
  return (
    <section className="cta">
      <div className="cta__brush" data-drift="60" aria-hidden="true"><Brush variant={2} /></div>
      <div className="wrap cta__inner">
        <Eyebrow>{t.home.ctaEyebrow}</Eyebrow>
        <MaskTitle lines={lines(title)} className="cta__title" />
        <p className="cta__body" data-fade>{body}</p>
        <div className="cta__actions" data-fade>
          <Btn href={href(lang, 'contact', '#booking')}>{t.nav.book}</Btn>
          <a className="cta__phone" href={site.phoneHref}>{site.phone}</a>
        </div>
      </div>
    </section>
  )
}
