'use client'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, isFinePointer, isMobile, onPageReveal, prefersReducedMotion } from '@/lib/gsap'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * One animation engine for every page, driven by data attributes:
 *  data-split="intro" | ""   mask-revealed title lines (.ml__i)
 *  data-intro="0.4"          element revealed with the page intro (delay)
 *  data-fade                 fade-up on scroll
 *  data-img-reveal           clip-path "camera" reveal of an image block
 *  data-parallax="0.2"       vertical parallax of the element (scrubbed)
 *  data-drift="40"           horizontal drift of graphics (scrubbed)
 *  data-tilt-scope / data-depth="0.4" / data-tilt   pointer depth layers
 *  data-rule                 line drawing (scaleX)
 */
export default function PageFx({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    const el = root.current!
    if (prefersReducedMotion()) {
      el.classList.add('fx-off')
      return
    }
    const mobile = isMobile()
    let cancel = () => {}
    const offs: (() => void)[] = []
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el)
      // Initial hidden states (before first paint, no flash).
      gsap.set(q('[data-split] .ml__i'), { yPercent: 115, rotate: 3 })
      gsap.set(q('[data-intro]'), { autoAlpha: 0, y: 30 })
      gsap.set(q('[data-fade]'), { autoAlpha: 0, y: 40 })
      gsap.set(q('[data-rule]'), { scaleX: 0 })
      gsap.set(q('[data-img-reveal]'), { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(q('[data-img-reveal] > *'), { scale: 1.25 })

      cancel = onPageReveal(() =>
        ctx.add(() => {
          // Intro
          const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
          q('[data-split="intro"]').forEach((t, i) => {
            intro.to(t.querySelectorAll('.ml__i'), { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.09 }, i * 0.12)
          })
          q('[data-intro]').forEach((t) => {
            intro.to(t, { autoAlpha: 1, y: 0, duration: 1.2 }, parseFloat(t.getAttribute('data-intro') || '0.3'))
          })

          // Scroll reveals
          q('[data-split=""]').forEach((t) => {
            gsap.to(t.querySelectorAll('.ml__i'), {
              yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.1, ease: 'expo.out',
              scrollTrigger: { trigger: t, start: 'top 88%', once: true },
            })
          })
          ScrollTrigger.batch(q('[data-fade]'), {
            start: 'top 92%',
            once: true,
            onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out', overwrite: true }),
          })
          q('[data-rule]').forEach((t) =>
            gsap.to(t, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: t, start: 'top 92%', once: true } }),
          )
          q('[data-img-reveal]').forEach((t) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: t, start: 'top 85%', once: true } })
            tl.to(t, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
              .to(t.children, { scale: 1, duration: 2, ease: 'expo.out' }, 0.1)
          })

          // Camera-like parallax
          q('[data-parallax]').forEach((t) => {
            const s = parseFloat(t.getAttribute('data-parallax') || '0.15') * (mobile ? 0.5 : 1)
            gsap.fromTo(t, { yPercent: -s * 100 }, {
              yPercent: s * 100, ease: 'none',
              scrollTrigger: { trigger: t.parentElement || t, start: 'top bottom', end: 'bottom top', scrub: true },
            })
          })
          q('[data-drift]').forEach((t) => {
            const d = parseFloat(t.getAttribute('data-drift') || '40') * (mobile ? 0.5 : 1)
            gsap.fromTo(t, { x: -d }, {
              x: d, ease: 'none',
              scrollTrigger: { trigger: t.parentElement || t, start: 'top bottom', end: 'bottom top', scrub: 1 },
            })
          })
          ScrollTrigger.refresh()
        }),
      )

      // Pointer depth (desktop)
      if (isFinePointer()) {
        (q('[data-tilt-scope]') as HTMLElement[]).forEach((scope) => {
          const layers = Array.from(scope.querySelectorAll<HTMLElement>('[data-depth]')).map((l) => ({
            d: parseFloat(l.dataset.depth || '0.2'),
            x: gsap.quickTo(l, 'x', { duration: 1.2, ease: 'power3' }),
            y: gsap.quickTo(l, 'y', { duration: 1.2, ease: 'power3' }),
          }))
          const tilts = Array.from(scope.querySelectorAll<HTMLElement>('[data-tilt]')).map((l) => ({
            rx: gsap.quickTo(l, 'rotationX', { duration: 1.4, ease: 'power3' }),
            ry: gsap.quickTo(l, 'rotationY', { duration: 1.4, ease: 'power3' }),
          }))
          const move = (e: PointerEvent) => {
            const r = scope.getBoundingClientRect()
            const nx = (e.clientX - r.left) / r.width - 0.5
            const ny = (e.clientY - r.top) / r.height - 0.5
            layers.forEach((l) => { l.x(nx * l.d * 60); l.y(ny * l.d * 40) })
            tilts.forEach((t) => { t.rx(-ny * 4); t.ry(nx * 5) })
          }
          scope.addEventListener('pointermove', move)
          offs.push(() => scope.removeEventListener('pointermove', move))
        })
      }
    }, el)

    // Images loading late change layout: keep triggers accurate.
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      cancel()
      offs.forEach((f) => f())
      window.removeEventListener('load', onLoad)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={root} className={`page ${className}`}>
      {children}
    </div>
  )
}
