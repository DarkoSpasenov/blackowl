/**
 * THE portfolio — one single gallery, no categories, no filters.
 *
 * Only the studio's real, unedited work belongs here (photos are cropped only,
 * colours and the studio watermark are untouched).
 *
 * Add an image:  { id: '17', type: 'image', src: '/images/gallery/17.webp', width: 1080, height: 1350, alt: {...} }
 * Add a video:   { id: '18', type: 'video', src: '/images/gallery/18.mp4', poster: '/images/gallery/18.webp', width: 1080, height: 1920, alt: {...} }
 *
 * `width` / `height` must be the real pixel size (keeps the masonry proportions).
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

const img = (id: string, width: number, height: number, mk: string, en: string): GalleryItem => ({
  id,
  type: 'image',
  src: `/images/gallery/${id}.webp`,
  width,
  height,
  alt: { mk: `${mk} — Black Owl Tattoo Studio`, en: `${en} — Black Owl Tattoo Studio` },
})

export const gallery: GalleryItem[] = [
  img('01', 1302, 1724, 'Христос со трнов венец, реалистична тетоважа на рака', 'Christ with a crown of thorns, realistic arm tattoo'),
  img('02', 1320, 1766, 'Тетоважа на нога со наградите од конвенција', 'Leg tattoo shown with its convention awards'),
  img('03', 707, 968, 'Портрети и цвеќиња на нога', 'Portraits and flowers on the leg'),
  img('04', 707, 957, 'Лав и воин на надлактица', 'Lion and warrior on the upper arm'),
  img('05', 707, 992, 'Портрет инспириран од „Кумот“ на рака', 'Godfather-inspired portrait on the arm'),
  img('06', 707, 999, 'Маски и натпис „Fear no one“ на подлактица', 'Masks and “Fear no one” lettering on the forearm'),
  img('07', 707, 1039, 'Самурај и пагода со црвени акценти', 'Samurai and pagoda with red accents'),
  img('08', 707, 994, 'Женски портрет на подлактица', 'Female portrait on the forearm'),
  img('09', 707, 964, 'Религиозен мотив, цел ракав', 'Religious full sleeve'),
  img('10', 707, 922, 'Тигар на подлактица', 'Tiger on the forearm'),
  img('11', 707, 905, 'Воин на листот од ногата', 'Warrior on the calf'),
  img('12', 707, 763, 'Око и волк на подлактица', 'Eye and wolf on the forearm'),
  img('13', 707, 729, 'Графички женски портрет со црвени детали', 'Graphic female portrait with red details'),
  img('14', 701, 719, 'Натпис на долниот дел од грбот', 'Lettering on the lower back'),
  img('15', 703, 747, 'Змија и божури на бутина', 'Snake and peonies on the thigh'),
  img('16', 707, 992, 'Портрет со превез и натпис „Hope“', 'Blindfolded portrait with “Hope” lettering'),
]

/** Works shown in the home-page film strip (ids from the list above). */
export const featured = ['04', '07', '10', '13', '05', '15', '12']
