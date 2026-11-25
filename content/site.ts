/**
 * Verified studio facts — the single source of truth.
 * Only put information here that the studio has confirmed.
 */
export const site = {
  name: 'Black Owl Tattoo Studio',
  shortName: 'Black Owl',
  founded: '2020-03-01',
  foundedDisplay: '01.03.2020',
  phone: '+389 72 681 388',
  phoneHref: 'tel:+38972681388',
  instagram: 'https://www.instagram.com/black_owl_tattoo_studio/',
  instagramHandle: '@black_owl_tattoo_studio',
  address: {
    street: { mk: '4-ти Јули', en: '4-ti Juli St.' },
    postalCode: '2400',
    city: { mk: 'Струмица', en: 'Strumica' },
    country: { mk: 'Македонија', en: 'North Macedonia' },
    countryCode: 'MK',
  },
  /**
   * Google Maps query for the embedded map. Replace with the studio's exact
   * Google Maps place link / coordinates once the pin has been verified.
   */
  mapsQuery: '4-ти Јули, 2400 Струмица, Македонија',
  /**
   * Opening hours — intentionally empty until confirmed by the studio.
   * Example once confirmed:
   * [{ days: { mk: 'Пон – Саб', en: 'Mon – Sat' }, hours: '10:00 – 20:00' }]
   */
  hours: null as null | { days: { mk: string; en: string }; hours: string }[],
  artists: [
    {
      handle: '@gocemicev',
      instagram: 'https://www.instagram.com/gocemicev/',
      /** Full name, bio and approach: add once provided by the artist. */
      name: null as null | string,
      bio: null as null | { mk: string; en: string },
      approach: null as null | { mk: string; en: string },
    },
    {
      handle: '@k_dimitrieva',
      instagram: 'https://www.instagram.com/k_dimitrieva/',
      name: null as null | string,
      bio: null as null | { mk: string; en: string },
      approach: null as null | { mk: string; en: string },
    },
  ],
}

/** Full public URL including any sub-folder, e.g. https://darkospasenov.github.io/blackowl */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
