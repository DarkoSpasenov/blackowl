'use client'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { site } from '@/content/site'
import { asset } from '@/lib/asset'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { type Dictionary, type Locale, href, locales, switchLocalePath } from '@/lib/i18n'
import { lockScroll, useLenis } from './SmoothScroll'
import { TLink, usePageTransition } from './Transition'
import { Arrow, Btn } from './ui'

const NAV = ['home', 'about', 'gallery', 'contact'] as const

export default function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  const pathname = usePathname()
  const lenis = useLenis()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)

  const active = (k: (typeof NAV)[number]) => {
    const target = href(lang, k)
    return k === 'home' ? pathname === target : pathname.startsWith(target)
  }

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 40)
      if (Math.abs(y - last) > 6) setHidden(y > last && y > 200)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    lockScroll(lenis, open)
    if (open) setHidden(false)
  }, [open, lenis])

  return (
    <>
      <a className="skip" href="#main">{t.nav.skip}</a>
      <header className={`hdr ${hidden && !open ? 'is-hidden' : ''} ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
        <TLink href={href(lang, 'home')} className="hdr__logo" aria-label={`${site.name} — ${t.nav.home}`} data-cursor="">
          <Image src={asset('/brand/logo.webp')!} alt="" width={96} height={96} priority />
        </TLink>

        <nav className="hdr__nav" aria-label={t.nav.primary}>
          <ul>
            {NAV.map((k) => (
              <li key={k}>
                <TLink href={href(lang, k)} className={`navlink ${active(k) ? 'is-active' : ''}`} aria-current={active(k) ? 'page' : undefined}>
                  <span className="navlink__t"><span>{t.nav[k]}</span></span>
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hdr__end">
          <LangSwitch lang={lang} label={t.nav.language} />
          <Btn href={href(lang, 'contact', '#booking')} variant="line" className="hdr__book">{t.nav.book}</Btn>
          <button
            className="burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </header>

      <MobileMenu open={open} lang={lang} t={t} active={active} onClose={() => setOpen(false)} />

      <TLink href={href(lang, 'contact', '#booking')} className="bookbar glow">
        <span>{t.nav.book}</span>
        <Arrow />
      </TLink>
    </>
  )
}

function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname()
  const { navigate } = usePageTransition()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: Event) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [])
  const names: Record<Locale, string> = { mk: 'Македонски', en: 'English' }
  return (
    <div className={`lang ${open ? 'is-open' : ''}`} ref={ref}>
      <button className="lang__btn" aria-haspopup="true" aria-expanded={open} aria-label={`${label}: ${names[lang]}`} onClick={() => setOpen((o) => !o)}>
        {lang.toUpperCase()}
        <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
      </button>
      <ul className="lang__list">
        {locales.map((l) => (
          <li key={l}>
            <a
              href={asset(switchLocalePath(pathname, l))!}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault()
                setOpen(false)
                if (l !== lang) navigate(switchLocalePath(pathname, l))
              }}
            >
              <b>{l.toUpperCase()}</b> {names[l]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MobileMenu({ open, lang, t, active, onClose }: { open: boolean; lang: Locale; t: Dictionary; active: (k: (typeof NAV)[number]) => boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  const pathname = usePathname()

  useEffect(() => {
    const el = root.current!
    if (first.current) {
      first.current = false
      return
    }
    const rm = prefersReducedMotion()
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(el, { visibility: 'visible' })
        const tl = gsap.timeline()
        tl.fromTo(el, { clipPath: 'circle(0% at calc(100% - 40px) 40px)' }, { clipPath: 'circle(150% at calc(100% - 40px) 40px)', duration: rm ? 0 : 0.9, ease: 'expo.inOut' })
          .fromTo('.mm__link .ml__i', { yPercent: 110 }, { yPercent: 0, duration: rm ? 0 : 0.9, stagger: 0.07, ease: 'expo.out' }, rm ? 0 : 0.35)
          .fromTo('.mm__foot > *', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: rm ? 0 : 0.6, stagger: 0.06 }, rm ? 0 : 0.6)
        el.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
      } else {
        gsap.to(el, { clipPath: 'circle(0% at calc(100% - 40px) 40px)', duration: rm ? 0 : 0.7, ease: 'expo.inOut', onComplete: () => { gsap.set(el, { visibility: 'hidden' }) } })
      }
    }, el)
    return () => ctx.kill()
  }, [open])

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [open, onClose])

  return (
    <div className="mm" id="mobile-menu" ref={root} role="dialog" aria-modal="true" aria-label={t.nav.menu} aria-hidden={!open} inert={!open}>
      <div className="mm__grain" />
      <nav className="mm__nav" aria-label={t.nav.primary}>
        {NAV.map((k, i) => (
          <TLink key={k} href={href(lang, k)} className={`mm__link ${active(k) ? 'is-active' : ''}`} onClick={() => active(k) && onClose()}>
            <span className="mm__n">0{i + 1}</span>
            <span className="ml"><span className="ml__i">{t.nav[k]}</span></span>
          </TLink>
        ))}
      </nav>
      <div className="mm__foot">
        <a href={site.phoneHref}>{site.phone}</a>
        <a href={site.instagram} target="_blank" rel="noopener noreferrer">{site.instagramHandle}</a>
        <div className="mm__langs">
          {locales.map((l) => (
            <TLink key={l} href={switchLocalePath(pathname, l)} hrefLang={l} className={l === lang ? 'is-active' : ''}>
              {l.toUpperCase()}
            </TLink>
          ))}
        </div>
      </div>
    </div>
  )
}
