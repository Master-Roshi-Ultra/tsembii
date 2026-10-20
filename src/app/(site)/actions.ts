'use server';

import type { OrderStatus, Unit } from '@prisma/client';
import { formatUbDateTime } from '@/lib/dates';
import { db } from '@/lib/db';
import { parseOrderNumber } from '@/lib/order-number';
import { normalizeMnPhone } from '@/lib/phone';
import { isRateLimited } from '@/lib/rate-limit';
import { clientIp } from '@/lib/request';

// Дугаар таах оролдлогыг удаашруулна.
const TRACK_LIMIT = 10;
const TRACK_WINDOW_MS = 10 * 60 * 1000;

export type TrackError = 'invalid' | 'not_found' | 'limit';

export type TrackedOrder = {
  number: number;
  createdAt: string;
  status: OrderStatus;
  items: { name: string; quantity: number; unit: Unit }[];
};

export type TrackResult = { ok: true; order: TrackedOrder } | { ok: false; error: TrackError };

/**
 * Утас ба хүсэлтийн дугаар хоёулаа таарвал л захиалгын явцыг буцаана.
 * Хаяг, тэмдэглэлийг буцаахгүй; аль нь буруу болохыг ч хэлэхгүй.
 */
export async function trackOrderAction(
  phoneInput: string,
  numberInput: string,
): Promise<TrackResult> {
  const phone = normalizeMnPhone(String(phoneInput));
  const number = parseOrderNumber(String(numberInput));
  if (!phone || !number) return { ok: false, error: 'invalid' };
  if (isRateLimited(`track:${await clientIp()}`, TRACK_LIMIT, TRACK_WINDOW_MS)) {
    return { ok: false, error: 'limit' };
  }

  const order = await db.order.findFirst({
    where: { number, phone },
    select: {
      number: true,
      createdAt: true,
      status: true,
      items: { select: { name: true, quantity: true, unit: true }, orderBy: { id: 'asc' } },
    },
  });
  if (!order) return { ok: false, error: 'not_found' };
  return { ok: true, order: { ...order, createdAt: formatUbDateTime(order.createdAt) } };
}
