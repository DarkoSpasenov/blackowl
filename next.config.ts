import type { NextConfig } from 'next'

/**
 * Fully static site (no Node.js server needed): `npm run build` writes plain
 * HTML/CSS/JS to /out, ready for GitHub Pages or any static host.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  images: {
    // No image server on static hosting: export photos as WebP/AVIF yourself
    // (see README). Lazy loading and fixed proportions still apply.
    unoptimized: true,
  },
  poweredByHeader: false,
}

export default nextConfig
