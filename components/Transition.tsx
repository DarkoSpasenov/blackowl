'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, forwardRef, useCallback, useContext, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

type Labels = Record<string, string>
type Ctx = { navigate: (href: string) => void }
const TransitionCtx = createContext<Ctx>({ navigate: () => {} })
export const usePageTransition = () => useContext(TransitionCtx)

const stripHash = (h: string) => h.split('#')[0].split('?')[0].replace(/\/$/, '') || '/'

export function TransitionProvider({ children, labels }: { children: React.ReactNode; labels: Labels }) {
  const router = useRouter()
  const pathname = usePathname()
  const veil = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const state = useRef<'idle' | 'covering' | 'covered'>('idle')
  const pending = useRef<string | null>(null)
  const safety = useRef<number | null>(null)

  const labelFor = (href: string) => {
    const seg = stripHash(href).split('/')[2] || 'home'
    return labels[seg] ?? ''
  }

  const uncover = useCallback(() => {
    const v = veil.current
    if (!v) return
    if (safety.current) window.clearTimeout(safety.current)
    const lenis = (window as any).__lenis
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    const hash = pending.current?.split('#')[1]
    pending.current = null
    gsap.set('main', { clearProps: 'transform,opacity' })
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      window.dispatchEvent(new Event('bo:enter'))
      ;(window as any).__boVeil = false
      const tl = gsap.timeline({
        onComplete: () => {
          state.current = 'idle'
          gsap.set(v, { visibility: 'hidden' })
          if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
        },
      })
      tl.to(label.current, { autoAlpha: 0, y: -20, duration: 0.35, ease: 'power2.in' })
        .to('.veil__panel', { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, 0.05)
        .to('.veil__edge', { yPercent: -100, scaleY: 0.4, duration: 0.95, ease: 'expo.inOut' }, 0.02)
    })
  }, [])

  const navigate = useCallback(
    (to: string) => {
      const target = stripHash(to)
      if (target === stripHash(pathname)) {
        const hash = to.split('#')[1]
        const lenis = (window as any).__lenis
        const el = hash ? document.getElementById(hash) : null
        if (lenis) lenis.scrollTo(el ?? 0)
        else (el ?? document.body).scrollIntoView({ behavior: 'smooth' })
        return
      }
      if (prefersReducedMotion() || state.current !== 'idle') {
        router.push(to)
        return
      }
      const v = veil.current!
      state.current = 'covering'
      pending.current = to
      ;(window as any).__boVeil = true
      router.prefetch(target)
      if (label.current) label.current.textContent = labelFor(to)
      gsap.set(v, { visibility: 'visible' })
      gsap.set('.veil__panel', { yPercent: 100 })
      gsap.set('.veil__edge', { yPercent: 100, scaleY: 1 })
      gsap.set(label.current, { autoAlpha: 0, y: 30 })
      const tl = gsap.timeline({
        onComplete: () => {
          state.current = 'covered'
          router.push(to, { scroll: false })
          // Never leave the veil down if the navigation stalls.
          safety.current = window.setTimeout(() => state.current === 'covered' && uncover(), 5000)
        },
      })
      tl.to('.veil__edge', { yPercent: 0, duration: 0.8, ease: 'expo.inOut' }, 0)
        .to('.veil__panel', { yPercent: 0, duration: 0.8, ease: 'expo.inOut' }, 0.06)
        .to('main', { y: -60, opacity: 0.4, duration: 0.8, ease: 'expo.inOut' }, 0)
        .to(label.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.5)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [pathname, router, uncover],
  )

  useEffect(() => {
    if (state.current === 'covered') uncover()
    else if (state.current === 'idle') {
      // Back/forward navigation: soft fade of the new page.
      if (!prefersReducedMotion()) gsap.fromTo('main', { opacity: 0 }, { opacity: 1, duration: 0.6, clearProps: 'opacity' })
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }, [pathname, uncover])

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div className="veil" ref={veil} aria-hidden="true">
        <div className="veil__edge" />
        <div className="veil__panel">
          <span className="veil__label" ref={label} />
        </div>
      </div>
    </TransitionCtx.Provider>
  )
}

type TLinkProps = React.ComponentProps<typeof Link> & { href: string }

/** Internal link that plays the cinematic veil transition. */
export const TLink = forwardRef<HTMLAnchorElement, TLinkProps>(function TLink({ href, onClick, ...rest }, ref) {
  const { navigate } = usePageTransition()
  return (
    <Link
      ref={ref}
      href={href}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || rest.target) return
        e.preventDefault()
        navigate(href)
      }}
      {...rest}
    />
  )
})
