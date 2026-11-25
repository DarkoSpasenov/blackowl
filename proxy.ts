import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, hasLocale, type Locale } from './lib/i18n'

/** Redirects paths without a language prefix to /mk or /en (Accept-Language). */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]
  if (first && hasLocale(first)) return

  const accept = request.headers.get('accept-language') || ''
  const prefersEn = /^en\b/i.test(accept.trim()) && !/\bmk\b/i.test(accept)
  const locale: Locale = request.cookies.get('lang')?.value === 'en' || prefersEn ? 'en' : defaultLocale
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next|brand|images|gallery-media|icon|favicon|robots.txt|sitemap.xml|.*\\..*).*)'],
}
