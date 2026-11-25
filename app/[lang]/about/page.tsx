import type { Metadata } from 'next'
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
      <section className="phero" data-tilt-scope>
        <div className="phero__media" data-tilt>
          <div className="phero__img" data-depth="-0.1" data-parallax="0.12">
            <Media item={media.aboutHero} lang={lang} fill priority label={ph} />
          </div>
        </div>
        <div className="phero__shade" />
        <div className="phero__brush" data-depth="0.5" aria-hidden="true"><Brush variant={1} /></div>
        <div className="wrap phero__content">
          <p className="eyebrow" data-intro="0.2"><span className="eyebrow__n">—</span><span>{t.about.eyebrow}</span></p>
          <MaskTitle as="h1" lines={lines(t.about.title)} className="phero__title" intro />
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

      <section className="space" aria-labelledby="space-title">
        <div className="wrap space__head">
          <Eyebrow n="02">{t.about.spaceEyebrow}</Eyebrow>
          <MaskTitle id="space-title" lines={lines(t.about.spaceTitle)} className="space__title" />
        </div>
        <div className="space__grid wrap">
          <div className="space__a" data-img-reveal><div data-parallax="0.06"><Media item={media.interior1} lang={lang} sizes="(max-width: 820px) 90vw, 38vw" label={ph} /></div></div>
          <div className="space__b" data-img-reveal><div data-parallax="0.1"><Media item={media.interior2} lang={lang} sizes="(max-width: 820px) 90vw, 50vw" label={ph} /></div></div>
          <div className="space__c" data-img-reveal><div><Media item={media.interior3} lang={lang} sizes="(max-width: 820px) 60vw, 24vw" label={ph} /></div></div>
        </div>
      </section>

      <section className="artists" aria-labelledby="artists-title">
        <div className="wrap artists__head">
          <Eyebrow n="03">{t.about.artistsEyebrow}</Eyebrow>
          <MaskTitle id="artists-title" lines={lines(t.about.artistsTitle)} className="artists__title" />
        </div>
        {site.artists.map((a, i) => (
          <article className={`artist wrap ${i % 2 ? 'artist--rev' : ''}`} key={a.handle} aria-labelledby={`artist-${i}`}>
            <div className="artist__visual">
              <div className="artist__portrait" data-img-reveal>
                <div data-parallax="0.07"><Media item={media[a.photo]} lang={lang} sizes="(max-width: 820px) 90vw, 36vw" label={ph} /></div>
              </div>
              <div className="artist__work" data-img-reveal>
                <div><Media item={media[a.photoWork]} lang={lang} sizes="(max-width: 820px) 70vw, 28vw" label={ph} /></div>
              </div>
            </div>
            <div className="artist__text">
              <span className="artist__n" data-fade>0{i + 1}</span>
              <MaskTitle as="h3" id={`artist-${i}`} lines={[a.name ?? a.handle]} className="artist__handle" />
              {a.name && <p className="artist__sub" data-fade>{a.handle}</p>}
              <div className="artist__block" data-fade>
                <h4>{t.about.bio}</h4>
                {a.bio ? <p>{a.bio[lang]}</p> : <p className="todo">{t.common.placeholderText}</p>}
              </div>
              <div className="artist__block" data-fade>
                <h4>{t.about.approach}</h4>
                {a.approach ? <p>{a.approach[lang]}</p> : <p className="todo">{t.common.placeholderText}</p>}
              </div>
              <div data-fade><LineLink href={a.instagram} external>{t.about.viewInstagram} · {a.handle}</LineLink></div>
            </div>
          </article>
        ))}
        <div className="wrap artists__book" data-fade>
          <Btn href={href(lang, 'contact', '#booking')}>{t.nav.book}</Btn>
        </div>
      </section>

      <BookingCta lang={lang} t={t} title={t.about.ctaTitle} body={t.home.ctaBody} />
    </PageFx>
  )
}
