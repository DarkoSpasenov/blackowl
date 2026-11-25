'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'

const BLOTS = [
  { cx: 50, cy: 52, r: 78, d: 0 },
  { cx: 18, cy: 30, r: 46, d: 0.08 },
  { cx: 84, cy: 24, r: 44, d: 0.14 },
  { cx: 78, cy: 82, r: 50, d: 0.05 },
  { cx: 14, cy: 84, r: 42, d: 0.18 },
]

/**
 * Intro: the Black Owl logo appears, then the black screen is "eaten" by
 * spreading ink blots that reveal the page. Full version once per session,
 * a short ink reveal afterwards.
 */
export default function Preloader({ wordmark }: { wordmark: string }) {
  const root = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const el = root.current!
    const w = window as any
    const finish = () => {
      w.__boReady = true
      window.dispatchEvent(new Event('bo:ready'))
    }
    if (prefersReducedMotion()) {
      setDone(true)
      finish()
      return
    }
    let short = false
    try {
      short = sessionStorage.getItem('bo-intro') === '1'
      sessionStorage.setItem('bo-intro', '1')
    } catch {}

    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))])
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, onComplete: () => setDone(true) })
      if (!short) {
        tl.fromTo('.pre__logo', { autoAlpha: 0, scale: 0.86, filter: 'blur(14px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' })
          .fromTo('.pre__word span', { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: 'expo.out' }, 0.35)
          .fromTo('.pre__bar i', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.4)
          .to('.pre__mark', { autoAlpha: 0, y: -24, duration: 0.5, ease: 'power2.in' }, '+=0.15')
      } else {
        tl.set('.pre__mark', { autoAlpha: 0 })
      }
      tl.addLabel('ink', short ? 0 : '>-0.3')
      BLOTS.forEach((b, i) => {
        tl.fromTo(`.pre__blot-${i}`, { attr: { r: 0 } }, { attr: { r: b.r }, duration: short ? 0.9 : 1.25, ease: 'power3.inOut' }, `ink+=${b.d}`)
      })
      tl.call(finish, [], `ink+=${short ? 0.35 : 0.5}`)
      fonts.then(() => tl.play())
    }, el)
    return () => ctx.revert()
  }, [])

  if (done) return null
  return (
    <div className="pre" ref={root} id="preloader" aria-hidden="true">
      <svg className="pre__ink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="pre-ink" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <mask id="pre-mask" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140">
            <rect x="-20" y="-20" width="140" height="140" fill="white" />
            <g filter="url(#pre-ink)">
              {BLOTS.map((b, i) => (
                <circle key={i} className={`pre__blot-${i}`} cx={b.cx} cy={b.cy} r="0" fill="black" />
              ))}
            </g>
          </mask>
        </defs>
        <rect x="-20" y="-20" width="140" height="140" fill="#080808" mask="url(#pre-mask)" />
      </svg>
      <div className="pre__mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pre__logo" src="/brand/logo-placeholder.webp" alt="" width={140} height={140} />
        <div className="pre__word">
          {wordmark.split('').map((c, i) => (
            <span key={i}>{c === ' ' ? ' ' : c}</span>
          ))}
        </div>
        <div className="pre__bar"><i /></div>
      </div>
    </div>
  )
}
