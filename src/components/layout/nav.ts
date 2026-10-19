/** Толгой ба хөлийн цэс: нүүрний хэсгүүд рүү шилжинэ (дотоод хуудаснаас ч ажиллана) */
export const NAV = [
  { href: '/#services', label: 'Үйлчилгээ' },
  { href: '/#prices', label: 'Үнэ' },
  { href: '/#works', label: 'Ажлын үр дүн' },
  { href: '/#contact', label: 'Холбоо барих' },
];

export const LEGAL_LINKS = [
  { href: '/privacy', label: 'Нууцлалын бодлого' },
  { href: '/terms', label: 'Үйлчилгээний нөхцөл' },
];

/** Сошиал хуудсууд; холбоос хоосон бол хөлд харагдахгүй. */
export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/forexideamongolia' },
  { label: 'Instagram', href: '' },
  { label: 'Messenger', href: '' },
].filter((link) => link.href);

export const BUILDER = { label: 'Chameleon', href: 'https://www.chameleon.mn/' };
