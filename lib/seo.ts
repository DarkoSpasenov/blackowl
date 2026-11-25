import type { Metadata } from 'next'
import { site, siteUrl } from '@/content/site'
import { type Locale, type RouteKey, getDictionary, locales, routes } from './i18n'

export function pageMetadata(lang: Locale, route: RouteKey): Metadata {
  const t = getDictionary(lang)
  const titles: Record<RouteKey, string> = {
    home: t.meta.title,
    about: `${t.nav.about} — ${site.name}`,
    gallery: `${t.nav.gallery} — ${site.name}`,
    contact: `${t.nav.contact} — ${site.name}`,
  }
  const descriptions: Record<RouteKey, string> = {
    home: t.meta.description,
    about: t.meta.about,
    gallery: t.meta.gallery,
    contact: t.meta.contact,
  }
  const path = `/${lang}${routes[route]}`
  return {
    title: titles[route],
    description: descriptions[route],
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l === 'mk' ? 'mk-MK' : 'en', `${siteUrl}/${l}${routes[route]}`])),
        'x-default': `${siteUrl}/mk${routes[route]}`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: titles[route],
      description: descriptions[route],
      url: `${siteUrl}${path}`,
      locale: lang === 'mk' ? 'mk_MK' : 'en_US',
      alternateLocale: lang === 'mk' ? 'en_US' : 'mk_MK',
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: 'summary_large_image', title: titles[route], description: descriptions[route] },
    robots: { index: true, follow: true },
  }
}
