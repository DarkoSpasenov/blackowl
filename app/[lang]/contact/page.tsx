import type { Metadata } from 'next'
import BookingForm from '@/components/BookingForm'
import PageFx from '@/components/PageFx'
import { Brush, Eyebrow, LineLink, MaskTitle } from '@/components/ui'
import { site } from '@/content/site'
import { type Locale, getDictionary, lines } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
  return pageMetadata((await params).lang as Locale, 'contact')
}

export default async function Contact({ params }: PageProps<'/[lang]/contact'>) {
  const lang = (await params).lang as Locale
  const t = getDictionary(lang)
  const q = encodeURIComponent(site.mapsQuery)
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${q}`

  return (
    <PageFx key="contact" className="contact">
      <section className="chead wrap">
        <div className="chead__brush" data-drift="50" aria-hidden="true"><Brush variant={0} /></div>
        <div className="chead__title">
          <p className="eyebrow" data-intro="0.2"><span className="eyebrow__n">—</span><span>{t.contact.eyebrow}</span></p>
          <MaskTitle as="h1" lines={lines(t.contact.title)} className="chead__h" intro />
          <p className="chead__lead" data-intro="0.7">{t.contact.lead}</p>
        </div>

        <div className="cinfo">
          <div className="cinfo__item" data-intro="0.8">
            <p className="cinfo__k">{t.contact.call}</p>
            <a className="cinfo__phone" href={site.phoneHref}>{site.phone}</a>
          </div>
          <div className="cinfo__item" data-intro="0.9">
            <p className="cinfo__k">{t.contact.visit}</p>
            <address>
              {site.address.street[lang]}
              <br />
              {site.address.postalCode} {site.address.city[lang]}, {site.address.country[lang]}
            </address>
            <LineLink href={mapsLink} external>{t.common.openMaps}</LineLink>
          </div>
          <div className="cinfo__item" data-intro="1">
            <p className="cinfo__k">{t.contact.follow}</p>
            <a className="cinfo__ig" href={site.instagram} target="_blank" rel="noopener noreferrer">{site.instagramHandle}</a>
            <p className="cinfo__artists">
              {site.artists.map((a) => (
                <a key={a.handle} href={a.instagram} target="_blank" rel="noopener noreferrer">{a.handle}</a>
              ))}
            </p>
          </div>
          {site.hours ? (
            <div className="cinfo__item" data-intro="1.1">
              <dl className="hours">
                {site.hours.map((h) => (
                  <div key={h.days[lang]}><dt>{h.days[lang]}</dt><dd>{h.hours}</dd></div>
                ))}
              </dl>
            </div>
          ) : (
            <p className="cinfo__note" data-intro="1.1">{t.contact.hoursSoon}</p>
          )}
        </div>
      </section>

      <section className="map" aria-label={t.contact.mapTitle}>
        <div className="map__frame" data-img-reveal>
          <div>
            <iframe
              title={t.contact.mapTitle}
              src={`https://www.google.com/maps?q=${q}&hl=${lang}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
        <div className="map__pin" aria-hidden="true">
          <span />
        </div>
      </section>

      <section className="booking wrap" id="booking" aria-labelledby="booking-title">
        <div className="booking__aside">
          <Eyebrow n="—">{t.contact.formEyebrow}</Eyebrow>
          <MaskTitle id="booking-title" lines={lines(t.contact.formTitle)} className="booking__title" />
          <span className="rule" data-rule />
          <p className="booking__alt" data-fade>
            {t.contact.call}: <a href={site.phoneHref}>{site.phone}</a>
          </p>
        </div>
        <div className="booking__form" data-fade>
          <BookingForm t={t} lang={lang} />
        </div>
      </section>
    </PageFx>
  )
}
