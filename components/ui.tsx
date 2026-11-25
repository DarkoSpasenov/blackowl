'use client'
import Image from 'next/image'
import { useState } from 'react'
import type { MediaItem } from '@/content/media'
import type { Locale } from '@/lib/i18n'
import Magnetic from './Magnetic'
import { TLink } from './Transition'

export const Arrow = ({ dir = 'right' }: { dir?: 'right' | 'left' | 'down' | 'up-right' }) => {
  const rot = { right: 0, left: 180, down: 90, 'up-right': -45 }[dir]
  return (
    <svg className="ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

type BtnProps = {
  children: React.ReactNode
  href?: string
  external?: boolean
  variant?: 'solid' | 'ghost' | 'line'
  icon?: React.ReactNode
  arrow?: boolean
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  cursor?: string
}

/** Magnetic button with an orange light that follows the pointer. */
export function Btn({ children, href, external, variant = 'solid', icon, arrow = true, className = '', type = 'button', disabled, onClick, cursor }: BtnProps) {
  const cls = `btn glow btn--${variant} ${className}`
  const inner = (
    <span className="mag-inner">
      {icon}
      <span className="btn__text">{children}</span>
      {arrow && <Arrow />}
    </span>
  )
  let el: React.ReactElement
  if (href && external) el = <a className={cls} href={href} target="_blank" rel="noopener noreferrer" data-cursor={cursor}>{inner}</a>
  else if (href) el = <TLink className={cls} href={href} data-cursor={cursor}>{inner}</TLink>
  else el = <button className={cls} type={type} disabled={disabled} onClick={onClick} data-cursor={cursor}>{inner}</button>
  return <Magnetic>{el}</Magnetic>
}

/** Underlined text link with animated line. */
export function LineLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const inner = (
    <>
      <span className="line-link__text">{children}</span>
      <Arrow dir={external ? 'up-right' : 'right'} />
    </>
  )
  return external ? (
    <a className="line-link" href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <TLink className="line-link" href={href}>{inner}</TLink>
  )
}

/** Title whose lines are revealed through masks (animated by PageFx). */
export function MaskTitle({ lines, as: Tag = 'h2', className = '', intro, id }: { lines: string[]; as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; intro?: boolean; id?: string }) {
  return (
    <Tag id={id} className={`mask-title ${className}`} data-split={intro ? 'intro' : ''} aria-label={lines.join(' ')}>
      {lines.map((l, i) => (
        <span className="ml" key={i} aria-hidden="true">
          <span className="ml__i">{l}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Eyebrow({ children, n }: { children: React.ReactNode; n?: string }) {
  return (
    <p className="eyebrow" data-fade>
      {n && <span className="eyebrow__n">{n}</span>}
      <span>{children}</span>
    </p>
  )
}

/**
 * Photo or clearly labelled placeholder. Keeps the real proportions,
 * lazy-loads and fades in.
 */
export function Media({
  item,
  lang,
  sizes = '100vw',
  priority,
  fill,
  className = '',
  label,
}: {
  item: MediaItem
  lang: Locale
  sizes?: string
  priority?: boolean
  fill?: boolean
  className?: string
  label: string
}) {
  const [loaded, setLoaded] = useState(false)
  const style = fill ? undefined : { aspectRatio: `${item.width} / ${item.height}` }
  return (
    <div className={`media ${fill ? 'media--fill' : ''} ${loaded ? 'is-loaded' : ''} ${className}`} style={style}>
      {item.src ? (
        <Image
          src={item.src}
          alt={item.alt[lang]}
          fill
          sizes={sizes}
          priority={priority}
          quality={82}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <Placeholder brief={item.brief} label={label} ratio={`${item.width}×${item.height}`} alt={item.alt[lang]} />
      )}
    </div>
  )
}

export function Placeholder({ brief, label, ratio, alt }: { brief: string; label: string; ratio?: string; alt?: string }) {
  return (
    <div className="ph" role="img" aria-label={`${label}: ${alt ?? brief}`} data-placeholder>
      <span className="ph__corner ph__corner--tl" />
      <span className="ph__corner ph__corner--br" />
      <span className="ph__tag">{label}</span>
      <span className="ph__brief">{brief}</span>
      {ratio && <span className="ph__ratio">{ratio}</span>}
    </div>
  )
}

/** Orange dry-brush stroke (pure SVG, no image). */
export function Brush({ className = '', variant = 0, depth }: { className?: string; variant?: 0 | 1 | 2; depth?: number }) {
  const paths = [
    'M2 52 C60 30 160 14 300 12 C380 11 450 18 520 30 C540 34 556 42 560 50 C500 46 420 44 330 48 C220 54 110 66 30 76 C12 78 0 66 2 52Z',
    'M4 40 C90 22 200 18 320 26 C400 31 470 40 552 60 C470 62 400 58 320 60 C220 62 120 70 40 82 C14 86 -2 58 4 40Z',
    'M0 46 C70 34 150 26 250 26 C340 26 420 36 500 52 C520 56 540 62 548 70 C460 68 380 64 290 66 C190 68 100 74 24 70 C6 68 -4 56 0 46Z',
  ]
  return (
    <svg className={`brush ${className}`} viewBox="0 0 560 100" preserveAspectRatio="none" aria-hidden="true" data-depth={depth}>
      <defs>
        <filter id={`dry${variant}`} x="-5%" y="-30%" width="110%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.32" numOctaves="4" seed={variant * 11 + 3} result="streak" />
          <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 1.75" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="dry" />
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed={variant + 5} result="warp" />
          <feDisplacementMap in="dry" in2="warp" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path d={paths[variant]} fill="currentColor" filter={`url(#dry${variant})`} />
    </svg>
  )
}

export { TLink }
