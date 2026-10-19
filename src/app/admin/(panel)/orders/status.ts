import type { OrderStatus } from '@prisma/client';

export const ORDER_STATUSES = [
  'NEW',
  'CONFIRMED',
  'DONE',
  'CANCELLED',
] as const satisfies readonly OrderStatus[];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'Шинэ',
  CONFIRMED: 'Баталгаажсан',
  DONE: 'Дууссан',
  CANCELLED: 'Цуцалсан',
};

export const isOrderStatus = (value: unknown): value is OrderStatus =>
  ORDER_STATUSES.includes(value as OrderStatus);

/** Хайлт: тоо л үлдээж, утасны хэсэг эсвэл захиалгын дугаараар хайна. */
export function orderSearchWhere(query: string) {
  const digits = query.replace(/\D/g, '');
  if (!digits) return {};
  return {
    OR: [
      { phone: { contains: digits } },
      ...(digits.length <= 7 ? [{ number: Number(digits) }] : []),
    ],
  };
}
