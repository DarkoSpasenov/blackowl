import type { Metadata } from 'next'
import Atelier from '@/components/Atelier'
import BookingCta from '@/components/BookingCta'
import PageFx from '@/components/PageFx'
import { Brush, Btn, Eyebrow, LineLink, MaskTitle, Media } from '@/components/ui'
import { media } from '@/content/media'
import { site } from '@/content/site'
import { type Locale, getDictionary, href, lines } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  return pageMetadata((await params).lang as Locale, 'about')
}

export default async function About({ params }: PageProps<'/[lang]/about'>) {
  const lang = (await params).lang as Locale
  const t = getDictionary(lang)
  const ph = t.common.placeholder

  return (
    <PageFx key="about" className="about">
      <section className="ahero wrap" data-tilt-scope>
        <div className="ahero__brush" data-depth="0.5" aria-hidden="true"><Brush variant={1} /></div>
        <div className="ahero__text">
          <p className="eyebrow" data-intro="0.2"><span className="eyebrow__n">—</span><span>{t.about.eyebrow}</span></p>
          <MaskTitle as="h1" lines={lines(t.about.title)} className="ahero__title" intro />
          <p className="ahero__est" data-intro="0.9">{t.common.est} {site.foundedDisplay} · {site.address.city[lang]}</p>
        </div>
        <div className="ahero__visual" data-tilt>
          <div className="ahero__frame" data-img-reveal data-depth="-0.2">
            <div data-parallax="0.08"><Media item={media.workB} lang={lang} priority sizes="(max-width: 900px) 80vw, 36vw" label={ph} /></div>
          </div>
          <span className="ahero__tag" data-intro="1.2" aria-hidden="true">Black Owl · {site.address.city[lang]}</span>
        </div>
      </section>

      <section className="manifesto wrap">
        <p className="manifesto__text" data-fade>
          <span className="manifesto__mark" aria-hidden="true">“</span>
          {t.about.intro}
        </p>
      </section>

      <section className="story wrap" aria-labelledby="story-title">
        <div className="story__aside">
          <Eyebrow n="01">{t.about.storyEyebrow}</Eyebrow>
          <MaskTitle id="story-title" lines={lines(t.about.storyTitle)} className="story__title" />
        </div>
        <ol className="story__list">
          {t.about.timeline.map((e) => (
            <li key={e.date} data-fade>
              <span className="story__date">{e.date}</span>
              <span className="rule" data-rule />
              <p>{e.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <Atelier
        a={media.workA}
        b={media.workB}
        lang={lang}
        eyebrow={t.about.atelierEyebrow}
        word={t.about.atelierWord}
        lines={t.about.atelierLines}
        label={ph}
      />

      <section className="artists" aria-labelledby="artists-title">
        <div className="wrap artists__head">
          <Eyebrow n="03">{t.about.artistsEyebrow}</Eyebrow>
          <MaskTitle id="artists-title" lines={lines(t.about.artistsTitle)} className="artists__title" />
        </div>
        <div className="wrap artists__grid">
          {site.artists.map((a, i) => (
            <article className="artist" key={a.handle} aria-labelledby={`artist-${i}`}>
              <span className="artist__n" data-fade>0{i + 1}</span>
              <MaskTitle as="h3" id={`artist-${i}`} lines={[a.name ?? a.handle]} className="artist__handle" />
              {a.name && <p className="artist__sub" data-fade>{a.handle}</p>}
              <span className="rule" data-rule />
              <div className="artist__block" data-fade>
                <h4>{t.about.bio}</h4>
                {a.bio ? <p>{a.bio[lang]}</p> : <p className="todo">{t.common.placeholderText}</p>}
              </div>
              <div className="artist__block" data-fade>
                <h4>{t.about.approach}</h4>
                {a.approach ? <p>{a.approach[lang]}</p> : <p className="todo">{t.common.placeholderText}</p>}
              </div>
              <div data-fade><LineLink href={a.instagram} external>{t.about.viewInstagram}</LineLink></div>
            </article>
          ))}
        </div>
        <div className="wrap artists__book" data-fade>
          <Btn href={href(lang, 'contact', '#booking')}>{t.nav.book}</Btn>
        </div>
      </section>

      <BookingCta lang={lang} t={t} title={t.about.ctaTitle} body={t.home.ctaBody} />
    </PageFx>
  )
}
