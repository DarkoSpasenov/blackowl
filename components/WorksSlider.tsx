'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { GalleryItem } from '@/content/gallery'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import type { Locale } from '@/lib/i18n'
import Image from 'next/image'
import { asset } from '@/lib/asset'

/** Cinematic single-frame slider of selected works (home page). */
export default function WorksSlider({ items, lang, labels }: { items: GalleryItem[]; lang: Locale; labels: { prev: string; next: string } }) {
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const dir = useRef(1)
  const stage = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const n = items.length

  const go = useCallback(
    (to: number, d?: number) => {
      if (busy.current || to === index) return
      dir.current = d ?? (to > index ? 1 : -1)
      setPrev(index)
      setIndex((to + n) % n)
    },
    [index, n],
  )

  useEffect(() => {
    if (prev === null) return
    const cur = stage.current?.querySelector<HTMLElement>(`[data-slide="${index}"]`)
    if (!cur) return
    if (prefersReducedMotion()) {
      setPrev(null)
      return
    }
    busy.current = true
    const from = dir.current > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)'
    const tl = gsap.timeline({ onComplete: () => { busy.current = false; setPrev(null) } })
    tl.fromTo(cur, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' })
      .fromTo(cur.firstElementChild, { scale: 1.25, xPercent: 8 * dir.current }, { scale: 1, xPercent: 0, duration: 1.6, ease: 'expo.out' }, 0.1)
    const old = stage.current?.querySelector<HTMLElement>(`[data-slide="${prev}"]`)
    if (old) tl.to(old.firstElementChild, { xPercent: -12 * dir.current, duration: 1.2, ease: 'expo.inOut' }, 0)
    return () => { tl.kill(); busy.current = false }
  }, [index, prev])

  // Touch / drag
  useEffect(() => {
    const el = stage.current!
    let x0: number | null = null
    const down = (e: PointerEvent) => { x0 = e.clientX }
    const up = (e: PointerEvent) => {
      if (x0 === null) return
      const dx = e.clientX - x0
      x0 = null
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', () => (x0 = null))
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointerup', up)
    }
  }, [go, index])

  return (
    <div
      className="slider"
      role="region"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1, 1)
        if (e.key === 'ArrowLeft') go(index - 1, -1)
      }}
    >
      <div className="slider__stage" ref={stage} data-cursor="⟷">
        {items.map((it, i) => (
          <div
            key={it.id}
            className={`slider__slide ${i === index ? 'is-current' : ''} ${i === prev ? 'is-prev' : ''}`}
            data-slide={i}
            aria-hidden={i !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${n}`}
          >
            <div className="slider__img">
              {/* Blurred copy fills the wide frame; the photo itself is shown whole, never cropped. */}
              <Image className="slider__bg" src={asset(it.src)!} alt="" fill sizes="40vw" aria-hidden="true" loading={i === 0 ? 'eager' : 'lazy'} />
              <Image className="slider__photo" src={asset(it.src)!} alt={it.alt[lang]} fill sizes="(max-width: 820px) 100vw, 60vw" loading={i === 0 ? 'eager' : 'lazy'} />
            </div>
          </div>
        ))}
      </div>
      <button className="slider__arrow slider__arrow--prev" onClick={() => go(index - 1, -1)} aria-label={labels.prev}>
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
      </button>
      <button className="slider__arrow slider__arrow--next" onClick={() => go(index + 1, 1)} aria-label={labels.next}>
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
      </button>
      <div className="slider__bars">
        {items.map((it, i) => (
          <button key={it.id} className={`slider__bar ${i === index ? 'is-active' : ''}`} onClick={() => go(i)} aria-label={`${i + 1} / ${n}`} aria-current={i === index} />
        ))}
      </div>
      <p className="slider__count" aria-live="polite">
        <span>{String(index + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
      </p>
    </div>
  )
}
