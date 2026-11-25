import '@fontsource/oranienbaum/400.css'
import '@fontsource/cormorant/300.css'
import '@fontsource/cormorant/400.css'
import '@fontsource/cormorant/500.css'
import '@fontsource/cormorant/300-italic.css'
import '@fontsource/manrope/300.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import Cursor from '@/components/Cursor'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Preloader from '@/components/Preloader'
import SmoothScroll from '@/components/SmoothScroll'
import { TransitionProvider } from '@/components/Transition'
import { site, siteUrl } from '@/content/site'
import { getDictionary, hasLocale, locales } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

export const dynamicParams = false
export const generateStaticParams = () => locales.map((lang) => ({ lang }))

export const viewport: Viewport = {
  themeColor: '#080808',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return {
    metadataBase: new URL(siteUrl),
    applicationName: site.name,
    ...pageMetadata(lang, 'home'),
  }
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = getDictionary(lang)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    name: site.name,
    url: `${siteUrl}/${lang}`,
    image: `${siteUrl}/brand/logo.png`,
    telephone: site.phone,
    foundingDate: site.founded,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street[lang],
      postalCode: site.address.postalCode,
      addressLocality: site.address.city[lang],
      addressCountry: site.address.countryCode,
    },
    sameAs: [site.instagram],
  }

  return (
    <html lang={lang}>
      <head>
        <script
          // Flags for CSS before hydration: motion preference + custom cursor.
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('rm');`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <SmoothScroll>
          <TransitionProvider labels={{ home: t.nav.home, about: t.nav.about, gallery: t.nav.gallery, contact: t.nav.contact }}>
            <Preloader wordmark="BLACK OWL" />
            <Header lang={lang} t={t} />
            <main id="main" tabIndex={-1}>{children}</main>
            <Footer lang={lang} t={t} />
            <Cursor />
          </TransitionProvider>
        </SmoothScroll>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  )
}
