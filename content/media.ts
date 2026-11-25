/**
 * All site photography in one place.
 *
 * HOW TO REPLACE A PLACEHOLDER
 * 1. Put the real photo in /public/images/... (JPG/PNG/WebP/AVIF — Next.js
 *    automatically serves optimised AVIF/WebP versions).
 * 2. Set `src` to its public path (e.g. '/images/hero.jpg') and update
 *    `width`/`height` to the real pixel size so proportions are respected.
 *
 * While `src` is null, a clearly labelled placeholder is rendered instead.
 * Never use AI-generated or AI-modified tattoos here.
 */
export type MediaItem = {
  src: string | null
  width: number
  height: number
  alt: { mk: string; en: string }
  /** What the final photo should be (shown on the placeholder). */
  brief: string
}

const m = (
  width: number,
  height: number,
  brief: string,
  alt: { mk: string; en: string },
  src: string | null = null,
): MediaItem => ({ src, width, height, alt, brief })

export const media = {
  hero: m(2400, 1600, 'HERO · large artistic tattoo photograph, dark, landscape', {
    mk: 'Тетоважа на Black Owl Tattoo Studio',
    en: 'Tattoo by Black Owl Tattoo Studio',
  }),
  heroDetail: m(1200, 1500, 'HERO DETAIL · close-up of needle / hand at work', {
    mk: 'Детал од тетовирање',
    en: 'Tattooing detail',
  }),
  studioIntro: m(1400, 1750, 'STUDIO · artist tattooing, low light', {
    mk: 'Уметник тетовира во студиото',
    en: 'Artist tattooing in the studio',
  }),
  aboutHero: m(2400, 1400, 'ABOUT · wide shot of the studio interior', {
    mk: 'Ентериер на студиото Black Owl',
    en: 'Black Owl studio interior',
  }),
  interior1: m(1400, 1800, 'INTERIOR · workstation detail', {
    mk: 'Работно место во студиото',
    en: 'Studio workstation',
  }),
  interior2: m(1800, 1200, 'INTERIOR · waiting area / walls', {
    mk: 'Простор во студиото',
    en: 'Studio space',
  }),
  interior3: m(1200, 1200, 'INTERIOR · inks, machines, still life', {
    mk: 'Бои и машини за тетовирање',
    en: 'Inks and tattoo machines',
  }),
  artistGoce: m(1200, 1600, 'ARTIST · portrait of @gocemicev', {
    mk: 'Уметникот @gocemicev',
    en: 'Artist @gocemicev',
  }),
  artistGoceWork: m(1600, 1100, 'ARTIST · @gocemicev tattooing', {
    mk: '@gocemicev за време на тетовирање',
    en: '@gocemicev tattooing',
  }),
  artistK: m(1200, 1600, 'ARTIST · portrait of @k_dimitrieva', {
    mk: 'Уметницата @k_dimitrieva',
    en: 'Artist @k_dimitrieva',
  }),
  artistKWork: m(1600, 1100, 'ARTIST · @k_dimitrieva tattooing', {
    mk: '@k_dimitrieva за време на тетовирање',
    en: '@k_dimitrieva tattooing',
  }),
  galleryHero: m(1600, 1200, 'GALLERY HEADER · signature piece, dark background', {
    mk: 'Тетоважа од студиото',
    en: 'Tattoo from the studio',
  }),
  contactHero: m(2000, 1300, 'CONTACT · studio entrance / storefront', {
    mk: 'Влезот на студиото',
    en: 'Studio entrance',
  }),
} satisfies Record<string, MediaItem>

export type MediaKey = keyof typeof media
