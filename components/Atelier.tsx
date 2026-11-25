'use client'
import { useLayoutEffect, useRef } from 'react'
import type { MediaItem } from '@/content/media'
import { gsap } from '@/lib/gsap'
import type { Locale } from '@/lib/i18n'
import { Media } from './ui'

/**
 * "In the studio" scene for the About page, built like a camera sequence.
 * Desktop: the section is pinned; the first photo opens from a slit, a giant
 * word slides behind it, the second photo rises over it while the first
 * recedes, and three short lines appear. Mobile: the same beats, unpinned.
 */
export default function Atelier({ a, b, lang, eyebrow, word, lines, label }: { a: MediaItem; b: MediaItem; lang: Locale; eyebrow: string; word: string; lines: string[]; label: string }) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const mm = gsap.matchMedia()
    mm.add(
      { desktop: '(min-width: 900px)', mobile: '(max-width: 899px)', motion: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        const { desktop, motion } = ctx.conditions as Record<string, boolean>
        if (!motion) return
        const q = gsap.utils.selector(el)
        if (desktop) {
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: el, start: 'top top', end: '+=220%', pin: true, scrub: 1 },
          })
          tl.fromTo(q('.atl__a'), { clipPath: 'inset(48% 0% 48% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
            .fromTo(q('.atl__a .media'), { scale: 1.35 }, { scale: 1.08, duration: 1.6 }, 0)
            .fromTo(q('.atl__word'), { xPercent: 30 }, { xPercent: -45, duration: 3 }, 0)
            .fromTo(q('.atl__eyebrow'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.3)
            .fromTo(q('.atl__b'), { yPercent: 70, clipPath: 'inset(100% 0% 0% 0%)' }, { yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2 }, 1)
            .fromTo(q('.atl__b .media'), { scale: 1.3 }, { scale: 1.06, duration: 1.6 }, 1)
            .to(q('.atl__a'), { xPercent: -42, scale: 0.92, duration: 1.2 }, 1)
          q('.atl__line').forEach((l, i) =>
            tl.fromTo(l.querySelector('.ml__i'), { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: 'power2.out' }, 1.6 + i * 0.35),
          )
          tl.to({}, { duration: 0.4 })
        } else {
          gsap.fromTo(q('.atl__word'), { xPercent: 10 }, { xPercent: -50, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
          q('.atl__frame').forEach((f) => {
            gsap.fromTo(f, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: f, start: 'top 85%', once: true } })
            gsap.fromTo(f.querySelector('.media'), { scale: 1.3, yPercent: -6 }, { scale: 1.08, yPercent: 6, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } })
          })
          q('.atl__line .ml__i').forEach((l) =>
            gsap.fromTo(l, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: l, start: 'top 92%', once: true } }),
          )
        }
      },
    )
    return () => mm.revert()
  }, [])

  return (
    <section className="atl" ref={root} aria-label={eyebrow}>
      <span className="atl__word" aria-hidden="true">{word}</span>
      <p className="eyebrow atl__eyebrow"><span className="eyebrow__n">02</span><span>{eyebrow}</span></p>
      <div className="atl__stage">
        <div className="atl__frame atl__a"><Media item={a} lang={lang} sizes="(max-width: 900px) 86vw, 34vw" label={label} /></div>
        <div className="atl__frame atl__b"><Media item={b} lang={lang} sizes="(max-width: 900px) 70vw, 28vw" label={label} /></div>
        <div className="atl__lines">
          {lines.map((l) => (
            <p className="atl__line" key={l}><span className="ml"><span className="ml__i">{l}</span></span></p>
          ))}
        </div>
      </div>
    </section>
  )
}
