'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import type { Dictionary } from '@/lib/i18n'
import { Btn } from './ui'

type Ref = { id: string; file: File; url: string }
type Errors = Partial<Record<'name' | 'phone' | 'email' | 'description' | 'consent' | 'files', string>>

const MAX_FILES = 5
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp']

/** Downscale reference photos in the browser so uploads stay small and fast. */
async function compress(file: File): Promise<File> {
  if (!ACCEPT.includes(file.type) || file.size < 400_000) return file
  try {
    const bmp = await createImageBitmap(file)
    const max = 1600
    const s = Math.min(1, max / Math.max(bmp.width, bmp.height))
    const c = document.createElement('canvas')
    c.width = Math.round(bmp.width * s)
    c.height = Math.round(bmp.height * s)
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.82))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export default function BookingForm({ t, lang }: { t: Dictionary; lang: string }) {
  const [refs, setRefs] = useState<Ref[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [drag, setDrag] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)
  const today = new Date().toISOString().slice(0, 10)
  const f = t.form

  useEffect(() => () => refs.forEach((r) => URL.revokeObjectURL(r.url)), [refs])

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const incoming = Array.from(list).filter((x) => ACCEPT.includes(x.type))
    const bad = incoming.length !== list.length || refs.length + incoming.length > MAX_FILES
    setErrors((e) => ({ ...e, files: bad ? f.errors.files : undefined }))
    const next = incoming.slice(0, MAX_FILES - refs.length).map((file) => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file) }))
    setRefs((r) => [...r, ...next])
  }

  const validate = (fd: FormData): Errors => {
    const e: Errors = {}
    if (String(fd.get('name') || '').trim().length < 2) e.name = f.errors.name
    if (!/^[+()\d\s-]{6,20}$/.test(String(fd.get('phone') || '').trim())) e.phone = f.errors.phone
    const email = String(fd.get('email') || '').trim()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = f.errors.email
    if (String(fd.get('description') || '').trim().length < 10) e.description = f.errors.description
    if (!fd.get('consent')) e.consent = f.errors.consent
    return e
  }

  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const form = ev.currentTarget
    const fd = new FormData(form)
    const e = validate(fd)
    setErrors(e)
    if (Object.keys(e).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus()
      return
    }
    setStatus('sending')
    setMessage('')
    fd.delete('references')
    const files = await Promise.all(refs.map((r) => compress(r.file)))
    files.forEach((file) => fd.append('references', file))
    fd.set('lang', lang)
    try {
      const res = await fetch('/api/booking', { method: 'POST', body: fd })
      if (res.ok) {
        setStatus('sent')
        form.reset()
        setRefs([])
        requestAnimationFrame(() => {
          doneRef.current?.focus()
          if (!prefersReducedMotion()) gsap.fromTo(doneRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' })
        })
        return
      }
      setStatus('error')
      setMessage(res.status === 503 ? f.errorConfig : res.status === 429 ? f.errorRate : f.errorGeneric)
    } catch {
      setStatus('error')
      setMessage(f.errorGeneric)
    }
  }

  if (status === 'sent')
    return (
      <div className="form-done" ref={doneRef} tabIndex={-1} role="status">
        <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M14 25l7 7 13-15" fill="none" stroke="var(--orange)" strokeWidth="1.6" /></svg>
        <h3>{f.successTitle}</h3>
        <p>{f.successBody}</p>
        <Btn onClick={() => setStatus('idle')} variant="ghost">{f.again}</Btn>
      </div>
    )

  const field = (name: keyof Errors | 'placement' | 'size' | 'date', label: string, input: React.ReactNode, opts: { required?: boolean; hint?: string; wide?: boolean } = {}) => (
    <div className={`field ${opts.wide ? 'field--wide' : ''} ${errors[name as keyof Errors] ? 'has-error' : ''}`}>
      <label htmlFor={`f-${name}`}>
        {label} <em>{opts.required ? `· ${f.required}` : `· ${f.optional}`}</em>
      </label>
      {input}
      <span className="field__line" />
      {errors[name as keyof Errors] ? (
        <span className="field__err" id={`f-${name}-err`} role="alert">{errors[name as keyof Errors]}</span>
      ) : opts.hint ? (
        <span className="field__hint">{opts.hint}</span>
      ) : null}
    </div>
  )
  const aria = (name: keyof Errors) => ({ 'aria-invalid': !!errors[name] || undefined, 'aria-describedby': errors[name] ? `f-${name}-err` : undefined })

  return (
    <form className="form" ref={formRef} onSubmit={submit} noValidate aria-busy={status === 'sending'}>
      {/* Honeypot (bots fill it, humans never see it) */}
      <div className="hp" aria-hidden="true">
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {field('name', f.name, <input id="f-name" name="name" autoComplete="name" required {...aria('name')} />, { required: true })}
      {field('phone', f.phone, <input id="f-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required {...aria('phone')} />, { required: true })}
      {field('email', f.email, <input id="f-email" name="email" type="email" autoComplete="email" {...aria('email')} />)}
      {field('date', f.date, <input id="f-date" name="date" type="date" min={today} />)}
      {field(
        'description',
        f.description,
        <textarea id="f-description" name="description" rows={4} required maxLength={3000} placeholder={f.descriptionHint} {...aria('description')} />,
        { required: true, wide: true },
      )}
      {field('placement', f.placement, <input id="f-placement" name="placement" maxLength={120} placeholder={f.placementHint} />)}
      {field('size', f.size, <input id="f-size" name="size" maxLength={80} placeholder={f.sizeHint} />)}

      <div className={`field field--wide ${errors.files ? 'has-error' : ''}`}>
        <span className="field__label" id="f-ref-label">{f.references} <em>· {f.optional}</em></span>
        <label
          className={`drop ${drag ? 'is-drag' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
          data-cursor="+"
        >
          <input
            type="file"
            name="references"
            accept={ACCEPT.join(',')}
            multiple
            aria-labelledby="f-ref-label"
            onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
            disabled={refs.length >= MAX_FILES}
          />
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
          <span>{f.referencesHint}</span>
          <span className="drop__count">{refs.length} / {MAX_FILES}</span>
        </label>
        {errors.files && <span className="field__err" role="alert">{errors.files}</span>}
        {refs.length > 0 && (
          <ul className="thumbs">
            {refs.map((r) => (
              <li key={r.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.url} alt={r.file.name} />
                <button type="button" onClick={() => { URL.revokeObjectURL(r.url); setRefs((x) => x.filter((y) => y.id !== r.id)) }} aria-label={`${f.remove}: ${r.file.name}`}>×</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`check field--wide ${errors.consent ? 'has-error' : ''}`}>
        <input type="checkbox" id="f-consent" name="consent" value="yes" {...aria('consent')} />
        <label htmlFor="f-consent">{f.consent}</label>
        {errors.consent && <span className="field__err" id="f-consent-err" role="alert">{errors.consent}</span>}
      </div>

      <div className="form__end field--wide">
        <Btn type="submit" disabled={status === 'sending'}>{status === 'sending' ? f.sending : f.submit}</Btn>
        <p className="form__msg" role="status" aria-live="polite">{status === 'error' ? message : ''}</p>
      </div>
    </form>
  )
}
