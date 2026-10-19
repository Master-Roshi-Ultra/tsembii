/** Мөнгөн дүн: мөнгө (1/100 ₮). Хэмжээ: 1/10 нэгж (6.5 м² = 65). */

export const tugrikToMinor = (tugrik: number) => Math.round(tugrik * 100);

const tugrik = new Intl.NumberFormat('mn-MN', { maximumFractionDigits: 0 });

/** 2500000 → «25,000₮». Үнэгүй (null) үед «Үнэ тохирно»-г дуудагч талд харуулна — 0₮ биш. */
export const formatPrice = (minor: number) => `${tugrik.format(minor / 100)}₮`;

/** Мөрийн дүн (мөнгө). Үнэ тохирох бол null. */
export function lineAmount(unitPrice: number | null, tenths: number): number | null {
  return unitPrice === null ? null : Math.round((unitPrice * tenths) / 10);
}
