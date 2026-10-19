import type { Unit } from '@prisma/client';
import { lineAmount } from './money';

/** Сагсны мөр: хэмжээ 1/10 нэгжээр (6.5 м² = 65) */
export type CartItem = { serviceId: string; quantity: number };

export type PricedService = { id: string; name: string; unit: Unit; price: number | null };

export type QuoteLine = {
  serviceId: string;
  name: string;
  unit: Unit;
  unitPrice: number | null;
  quantity: number;
  amount: number | null;
};

export type Quote = {
  lines: QuoteLine[];
  /** Үнэтэй мөрүүдийн нийлбэр (мөнгө) */
  total: number;
  /** «Үнэ тохирно» мөр байгаа эсэх */
  hasUnpriced: boolean;
  /** Нуусан, устгасан тул хасагдсан үйлчилгээ */
  removed: string[];
};

/** м² — 0.1 алхамтай, ширхэг/суудал — бүхэл */
export const UNIT_STEP: Record<Unit, number> = { SQM: 1, PIECE: 10, SEAT: 10 };
export const MAX_QUANTITY = 10000; // 1000 нэгж

export const isValidQuantity = (unit: Unit, quantity: number) =>
  Number.isInteger(quantity) &&
  quantity >= UNIT_STEP[unit] &&
  quantity <= MAX_QUANTITY &&
  quantity % UNIT_STEP[unit] === 0;

/**
 * Сагсыг одоогийн үнээр бодно. Сервер дээр л итгэнэ — browser-ийн дүнг ашиглахгүй.
 * Давхардсан мөрийг нэгтгэж, харагдахгүй болсон үйлчилгээг `removed`-д хийнэ.
 */
export function priceCart(items: CartItem[], services: PricedService[]): Quote {
  const byId = new Map(services.map((s) => [s.id, s]));
  const quantities = new Map<string, number>();
  const removed: string[] = [];

  for (const { serviceId, quantity } of items) {
    if (!byId.has(serviceId)) {
      if (!removed.includes(serviceId)) removed.push(serviceId);
      continue;
    }
    quantities.set(serviceId, (quantities.get(serviceId) ?? 0) + quantity);
  }

  const lines: QuoteLine[] = [];
  for (const [serviceId, quantity] of quantities) {
    const service = byId.get(serviceId)!;
    if (!isValidQuantity(service.unit, quantity)) continue;
    lines.push({
      serviceId,
      name: service.name,
      unit: service.unit,
      unitPrice: service.price,
      quantity,
      amount: lineAmount(service.price, quantity),
    });
  }

  return {
    lines,
    total: lines.reduce((sum, line) => sum + (line.amount ?? 0), 0),
    hasUnpriced: lines.some((line) => line.unitPrice === null),
    removed,
  };
}

/** Хэрэглэгчийн харсан үнэ одоогийнхоос өөр эсэх (үйлчилгээ хасагдсан ч өөрчлөлт) */
export function quoteChanged(quote: Quote, seen: Record<string, number | null>): boolean {
  if (quote.removed.length || quote.lines.length !== Object.keys(seen).length) return true;
  return quote.lines.some(
    (line) => !(line.serviceId in seen) || seen[line.serviceId] !== line.unitPrice,
  );
}
