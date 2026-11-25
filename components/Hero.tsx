'use client'
import { useLayoutEffect, useRef } from 'react'
import { media } from '@/content/media'
import { gsap, isMobile, onPageReveal, prefersReducedMotion } from '@/lib/gsap'
import { type Dictionary, type Locale, href } from '@/lib/i18n'
import { Brush, Btn, Media } from './ui'

/**
 * Full-height opening scene. While scrolling, the photograph stays pinned,
 * pushes in like a camera dolly and darkens as the next section slides over it.
 */
export default function Hero({ lang, t }: { lang: Locale; t: Dictionary }) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true, pin: true, pinSpacing: false },
      })
      tl.to('.hero__img', { scale: 1.16, yPercent: 6, ease: 'none' }, 0)
        .to('.hero__dim', { opacity: 0.9, ease: 'none' }, 0)
        .to('.hero__content', { yPercent: -18, autoAlpha: 0, ease: 'none' }, 0)
        .to('.hero__brush--1', { xPercent: 20, ease: 'none' }, 0)
        .to('.hero__brush--2', { xPercent: -25, ease: 'none' }, 0)
        .to('.hero__scroll', { autoAlpha: 0, duration: 0.2, ease: 'none' }, 0)
      gsap.set('.hero__media', { scale: isMobile() ? 1.08 : 1.2, autoAlpha: 0.2 })
      gsap.set('.hero__brush > svg', { clipPath: 'inset(0% 100% 0% 0%)' })
    }, el)
    // Photo pushes back and brushes are painted once the page is revealed
    const cancel = onPageReveal(() =>
      ctx.add(() => {
        gsap.to('.hero__media', { scale: 1, autoAlpha: 1, duration: 2.6, ease: 'expo.out' })
        gsap.to('.hero__brush > svg', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, stagger: 0.18, ease: 'expo.inOut', delay: 0.5 })
      }),
    )
    return () => {
      cancel()
      ctx.revert()
    }
  }, [])

  return (
    <div className="hero-wrap">
    <section className="hero" ref={root} data-tilt-scope aria-label="Black Owl Tattoo Studio">
      <div className="hero__media" data-tilt>
        <div className="hero__img" data-depth="-0.12">
          <Media item={media.hero} lang={lang} fill priority label={t.common.placeholder} />
        </div>
      </div>
      <div className="hero__shade" />
      <div className="hero__dim" />
      <div className="hero__brushes" aria-hidden="true">
        <div className="hero__brush hero__brush--1" data-depth="0.5"><Brush variant={0} /></div>
        <div className="hero__brush hero__brush--2" data-depth="0.8"><Brush variant={1} /></div>
        <div className="hero__brush hero__brush--3" data-depth="0.3"><Brush variant={2} /></div>
      </div>

      <div className="hero__content wrap">
        <p className="hero__loc" data-intro="0.15">{t.home.location}</p>
        <h1 className="hero__title" aria-label="Black Owl Tattoo Studio" data-depth="0.08">
          <span className="hero__name" data-split="intro" aria-hidden="true">
            <span className="ml"><span className="ml__i">BLACK</span></span>{' '}
            <span className="ml"><span className="ml__i">OWL</span></span>
          </span>
          <span className="hero__sub" aria-hidden="true" data-intro="0.7">
            {'TATTOO STUDIO'.split('').map((c, i) => (
              <span key={i}>{c === ' ' ? ' ' : c}</span>
            ))}
          </span>
        </h1>
        <span className="hero__rule" data-intro="0.85" />
        <p className="hero__lead" data-intro="0.95">{t.home.lead}</p>
        <div className="hero__ctas" data-intro="1.1">
          <Btn href={href(lang, 'contact', '#booking')}>{t.nav.book}</Btn>
          <Btn
            href={href(lang, 'gallery')}
            variant="ghost"
            arrow={false}
            icon={
              <svg className="ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10 8.5v7l5.5-3.5z" fill="currentColor" />
              </svg>
            }
          >
            {t.home.works}
          </Btn>
        </div>
      </div>

      <div className="hero__scroll" data-intro="1.4" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span>{t.common.scroll}</span>
        <svg viewBox="0 0 12 16" width="10" height="14"><path d="M6 0v14M1 9l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
      </div>
    </section>
    </div>
  )
}
