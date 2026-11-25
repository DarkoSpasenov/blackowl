import type { MetadataRoute } from 'next'
import { siteUrl } from '@/content/site'
import { locales, routes } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes).flatMap((r) =>
    locales.map((l) => ({
      url: `${siteUrl}/${l}${r}`,
      changeFrequency: r === '/gallery' ? 'weekly' : 'monthly',
      priority: r === '' ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${siteUrl}/${x}${r}`])) },
    })),
  )
}
