'use client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  gsap.defaults({ ease: 'power3.out' })
}

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches

/**
 * Runs `cb` when the current page becomes visible:
 * after the intro preloader on first load, or when the page-transition veil
 * starts lifting on client-side navigation. Returns a cancel function.
 */
export const onPageReveal = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {}
  const w = window as any
  const evt = !w.__boReady ? 'bo:ready' : w.__boVeil ? 'bo:enter' : null
  if (!evt) {
    cb()
    return () => {}
  }
  let done = false
  const h = () => {
    if (done) return
    done = true
    cb()
  }
  window.addEventListener(evt, h, { once: true })
  return () => window.removeEventListener(evt, h)
}

export const ease = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  expo: 'expo.out',
  cine: 'expo.inOut',
}
