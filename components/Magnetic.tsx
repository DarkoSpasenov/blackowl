'use client'
import { cloneElement, isValidElement, useEffect, useRef } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/gsap'

/** Slight magnetic pull towards the pointer (desktop only). */
export default function Magnetic({ children, strength = 0.32 }: { children: React.ReactElement; strength?: number }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer() || prefersReducedMotion()) return
    const inner = el.querySelector<HTMLElement>('.mag-inner')
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const ix = inner ? gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3' }) : null
    const iy = inner ? gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3' }) : null
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      x(dx * strength); y(dy * strength)
      ix?.(dx * strength * 0.35); iy?.(dy * strength * 0.35)
    }
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  if (!isValidElement(children)) return children
  return cloneElement(children as React.ReactElement<any>, { ref })
}
