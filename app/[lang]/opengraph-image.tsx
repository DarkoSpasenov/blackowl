import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Black Owl Tattoo Studio — Strumica'

export default async function OG() {
  const logo = await readFile(join(process.cwd(), 'public/brand/logo-placeholder.png'))
  const src = `data:image/png;base64,${logo.toString('base64')}`
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', background: '#080808', color: '#E8E5DF', padding: 80, gap: 60 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={300} height={300} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 120, letterSpacing: -2, lineHeight: 1 }}>BLACK OWL</div>
          <div style={{ fontSize: 34, letterSpacing: 22, color: '#777', marginTop: 20 }}>TATTOO STUDIO</div>
          <div style={{ width: 90, height: 3, background: '#E86B18', marginTop: 36 }} />
          <div style={{ fontSize: 28, marginTop: 28, color: '#E8E5DF' }}>Strumica · North Macedonia</div>
        </div>
      </div>
    ),
    size,
  )
}
