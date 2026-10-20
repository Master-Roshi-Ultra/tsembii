/** Мөнгөн дүн: мөнгө (1/100 ₮). Хэмжээ: 1/10 нэгж (6.5 м² = 65). */

export const tugrikToMinor = (tugrik: number) => Math.round(tugrik * 100);

const tugrik = new Intl.NumberFormat('mn-MN', { maximumFractionDigits: 0 });

/** 2500000 → «25,000₮». Үнэгүй (null) үед «Үнэ тохирно»-г дуудагч талд харуулна — 0₮ биш. */
export const formatPrice = (minor: number) => `${tugrik.format(minor / 100)}₮`;

/**
 * Урьдчилсан дүн: үнэтэй мөрүүдийн нийлбэр. Үнэтэй мөр байхгүй бол «Үнэ тохирно» (0₮ биш),
 * хэсэгчлэн байвал «25,000₮ + Үнэ тохирно».
 */
export function formatEstimate(amounts: readonly (number | null)[], onRequest: string): string {
  const priced = amounts.filter((amount): amount is number => amount !== null);
  if (!priced.length) return onRequest;
  const total = formatPrice(priced.reduce((sum, amount) => sum + amount, 0));
  return priced.length < amounts.length ? `${total} + ${onRequest}` : total;
}

/** Мөрийн дүн (мөнгө). Үнэ тохирох бол null. */
export function lineAmount(unitPrice: number | null, tenths: number): number | null {
  return unitPrice === null ? null : Math.round((unitPrice * tenths) / 10);
}

/** Админы оруулсан төгрөг («25,000», «25 000») → мөнгө. Хоосон бол null («Үнэ тохирно»). */
export function parseTugrik(input: string): number | null | undefined {
  const value = input.replace(/[\s,₮]/g, '');
  if (!value) return null;
  if (!/^\d{1,9}$/.test(value)) return undefined; // буруу оролт
  return tugrikToMinor(Number(value));
}
