/**
 * Site photography outside the gallery.
 *
 * To change a photo: put the file in /public/images/... (WebP or AVIF),
 * set `src` and the real `width` / `height` in pixels.
 * Never use AI-generated or AI-modified tattoos here.
 */
export type MediaItem = {
  src: string | null
  width: number
  height: number
  alt: { mk: string; en: string }
  /** What the photo should be (shown only on a placeholder when src is null). */
  brief: string
  /** CSS object-position used when the photo fills a frame of another shape. */
  focus?: string
}

export const media = {
  hero: {
    // Crop on the whole tattooed arm (no torso, no wall), from /images/hero.webp
    src: '/images/hero-tattoo.webp',
    width: 714,
    height: 1550,
    focus: '50% 40%',
    brief: 'HERO',
    alt: { mk: 'Христос со трнов венец — тетоважа од Black Owl Tattoo Studio', en: 'Christ with a crown of thorns — tattoo by Black Owl Tattoo Studio' },
  },
  workA: {
    src: '/images/studio/work-01.webp',
    width: 707,
    height: 947,
    focus: '50% 30%',
    brief: 'STUDIO',
    alt: { mk: 'Тетовирање во студиото Black Owl', en: 'Tattooing at the Black Owl studio' },
  },
  workB: {
    src: '/images/studio/work-02.webp',
    width: 707,
    height: 930,
    focus: '50% 35%',
    brief: 'STUDIO',
    alt: { mk: 'Уметник при работа во Black Owl', en: 'Artist at work at Black Owl' },
  },
  galleryHero: {
    src: '/images/gallery/10.webp',
    width: 707,
    height: 922,
    focus: '50% 40%',
    brief: 'GALLERY',
    alt: { mk: 'Тигар на подлактица — Black Owl Tattoo Studio', en: 'Tiger on the forearm — Black Owl Tattoo Studio' },
  },
  detail: {
    src: '/images/gallery/12.webp',
    width: 707,
    height: 763,
    focus: '50% 50%',
    brief: 'DETAIL',
    alt: { mk: 'Око и волк на подлактица — Black Owl Tattoo Studio', en: 'Eye and wolf on the forearm — Black Owl Tattoo Studio' },
  },
} satisfies Record<string, MediaItem>

export type MediaKey = keyof typeof media
