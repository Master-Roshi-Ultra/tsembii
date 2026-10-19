/** Толгой ба хөлийн цэс: нүүрний хэсгүүд рүү шилжинэ */
export const NAV = [
  { href: '#services', label: 'Үйлчилгээ' },
  { href: '#prices', label: 'Үнэ' },
  { href: '#works', label: 'Ажлын үр дүн' },
  { href: '#contact', label: 'Холбоо барих' },
];

/** Сошиал хуудсууд; холбоос хоосон бол хөлд харагдахгүй. */
export const SOCIAL_LINKS = [
  { label: 'Facebook', href: '' },
  { label: 'Instagram', href: '' },
  { label: 'Messenger', href: '' },
].filter((link) => link.href);
