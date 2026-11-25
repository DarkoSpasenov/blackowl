'use client'
import Lenis from 'lenis'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

const LenisCtx = createContext<{ lenis: Lenis | null }>({ lenis: null })
export const useLenis = () => useContext(LenisCtx).lenis

/** Lock / unlock page scrolling (menu, lightbox) whether or not Lenis is active. */
export const lockScroll = (lenis: Lenis | null, locked: boolean) => {
  document.documentElement.classList.toggle('is-locked', locked)
  if (lenis) locked ? lenis.stop() : lenis.start()
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const raf = useRef<(t: number) => void>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const l = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
    l.on('scroll', ScrollTrigger.update)
    raf.current = (time: number) => l.raf(time * 1000)
    gsap.ticker.add(raf.current)
    gsap.ticker.lagSmoothing(0)
    ;(window as any).__lenis = l
    setLenis(l)
    return () => {
      if (raf.current) gsap.ticker.remove(raf.current)
      l.destroy()
      ;(window as any).__lenis = null
    }
  }, [])

  return <LenisCtx.Provider value={{ lenis }}>{children}</LenisCtx.Provider>
}
