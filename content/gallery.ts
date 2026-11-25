/**
 * THE portfolio — one single gallery, no categories, no filters.
 *
 * Only the studio's real, unedited work belongs here.
 * Add items in the order they should appear (newest first works well).
 *
 * Image:  { type: 'image', src: '/gallery/01.jpg', width: 1080, height: 1350, alt: {...} }
 * Video:  { type: 'video', src: '/gallery/02.mp4', poster: '/gallery/02.jpg', width: 1080, height: 1920, alt: {...} }
 *
 * `width` / `height` must be the real pixel size (keeps the masonry proportions).
 * While `src` is null, a labelled placeholder is shown.
 */
export type GalleryItem = {
  id: string
  type: 'image' | 'video'
  src: string | null
  poster?: string | null
  width: number
  height: number
  alt: { mk: string; en: string }
}

const ratios: [number, number][] = [
  [1080, 1350], [1080, 1080], [1080, 1350], [1080, 1440], [1350, 1080],
  [1080, 1620], [1080, 1350], [1080, 1080], [1080, 1920], [1080, 1350],
  [1440, 1080], [1080, 1350], [1080, 1440], [1080, 1080], [1080, 1350],
  [1080, 1620], [1350, 1080], [1080, 1350],
]

export const gallery: GalleryItem[] = ratios.map(([width, height], i) => ({
  id: String(i + 1).padStart(2, '0'),
  // Item 09 shows how a video slot looks (vertical 9:16 reel).
  type: i === 8 ? 'video' : 'image',
  src: null,
  poster: null,
  width,
  height,
  alt: {
    mk: `Тетоважа ${String(i + 1).padStart(2, '0')} — Black Owl Tattoo Studio`,
    en: `Tattoo ${String(i + 1).padStart(2, '0')} — Black Owl Tattoo Studio`,
  },
}))
