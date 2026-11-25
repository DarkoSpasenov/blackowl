import type { Metadata } from 'next'
import BookingCta from '@/components/BookingCta'
import Gallery from '@/components/Gallery'
import PageFx from '@/components/PageFx'
import { Brush, Media } from '@/components/ui'
import { gallery } from '@/content/gallery'
import { media } from '@/content/media'
import { type Locale, getDictionary } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: PageProps<'/[lang]/gallery'>): Promise<Metadata> {
  return pageMetadata((await params).lang as Locale, 'gallery')
}

export default async function GalleryPage({ params }: PageProps<'/[lang]/gallery'>) {
  const lang = (await params).lang as Locale
  const t = getDictionary(lang)

  return (
    <PageFx key="gallery" className="gallery-page">
      <section className="ghead" data-tilt-scope>
        <div className="ghead__media" data-tilt>
          <div className="ghead__img" data-depth="-0.15">
            <Media item={media.galleryHero} lang={lang} fill priority label={t.common.placeholder} />
          </div>
        </div>
        <div className="ghead__shade" />
        <div className="ghead__brush ghead__brush--1" data-depth="0.6" aria-hidden="true"><Brush variant={0} /></div>
        <div className="ghead__brush ghead__brush--2" data-depth="0.9" aria-hidden="true"><Brush variant={2} /></div>
        <div className="wrap ghead__content">
          <p className="ghead__eyebrow" data-intro="0.15">{t.gallery.eyebrow}</p>
          <h1 className="mask-title ghead__title" data-split="intro">
            <span className="ml"><span className="ml__i">{t.gallery.title}</span></span>
          </h1>
          <span className="ghead__rule" data-intro="0.6" />
          <p className="ghead__lead" data-intro="0.75">{t.gallery.lead}</p>
        </div>
      </section>

      <Gallery
        items={gallery}
        lang={lang}
        labels={{
          all: t.gallery.all,
          fullscreen: t.gallery.fullscreen,
          view: t.gallery.view,
          close: t.gallery.close,
          prev: t.gallery.prev,
          next: t.gallery.next,
          more: t.gallery.more,
          placeholder: t.common.placeholder,
          video: t.common.video,
        }}
      />

      <BookingCta lang={lang} t={t} title={t.gallery.ctaTitle} body={t.gallery.ctaBody} />
    </PageFx>
  )
}
