'use client'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { GalleryItem } from '@/content/gallery'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import type { Locale } from '@/lib/i18n'
import { lockScroll, useLenis } from './SmoothScroll'
import { Placeholder } from './ui'

type Labels = {
  all: string
  fullscreen: string
  view: string
  close: string
  prev: string
  next: string
  more: string
  placeholder: string
  video: string
}

const BATCH = 12

function useColumns() {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      setCols(w < 700 ? 2 : w < 1600 ? 3 : 4)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return cols
}

/** The single studio gallery: masonry, progressive loading, fullscreen viewer. */
export default function Gallery({ items, lang, labels }: { items: GalleryItem[]; lang: Locale; labels: Labels }) {
  const cols = useColumns()
  const [count, setCount] = useState(Math.min(BATCH, items.length))
  const [open, setOpen] = useState<number | null>(null)
  const origin = useRef<HTMLElement | null>(null)
  const sentinel = useRef<HTMLDivElement>(null)
  const grid = useRef<HTMLDivElement>(null)

  // Balanced masonry: each item goes to the currently shortest column,
  // so proportions are kept and the reading order stays left → right.
  const columns = useMemo(() => {
    const c: { item: GalleryItem; index: number }[][] = Array.from({ length: cols }, () => [])
    const h = new Array(cols).fill(0)
    items.slice(0, count).forEach((item, index) => {
      const k = h.indexOf(Math.min(...h))
      c[k].push({ item, index })
      h[k] += item.height / item.width
    })
    return c
  }, [items, count, cols])

  // Progressive loading of further batches
  useEffect(() => {
    const el = sentinel.current
    if (!el || count >= items.length) return
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setCount((c) => Math.min(c + BATCH, items.length)), { rootMargin: '600px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [count, items.length])

  // Appearance on scroll
  useEffect(() => {
    const els = grid.current?.querySelectorAll<HTMLElement>('.gitem:not(.is-in)') ?? []
    if (prefersReducedMotion()) {
      els.forEach((e) => e.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [columns])

  const openAt = (i: number, el: HTMLElement | null) => {
    origin.current = el
    setOpen(i)
  }

  return (
    <>
      <div className="gbar wrap" data-fade>
        <p className="gbar__all">
          {labels.all} <span>{String(items.length).padStart(2, '0')}</span>
        </p>
        <span className="gbar__line" />
        <button className="gbar__fs" onClick={() => openAt(0, grid.current?.querySelector('.gitem') ?? null)} aria-label={labels.fullscreen}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      <div className="masonry wrap" ref={grid} style={{ ['--cols' as string]: cols }}>
        {columns.map((col, ci) => (
          <div className="masonry__col" key={ci}>
            {col.map(({ item, index }, ri) => (
              <button
                key={item.id}
                className={`gitem ${item.type === 'video' ? 'gitem--video' : ''}`}
                style={{ aspectRatio: `${item.width} / ${item.height}`, transitionDelay: `${(ci * 0.08 + (ri % 2) * 0.04).toFixed(2)}s` }}
                onClick={(e) => openAt(index, e.currentTarget)}
                aria-label={`${labels.view}: ${item.alt[lang]}`}
                data-cursor={labels.view}
                data-index={index}
              >
                <Thumb item={item} lang={lang} labels={labels} cols={cols} />
                {item.type === 'video' && (
                  <span className="gitem__play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                  </span>
                )}
                <span className="gitem__n" aria-hidden="true">{item.id}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {count < items.length && (
        <div ref={sentinel} className="gmore" aria-hidden="true">
          <span /> {labels.more}
        </div>
      )}

      {open !== null && (
        <Lightbox items={items} index={open} setIndex={setOpen} lang={lang} labels={labels} origin={origin} onClosed={() => setOpen(null)} />
      )}
    </>
  )
}

function Thumb({ item, lang, labels, cols }: { item: GalleryItem; lang: Locale; labels: Labels; cols: number }) {
  const [loaded, setLoaded] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const still = item.type === 'video' ? item.poster : item.src
  if (!still && !(item.type === 'video' && item.src)) {
    return <Placeholder label={labels.placeholder} brief={`WORK ${item.id}${item.type === 'video' ? ` · ${labels.video}` : ''}`} ratio={`${item.width}×${item.height}`} alt={item.alt[lang]} />
  }
  return (
    <span
      className={`gitem__media ${loaded ? 'is-loaded' : ''}`}
      onPointerEnter={() => video.current?.play().catch(() => {})}
      onPointerLeave={() => video.current?.pause()}
    >
      {still && (
        <Image src={still} alt={item.alt[lang]} fill sizes={`(max-width: 700px) 50vw, ${Math.round(100 / cols)}vw`} onLoad={() => setLoaded(true)} />
      )}
      {item.type === 'video' && item.src && (
        <video ref={video} src={item.src} muted loop playsInline preload="none" onLoadedData={() => setLoaded(true)} aria-hidden="true" />
      )}
    </span>
  )
}

function Lightbox({
  items,
  index,
  setIndex,
  lang,
  labels,
  origin,
  onClosed,
}: {
  items: GalleryItem[]
  index: number
  setIndex: (i: number) => void
  lang: Locale
  labels: Labels
  origin: React.RefObject<HTMLElement | null>
  onClosed: () => void
}) {
  const lenis = useLenis()
  const root = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)
  const dirRef = useRef(0)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const item = items[index]
  const n = items.length
  const rm = prefersReducedMotion()

  // Fit the media inside the viewport, keeping its proportions.
  const fit = useCallback(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const padX = vw < 700 ? 0 : 140
    const padY = vw < 700 ? 120 : 110
    const s = Math.min((vw - padX) / item.width, (vh - padY) / item.height)
    return { w: Math.round(item.width * s), h: Math.round(item.height * s) }
  }, [item])

  useEffect(() => {
    setSize(fit())
    const r = () => setSize(fit())
    window.addEventListener('resize', r)
    return () => window.removeEventListener('resize', r)
  }, [fit])

  // Open: grow from the clicked thumbnail
  useEffect(() => {
    lockScroll(lenis, true)
    const prevFocus = document.activeElement as HTMLElement | null
    closeBtn.current?.focus({ preventScroll: true })
    const o = origin.current?.getBoundingClientRect()
    const f = fit()
    const tl = gsap.timeline()
    tl.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: rm ? 0 : 0.5, ease: 'power2.out' })
    if (o && !rm) {
      const s = o.width / f.w
      tl.fromTo(
        box.current,
        { x: o.left + o.width / 2 - window.innerWidth / 2, y: o.top + o.height / 2 - window.innerHeight / 2, scale: s },
        { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'expo.out' },
        0,
      )
    }
    tl.fromTo('.lb__ui', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, rm ? 0 : 0.35)
    return () => {
      tl.kill()
      lockScroll(lenis, false)
      prevFocus?.focus?.({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    const thumb = document.querySelector<HTMLElement>(`.gitem[data-index="${index}"]`)
    const o = thumb?.getBoundingClientRect()
    const visible = o && o.bottom > 0 && o.top < window.innerHeight
    const tl = gsap.timeline({ onComplete: onClosed })
    tl.to('.lb__ui', { autoAlpha: 0, duration: rm ? 0 : 0.25 })
    if (visible && !rm) {
      const f = fit()
      tl.to(box.current, { x: o.left + o.width / 2 - window.innerWidth / 2, y: o.top + o.height / 2 - window.innerHeight / 2, scale: o.width / f.w, duration: 0.7, ease: 'expo.inOut' }, 0)
      tl.to(root.current, { backgroundColor: 'rgba(8,8,8,0)', duration: 0.6, ease: 'power2.inOut' }, 0.1)
      tl.set(root.current, { autoAlpha: 0 })
    } else tl.to(root.current, { autoAlpha: 0, duration: rm ? 0 : 0.4 }, 0)
  }, [fit, index, onClosed, rm])

  const go = useCallback(
    (d: number) => {
      dirRef.current = d
      setIndex((index + d + n) % n)
    },
    [index, n, setIndex],
  )

  // Slide animation on change
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (rm) return
    gsap.fromTo(box.current, { x: dirRef.current * 80, autoAlpha: 0, scale: 0.97 }, { x: 0, autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out' })
  }, [index, rm])

  // Keyboard
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        const f = root.current?.querySelectorAll<HTMLElement>('button, video[controls]')
        if (!f?.length) return
        const a = f[0]
        const b = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus() }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus() }
      }
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [close, go])

  // Touch: swipe left/right to navigate, down to close
  useEffect(() => {
    const el = root.current!
    let sx = 0, sy = 0, active = false
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      active = true; sx = e.clientX; sy = e.clientY
    }
    const move = (e: PointerEvent) => {
      if (!active) return
      const dx = e.clientX - sx, dy = e.clientY - sy
      if (Math.abs(dx) > Math.abs(dy)) gsap.set(box.current, { x: dx * 0.9 })
      else if (dy > 0) gsap.set(box.current, { y: dy * 0.8, scale: 1 - Math.min(dy / 1500, 0.15) })
    }
    const up = (e: PointerEvent) => {
      if (!active) return
      active = false
      const dx = e.clientX - sx, dy = e.clientY - sy
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
      else if (dy > 110) close()
      else gsap.to(box.current, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' })
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [close, go])

  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else root.current?.requestFullscreen?.().catch(() => {})
  }

  const neighbours = [items[(index + 1) % n], items[(index - 1 + n) % n]]

  return createPortal(
    <div
      className="lb"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt[lang]}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="lb__stage" onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="lb__box" ref={box} style={{ width: size.w || undefined, height: size.h || undefined }}>
          <LbMedia item={item} lang={lang} labels={labels} />
        </div>
      </div>

      <div className="lb__ui">
        <p className="lb__count" aria-live="polite">
          <span>{String(index + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
        </p>
        <div className="lb__tools">
          <button className="lb__btn" onClick={toggleFs} aria-label={labels.fullscreen}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
          <button className="lb__btn" ref={closeBtn} onClick={close} aria-label={labels.close}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </div>
        <button className="lb__nav lb__nav--prev" onClick={() => go(-1)} aria-label={labels.prev}>
          <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
        </button>
        <button className="lb__nav lb__nav--next" onClick={() => go(1)} aria-label={labels.next}>
          <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
        </button>
      </div>

      {/* Preload neighbours */}
      <div className="lb__preload" aria-hidden="true">
        {neighbours.map((it) =>
          it.type === 'image' && it.src ? <Image key={it.id} src={it.src} alt="" fill sizes="100vw" loading="eager" /> : null,
        )}
      </div>
    </div>,
    document.body,
  )
}

function LbMedia({ item, lang, labels }: { item: GalleryItem; lang: Locale; labels: Labels }) {
  if (item.type === 'video' && item.src)
    return <video key={item.id} src={item.src} poster={item.poster ?? undefined} controls autoPlay playsInline loop className="lb__video" />
  if (item.type === 'image' && item.src)
    return <Image key={item.id} src={item.src} alt={item.alt[lang]} fill sizes="100vw" quality={88} priority />
  return <Placeholder label={labels.placeholder} brief={`WORK ${item.id}${item.type === 'video' ? ` · ${labels.video}` : ''}`} ratio={`${item.width}×${item.height}`} alt={item.alt[lang]} />
}
