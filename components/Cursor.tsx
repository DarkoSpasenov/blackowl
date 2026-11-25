'use client'
import { useEffect, useRef } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/gsap'

/**
 * Discreet custom cursor (desktop only) + the orange light that follows the
 * pointer on buttons (`.glow`). Elements can set `data-cursor="Label"`.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Orange light on buttons works for every fine pointer, even with reduced motion.
    const glow = (e: PointerEvent) => {
      const t = (e.target as Element)?.closest?.('.glow') as HTMLElement | null
      if (!t) return
      const r = t.getBoundingClientRect()
      t.style.setProperty('--mx', `${e.clientX - r.left}px`)
      t.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', glow, { passive: true })
    if (!isFinePointer() || prefersReducedMotion()) return () => window.removeEventListener('pointermove', glow)

    document.documentElement.classList.add('has-cursor')
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })
    let shown = false
    let current: Element | null = null

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!shown) {
        shown = true
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })
      }
      xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY)
      const t = (e.target as Element)?.closest?.('a, button, [data-cursor], input, textarea, select, label') ?? null
      if (t === current) return
      current = t
      const text = t?.getAttribute('data-cursor') || ''
      const isField = !!t && t.matches('input, textarea, select')
      ring.current!.dataset.state = !t ? '' : text ? 'label' : isField ? 'field' : 'hover'
      label.current!.textContent = text
    }
    const leave = () => {
      shown = false
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 })
    }
    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 })
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.5)' })
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', glow)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ring}>
        <span ref={label} />
      </div>
      <div className="cursor__dot" ref={dot} />
    </div>
  )
}
