/** Толгой ба хөлийн цэс: нүүрний хэсгүүд рүү шилжинэ (дотоод хуудаснаас ч ажиллана). Нэр нь `t.nav[key]`. */
export const NAV = [
  { href: '/#services', key: 'services' },
  { href: '/#prices', key: 'prices' },
  { href: '/#works', key: 'works' },
  { href: '/#contact', key: 'contact' },
] as const;

/** Нэр нь `t.legal[key].title` */
export const LEGAL_LINKS = [
  { href: '/privacy', key: 'privacy' },
  { href: '/terms', key: 'terms' },
] as const;

/** Сошиал хуудсууд; холбоос хоосон бол хөлд харагдахгүй. */
export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/forexideamongolia' },
  { label: 'Instagram', href: '' },
  { label: 'Messenger', href: '' },
].filter((link) => link.href);

export const BUILDER = { label: 'Chameleon', href: 'https://www.chameleon.mn/' };
