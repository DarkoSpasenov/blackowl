import nodemailer from 'nodemailer'
import { site } from '@/content/site'

export const runtime = 'nodejs'

const MAX_FILES = 5
const MAX_FILE_BYTES = 4 * 1024 * 1024
const MAX_TOTAL_BYTES = 4 * 1024 * 1024 // keep below serverless body limits (e.g. Vercel 4.5 MB)
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Simple in-memory rate limit (per server instance): 5 requests / 10 min / IP.
const hits = new Map<string, number[]>()
const limited = (ip: string) => {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000)
  arr.push(now)
  hits.set(ip, arr)
  return arr.length > 5
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const str = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? '').trim().slice(0, max)

const json = (status: number, body: object) => Response.json(body, { status })

export async function POST(req: Request) {
  const to = process.env.BOOKING_TO_EMAIL
  const from = process.env.BOOKING_FROM_EMAIL
  const resendKey = process.env.RESEND_API_KEY
  const smtpHost = process.env.SMTP_HOST
  if (!to || !from || (!resendKey && !smtpHost)) {
    console.error('[booking] Email delivery is not configured (see .env.example)')
    return json(503, { error: 'not_configured' })
  }

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (limited(ip)) return json(429, { error: 'rate_limited' })

  let fd: FormData
  try {
    fd = await req.formData()
  } catch {
    return json(400, { error: 'bad_request' })
  }

  // Honeypot: pretend success for bots.
  if (str(fd, 'company', 200)) return json(200, { ok: true })

  const data = {
    name: str(fd, 'name', 120),
    phone: str(fd, 'phone', 40),
    email: str(fd, 'email', 160),
    description: str(fd, 'description', 3000),
    placement: str(fd, 'placement', 120),
    size: str(fd, 'size', 80),
    date: str(fd, 'date', 20),
    lang: str(fd, 'lang', 4) === 'en' ? 'en' : 'mk',
    consent: !!fd.get('consent'),
  }

  const errors: string[] = []
  if (data.name.length < 2) errors.push('name')
  if (!/^[+()\d\s-]{6,20}$/.test(data.phone)) errors.push('phone')
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('email')
  if (data.description.length < 10) errors.push('description')
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) errors.push('date')
  if (!data.consent) errors.push('consent')

  const files = fd.getAll('references').filter((f): f is File => f instanceof File && f.size > 0)
  let total = 0
  if (files.length > MAX_FILES) errors.push('files')
  for (const f of files) {
    total += f.size
    if (!IMAGE_TYPES.includes(f.type) || f.size > MAX_FILE_BYTES) errors.push('files')
  }
  if (total > MAX_TOTAL_BYTES) errors.push('files')
  if (errors.length) return json(422, { error: 'invalid', fields: [...new Set(errors)] })

  const attachments = await Promise.all(
    files.map(async (f, i) => ({
      filename: `reference-${i + 1}-${f.name.replace(/[^\w.-]+/g, '_').slice(-60)}`,
      content: Buffer.from(await f.arrayBuffer()),
      contentType: f.type,
    })),
  )

  const rows: [string, string][] = [
    ['Име / Name', data.name],
    ['Телефон / Phone', data.phone],
    ['Е-пошта / Email', data.email || '—'],
    ['Датум / Preferred date', data.date || '—'],
    ['Место / Placement', data.placement || '—'],
    ['Големина / Size', data.size || '—'],
    ['Јазик / Language', data.lang.toUpperCase()],
    ['Референци / References', String(files.length)],
  ]
  const subject = `Ново барање за термин — ${data.name}`
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nОпис / Description:\n${data.description}`
  const html = `
  <div style="font-family:Arial,sans-serif;background:#0b0b0b;color:#e8e5df;padding:28px">
    <h2 style="margin:0 0 18px;font-weight:400;letter-spacing:2px">BLACK OWL — ${esc(subject)}</h2>
    <table style="border-collapse:collapse;width:100%;max-width:640px">
      ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;color:#777;border-bottom:1px solid #222;white-space:nowrap">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #222">${esc(v)}</td></tr>`).join('')}
    </table>
    <h3 style="margin:22px 0 8px;font-weight:400;color:#e86b18">Опис / Description</h3>
    <p style="white-space:pre-wrap;line-height:1.6;max-width:640px">${esc(data.description)}</p>
    <p style="color:#777;font-size:12px;margin-top:24px">${esc(site.name)} · website booking form</p>
  </div>`

  try {
    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: to.split(',').map((s) => s.trim()),
          reply_to: data.email || undefined,
          subject,
          text,
          html,
          attachments: attachments.map((a) => ({ filename: a.filename, content: a.content.toString('base64') })),
        }),
      })
      if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
    } else {
      const port = Number(process.env.SMTP_PORT || 465)
      const transport = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      })
      await transport.sendMail({ from, to, replyTo: data.email || undefined, subject, text, html, attachments })
    }
  } catch (err) {
    console.error('[booking] delivery failed', err)
    return json(502, { error: 'delivery_failed' })
  }

  return json(200, { ok: true })
}
