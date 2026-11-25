export const locales = ['mk', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'mk'

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

export const routes = {
  home: '',
  about: '/about',
  gallery: '/gallery',
  contact: '/contact',
} as const
export type RouteKey = keyof typeof routes

export const href = (lang: Locale, route: RouteKey, hash = '') => `/${lang}${routes[route]}${hash}`

/** Swap the language segment of a pathname, keeping the current page. */
export const switchLocalePath = (pathname: string, to: Locale) => {
  const parts = pathname.split('/')
  if (parts[1] && hasLocale(parts[1])) parts[1] = to
  else parts.splice(1, 0, to)
  return parts.join('/') || `/${to}`
}

const mk = {
  meta: {
    title: 'Black Owl Tattoo Studio — Струмица',
    description:
      'Black Owl Tattoo Studio — тетоважно студио во Струмица, Македонија. Реалистични и уникатни тетоважи. Закажи термин.',
    about: 'За нас — студиото и уметниците на Black Owl Tattoo Studio во Струмица.',
    gallery: 'Галерија — работи на Black Owl Tattoo Studio, Струмица.',
    contact: 'Контакт и закажување термин — Black Owl Tattoo Studio, 4-ти Јули, Струмица.',
  },
  nav: {
    home: 'Почетна',
    about: 'За нас',
    gallery: 'Галерија',
    contact: 'Контакт',
    book: 'Закажи термин',
    menu: 'Мени',
    close: 'Затвори',
    skip: 'Прескокни до содржината',
    language: 'Јазик',
    primary: 'Главна навигација',
  },
  common: {
    placeholder: 'Привремена фотографија',
    placeholderText: 'Привремен текст — да се дополни',
    est: 'Основано',
    scroll: 'Скрол',
    instagram: 'Инстаграм',
    phone: 'Телефон',
    address: 'Адреса',
    openMaps: 'Отвори во Google Maps',
    rights: 'Сите права задржани.',
    video: 'Видео',
  },
  home: {
    location: 'Струмица, Македонија',
    lead: 'Професионално тетоважно студио специјализирано за реалистични и уникатни дизајни.',
    works: 'Погледни ги работите',
    studioEyebrow: 'Студиото',
    studioTitle: 'Мастило.\nСветлина.\nТрпение.',
    studioBody:
      'Black Owl е тетоважно студио во Струмица, со отворени врати од 1 март 2020. Простор каде идејата добива форма, а секоја линија се црта за една личност.',
    studioFacts: [
      { k: 'Основано', v: '01.03.2020' },
      { k: 'Град', v: 'Струмица' },
      { k: 'Уметници', v: '02' },
    ],
    studioLink: 'Повеќе за студиото',
    worksEyebrow: 'Галерија',
    worksTitle: 'Избрани работи',
    worksLink: 'Целата галерија',
    prev: 'Претходна',
    next: 'Следна',
    ctaEyebrow: 'Закажување',
    ctaTitle: 'Твојата идеја,\nнашата игла.',
    ctaBody: 'Опиши ја идејата, приложи референци и ќе те контактираме за слободен термин.',
  },
  about: {
    eyebrow: 'За нас',
    title: 'Ноќна птица.\nБудно око.',
    intro:
      'Бувот гледа таму каде другите не гледаат. Black Owl е студио каде тетоважата се третира како уметничко дело — нацртано со внимание, изведено со мир и создадено да трае.',
    storyEyebrow: 'Приказна',
    storyTitle: 'Од 2020 година\nво Струмица.',
    timeline: [
      { date: '01.03.2020', text: 'Black Owl Tattoo Studio ги отвора вратите на улица 4-ти Јули во Струмица.' },
      { date: 'Денес', text: 'Два уметника, едно студио — @gocemicev и @k_dimitrieva.' },
    ],
    atelierEyebrow: 'Во студиото',
    atelierWord: 'ФОКУС',
    atelierLines: ['Мир.', 'Фокус.', 'Линија по линија.'],
    artistsEyebrow: 'Уметниците',
    artistsTitle: 'Две раце.\nДва ракописа.',
    bio: 'Биографија',
    approach: 'Пристап',
    viewInstagram: 'Профил на Инстаграм',
    ctaTitle: 'Подготвен/а за\nследната тетоважа?',
  },
  gallery: {
    eyebrow: 'Галерија',
    title: 'Наши работи',
    lead: 'Реалистични, детални и уникатни тетоважи.',
    all: 'Сите тетоважи',
    fullscreen: 'Отвори во цел екран',
    open: 'Отвори',
    view: 'Види',
    close: 'Затвори',
    prev: 'Претходна',
    next: 'Следна',
    loading: 'Се вчитува…',
    more: 'Уште работи',
    ctaTitle: 'Ти се допаѓа\nнекоја работа?',
    ctaBody: 'Испрати ни ја идејата и референците.',
  },
  contact: {
    eyebrow: 'Контакт',
    title: 'Да\nзапочнеме.',
    lead: 'Јави се, пиши ни на Инстаграм или испрати барање за термин преку формуларот.',
    visit: 'Посети нè',
    call: 'Јави се',
    follow: 'Следи нè',
    hoursSoon: 'Работното време ќе биде објавено наскоро. Јави се за термин.',
    formEyebrow: 'Барање за термин',
    formTitle: 'Закажи\nтермин',
    mapTitle: 'Локација на Black Owl Tattoo Studio на мапа',
  },
  form: {
    name: 'Име и презиме',
    phone: 'Телефон',
    email: 'Е-пошта',
    description: 'Опис на тетоважата',
    descriptionHint: 'Мотив, стил, значење, дали е прекривање…',
    placement: 'Место на телото',
    placementHint: 'пр. подлактица, рамо, грб',
    size: 'Приближна големина',
    sizeHint: 'пр. 10 × 15 cm',
    date: 'Посакуван датум',
    references: 'Референтни слики',
    referencesHint: 'Повлечи слики овде или кликни за избор (до 5)',
    remove: 'Отстрани',
    consent: 'Се согласувам моите податоци да се користат само за одговор на ова барање.',
    required: 'задолжително',
    optional: 'опционално',
    submit: 'Испрати барање',
    sending: 'Се испраќа…',
    successTitle: 'Барањето е испратено.',
    successBody: 'Ви благодариме. Ќе ве контактираме наскоро за да го договориме терминот.',
    again: 'Ново барање',
    errorGeneric: 'Испраќањето не успеа. Обидете се повторно или јавете се на телефон.',
    errorConfig: 'Формуларот сè уште не е поврзан. Ве молиме јавете се на телефон или пишете на Инстаграм.',
    errorRate: 'Премногу обиди. Обидете се повторно за неколку минути.',
    errors: {
      name: 'Внесете име и презиме.',
      phone: 'Внесете валиден телефонски број.',
      email: 'Внесете валидна е-пошта.',
      description: 'Опишете ја тетоважата (најмалку 10 знаци).',
      consent: 'Потребна е согласност.',
      files: 'Дозволени се до 5 слики (JPG, PNG, WebP).',
    },
  },
  notFound: {
    title: 'Страницата не постои.',
    back: 'Назад на почетна',
  },
}

export type Dictionary = typeof mk

const en: Dictionary = {
  meta: {
    title: 'Black Owl Tattoo Studio — Strumica',
    description:
      'Black Owl Tattoo Studio — tattoo studio in Strumica, North Macedonia. Realistic, one-of-a-kind tattoos. Book an appointment.',
    about: 'About — the studio and artists of Black Owl Tattoo Studio in Strumica.',
    gallery: 'Gallery — work by Black Owl Tattoo Studio, Strumica.',
    contact: 'Contact & booking — Black Owl Tattoo Studio, 4-ti Juli St., Strumica.',
  },
  nav: {
    home: 'Home',
    about: 'About',
    gallery: 'Gallery',
    contact: 'Contact',
    book: 'Book a session',
    menu: 'Menu',
    close: 'Close',
    skip: 'Skip to content',
    language: 'Language',
    primary: 'Main navigation',
  },
  common: {
    placeholder: 'Placeholder photo',
    placeholderText: 'Placeholder text — to be completed',
    est: 'Est.',
    scroll: 'Scroll',
    instagram: 'Instagram',
    phone: 'Phone',
    address: 'Address',
    openMaps: 'Open in Google Maps',
    rights: 'All rights reserved.',
    video: 'Video',
  },
  home: {
    location: 'Strumica, Macedonia',
    lead: 'A professional tattoo studio specialising in realistic, one-of-a-kind designs.',
    works: 'See the work',
    studioEyebrow: 'The studio',
    studioTitle: 'Ink.\nLight.\nPatience.',
    studioBody:
      'Black Owl is a tattoo studio in Strumica, open since 1 March 2020. A place where ideas take shape, and every line is drawn for one person.',
    studioFacts: [
      { k: 'Founded', v: '01.03.2020' },
      { k: 'City', v: 'Strumica' },
      { k: 'Artists', v: '02' },
    ],
    studioLink: 'More about the studio',
    worksEyebrow: 'Gallery',
    worksTitle: 'Selected work',
    worksLink: 'Full gallery',
    prev: 'Previous',
    next: 'Next',
    ctaEyebrow: 'Booking',
    ctaTitle: 'Your idea,\nour needle.',
    ctaBody: 'Describe your idea, attach references, and we will get back to you with an available date.',
  },
  about: {
    eyebrow: 'About',
    title: 'Night bird.\nWatchful eye.',
    intro:
      'The owl sees where others don’t. Black Owl is a studio where a tattoo is treated as a work of art — drawn with care, made with calm, and created to last.',
    storyEyebrow: 'Story',
    storyTitle: 'In Strumica\nsince 2020.',
    timeline: [
      { date: '01.03.2020', text: 'Black Owl Tattoo Studio opens its doors on 4-ti Juli Street in Strumica.' },
      { date: 'Today', text: 'Two artists, one studio — @gocemicev and @k_dimitrieva.' },
    ],
    atelierEyebrow: 'In the studio',
    atelierWord: 'FOCUS',
    atelierLines: ['Calm.', 'Focus.', 'Line by line.'],
    artistsEyebrow: 'The artists',
    artistsTitle: 'Two hands.\nTwo signatures.',
    bio: 'Biography',
    approach: 'Approach',
    viewInstagram: 'Instagram profile',
    ctaTitle: 'Ready for\nyour next piece?',
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Our work',
    lead: 'Realistic, detailed, one-of-a-kind tattoos.',
    all: 'All tattoos',
    fullscreen: 'Open fullscreen',
    open: 'Open',
    view: 'View',
    close: 'Close',
    prev: 'Previous',
    next: 'Next',
    loading: 'Loading…',
    more: 'More work',
    ctaTitle: 'Like something\nyou see?',
    ctaBody: 'Send us your idea and references.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Let’s\nbegin.',
    lead: 'Call us, message us on Instagram, or send a booking request through the form.',
    visit: 'Visit',
    call: 'Call',
    follow: 'Follow',
    hoursSoon: 'Opening hours will be published soon. Call us to book.',
    formEyebrow: 'Booking request',
    formTitle: 'Book a\nsession',
    mapTitle: 'Black Owl Tattoo Studio location on the map',
  },
  form: {
    name: 'Full name',
    phone: 'Phone',
    email: 'Email',
    description: 'Tattoo description',
    descriptionHint: 'Subject, style, meaning, cover-up or not…',
    placement: 'Body placement',
    placementHint: 'e.g. forearm, shoulder, back',
    size: 'Approximate size',
    sizeHint: 'e.g. 10 × 15 cm',
    date: 'Preferred date',
    references: 'Reference images',
    referencesHint: 'Drop images here or click to choose (up to 5)',
    remove: 'Remove',
    consent: 'I agree that my data is used only to answer this request.',
    required: 'required',
    optional: 'optional',
    submit: 'Send request',
    sending: 'Sending…',
    successTitle: 'Request sent.',
    successBody: 'Thank you. We will contact you soon to arrange your session.',
    again: 'New request',
    errorGeneric: 'Sending failed. Please try again or give us a call.',
    errorConfig: 'The form is not connected yet. Please call us or message us on Instagram.',
    errorRate: 'Too many attempts. Please try again in a few minutes.',
    errors: {
      name: 'Please enter your full name.',
      phone: 'Please enter a valid phone number.',
      email: 'Please enter a valid email.',
      description: 'Please describe the tattoo (at least 10 characters).',
      consent: 'Consent is required.',
      files: 'Up to 5 images allowed (JPG, PNG, WebP).',
    },
  },
  notFound: {
    title: 'This page does not exist.',
    back: 'Back to home',
  },
}

const dictionaries: Record<Locale, Dictionary> = { mk, en }
export const getDictionary = (lang: Locale) => dictionaries[lang]

/** Split "\n"-separated titles into lines for mask reveals. */
export const lines = (s: string) => s.split('\n')
