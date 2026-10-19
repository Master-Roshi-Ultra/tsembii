import type { Unit } from '@prisma/client';

/** Мөнгөн дүн: мөнгө (1/100 ₮). Хэмжээ: 1/10 нэгж (6.5 м² = 65). */

export const UNIT_LABELS: Record<Unit, string> = {
  SQM: 'м²',
  PIECE: 'ширхэг',
  SEAT: 'суудал',
};

/** м²-ийг 0.1 нарийвчлалтай, бусдыг бүхэл тоогоор авна. */
export const UNIT_STEP: Record<Unit, number> = { SQM: 1, PIECE: 10, SEAT: 10 };

export const tugrikToMinor = (tugrik: number) => Math.round(tugrik * 100);

const tugrik = new Intl.NumberFormat('mn-MN', { maximumFractionDigits: 0 });

/** 2500000 → «25,000₮»; үнэгүй бол «Үнэ тохирно» (0₮ гэж хэзээ ч харуулахгүй). */
export function formatPrice(minor: number | null): string {
  if (minor === null) return 'Үнэ тохирно';
  return `${tugrik.format(minor / 100)}₮`;
}

/** 65, SQM → «6.5 м²» */
export function formatQuantity(tenths: number, unit: Unit): string {
  return `${tenths / 10} ${UNIT_LABELS[unit]}`;
}

/** Мөрийн дүн (мөнгө). Үнэ тохирох бол null. */
export function lineAmount(unitPrice: number | null, tenths: number): number | null {
  return unitPrice === null ? null : Math.round((unitPrice * tenths) / 10);
}
