import type { Metadata } from 'next'
import BookingCta from '@/components/BookingCta'
import Hero from '@/components/Hero'
import PageFx from '@/components/PageFx'
import { Eyebrow, LineLink, MaskTitle, Media } from '@/components/ui'
import WorksSlider from '@/components/WorksSlider'
import { gallery } from '@/content/gallery'
import { media } from '@/content/media'
import { type Locale, getDictionary, href, lines } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  return pageMetadata((await params).lang as Locale, 'home')
}

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const lang = (await params).lang as Locale
  const t = getDictionary(lang)

  return (
    <PageFx key="home" className="home">
      <Hero lang={lang} t={t} />

      <div className="after-hero">
        <svg className="tear" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 80V38c60-6 110 8 170 2s90-22 160-18 120 26 190 20 80-28 150-24 110 22 180 16 100-24 170-20 120 22 190 18 90-14 140-10 50 10 90 6v52z" fill="#080808" />
        </svg>

        <section className="intro wrap" aria-labelledby="intro-title">
          <div className="intro__text">
            <Eyebrow n="01">{t.home.studioEyebrow}</Eyebrow>
            <MaskTitle id="intro-title" lines={lines(t.home.studioTitle)} className="intro__title" />
            <span className="rule" data-rule />
            <p className="intro__body" data-fade>{t.home.studioBody}</p>
            <dl className="facts" data-fade>
              {t.home.studioFacts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
            <div data-fade><LineLink href={href(lang, 'about')}>{t.home.studioLink}</LineLink></div>
          </div>
          <div className="intro__visual">
            <div className="intro__main" data-img-reveal>
              <div data-parallax="0.08"><Media item={media.studioIntro} lang={lang} sizes="(max-width: 820px) 90vw, 40vw" label={t.common.placeholder} /></div>
            </div>
            <div className="intro__detail" data-img-reveal>
              <div><Media item={media.heroDetail} lang={lang} sizes="(max-width: 820px) 50vw, 20vw" label={t.common.placeholder} /></div>
            </div>
            <span className="intro__year" data-parallax="0.35" aria-hidden="true">2020</span>
          </div>
        </section>

        <section className="works" aria-labelledby="works-title">
          <div className="wrap works__head">
            <Eyebrow n="02">{t.home.worksEyebrow}</Eyebrow>
            <MaskTitle id="works-title" lines={[t.home.worksTitle]} className="works__title" />
            <div data-fade><LineLink href={href(lang, 'gallery')}>{t.home.worksLink}</LineLink></div>
          </div>
          <div className="wrap" data-fade>
            <WorksSlider
              items={gallery.slice(0, 5)}
              lang={lang}
              labels={{ prev: t.home.prev, next: t.home.next, placeholder: t.common.placeholder, video: t.common.video }}
            />
          </div>
        </section>

        <BookingCta lang={lang} t={t} title={t.home.ctaTitle} body={t.home.ctaBody} />
      </div>
    </PageFx>
  )
}
