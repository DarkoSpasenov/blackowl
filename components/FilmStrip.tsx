'use client'
import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import type { GalleryItem } from '@/content/gallery'
import { asset } from '@/lib/asset'
import { gsap } from '@/lib/gsap'
import type { Locale } from '@/lib/i18n'
import { TLink } from './Transition'

/**
 * Home-page "film strip": on desktop the section is pinned and the works
 * travel horizontally like a camera dolly while scrolling; on phones it is a
 * native swipeable strip with snap points. Photos keep their real proportions.
 */
export default function FilmStrip({ items, lang, href, label }: { items: GalleryItem[]; lang: Locale; href: string; label: string }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const track = el.querySelector<HTMLElement>('.strip__track')!
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'center center',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      // Each photo drifts inside its frame: a second, slower plane.
      el.querySelectorAll<HTMLElement>('.strip__img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -6 }, {
          xPercent: 6, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        })
      })
      gsap.fromTo(el.querySelector('.strip__bar i'), { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'center center', end: () => `+=${distance()}`, scrub: true },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <div className="strip-wrap">
      <div className="strip" ref={root}>
        <div className="strip__track">
          {items.map((it, i) => (
            <TLink key={it.id} href={href} className="strip__item" style={{ aspectRatio: `${it.width} / ${it.height}` }} data-cursor={label} aria-label={`${label}: ${it.alt[lang]}`}>
              <span className="strip__frame">
                <span className="strip__img">
                  <Image src={asset(it.src)!} alt={it.alt[lang]} fill sizes="(max-width: 900px) 70vw, 32vw" loading="lazy" />
                </span>
              </span>
              <span className="strip__n">{String(i + 1).padStart(2, '0')}</span>
            </TLink>
          ))}
        </div>
        <div className="strip__bar" aria-hidden="true"><i /></div>
      </div>
    </div>
  )
}
