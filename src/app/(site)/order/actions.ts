'use server';

import { Prisma } from '@prisma/client';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { type CartItem, priceCart, type Quote, quoteChanged } from '@/lib/cart';
import { db } from '@/lib/db';
import { normalizeMnPhone } from '@/lib/phone';
import { confirmTestSession, phoneVerifier, VerifierError } from '@/lib/phone-verifier';
import { clientIp } from '@/lib/request';
import {
  generateCode,
  startBlockReason,
  VERIFIED_TTL_MS,
  verificationStatus,
} from '@/lib/verification';

const COOKIE = 'phone_verification';
const MAX_ITEMS = 50;
const HOUR_MS = 60 * 60 * 1000;

export type OrderError =
  | 'invalid_phone'
  | 'cooldown'
  | 'limit'
  | 'unavailable'
  | 'not_verified'
  | 'empty_cart'
  | 'invalid_address'
  | 'consent';

const hash = (token: string) => createHash('sha256').update(token).digest('hex');

/** Browser-оос ирсэн сагсыг итгэхгүйгээр шалгана. */
function parseItems(input: unknown): CartItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, MAX_ITEMS)
    .filter(
      (item): item is CartItem =>
        typeof item?.serviceId === 'string' &&
        item.serviceId.length <= 40 &&
        Number.isInteger(item.quantity),
    )
    .map(({ serviceId, quantity }) => ({ serviceId, quantity }));
}

async function quote(items: CartItem[]): Promise<Quote> {
  const services = await db.service.findMany({
    where: { id: { in: items.map((i) => i.serviceId) }, isVisible: true },
    select: { id: true, name: true, unit: true, price: true },
  });
  return priceCart(items, services);
}

/** Сагсыг серверийн одоогийн үнээр бодно. */
export async function quoteCartAction(items: unknown): Promise<Quote> {
  return quote(parseItems(items));
}

/** Энэ browser-т холбогдсон баталгаажуулалт (cookie-оор) */
async function currentVerification() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  return db.phoneVerification.findUnique({ where: { cookieHash: hash(token) } });
}

export type StartResult =
  | { ok: false; error: OrderError }
  | {
      ok: true;
      phone: string;
      code: string;
      smsUri: string;
      instruction: string;
      expiresAt: string;
      isTest: boolean;
    };

export async function startVerificationAction(phoneInput: string): Promise<StartResult> {
  const phone = normalizeMnPhone(String(phoneInput));
  if (!phone) return { ok: false, error: 'invalid_phone' };

  const ip = await clientIp();
  const hourAgo = new Date(Date.now() - HOUR_MS);
  const [last, phoneCountHour, ipCountHour] = await Promise.all([
    db.phoneVerification.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
    db.phoneVerification.count({ where: { phone, createdAt: { gte: hourAgo } } }),
    db.phoneVerification.count({ where: { ip, createdAt: { gte: hourAgo } } }),
  ]);
  const blocked = startBlockReason({
    lastForPhoneAt: last?.createdAt ?? null,
    phoneCountHour,
    ipCountHour,
  });
  if (blocked) return { ok: false, error: blocked };

  // Хязгаарлалт нэг цагийн цонхтой тул 2 хоногоос хуучныг хадгалах шаардлагагүй.
  await db.phoneVerification.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - 48 * HOUR_MS) } },
  });

  const code = generateCode();
  const verifier = phoneVerifier();
  const session = await verifier.createSession(phone, code).catch((err) => {
    if (err instanceof VerifierError) return null;
    throw err;
  });
  if (!session) return { ok: false, error: 'unavailable' };

  const token = randomBytes(32).toString('base64url');
  await db.phoneVerification.create({
    data: {
      phone,
      sessionId: session.sessionId,
      code,
      cookieHash: hash(token),
      ip,
      expiresAt: session.expiresAt,
    },
  });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: VERIFIED_TTL_MS / 1000,
  });

  return {
    ok: true,
    phone,
    code,
    smsUri: session.smsUri,
    instruction: session.instruction,
    expiresAt: session.expiresAt.toISOString(),
    isTest: verifier.isTest,
  };
}

export type CheckResult = { status: 'none' | 'pending' | 'verified' | 'expired'; phone?: string };

/**
 * Төлөвийг шалгана. Хүлээгдэж байвал Verify.mn-ээс асууж, зөвхөн албан ёсны VERIFIED хариугаар
 * баталгаажуулна. Хэрэглэгч кодыг мэдэж байгаа нь баталгаа биш.
 */
export async function checkVerificationAction(): Promise<CheckResult> {
  const v = await currentVerification();
  if (!v) return { status: 'none' };

  const status = verificationStatus(v);
  if (status === 'used') return { status: 'none' };
  if (status !== 'pending') return { status, phone: v.phone };

  const remote = await phoneVerifier()
    .getStatus(v.sessionId)
    .catch(() => 'PENDING' as const);
  if (remote === 'EXPIRED') return { status: 'expired', phone: v.phone };
  if (remote !== 'VERIFIED') return { status: 'pending', phone: v.phone };

  await db.phoneVerification.updateMany({
    where: { id: v.id, verifiedAt: null },
    data: { verifiedAt: new Date() },
  });
  return { status: 'verified', phone: v.phone };
}

/** Туршилтын горимд л ажиллана (production дээр TestVerifier үүсдэггүй). */
export async function confirmTestVerificationAction(): Promise<void> {
  const v = await currentVerification();
  if (v) confirmTestSession(v.sessionId);
}

export type SubmitInput = {
  requestKey: string;
  items: unknown;
  /** Хэрэглэгчийн харсан нэгж үнэ: serviceId → мөнгө | null */
  seen: Record<string, number | null>;
  address: string;
  note: string;
  consent: boolean;
};

export type SubmitResult =
  | { ok: true; number: number }
  | { ok: false; error: OrderError }
  | { ok: false; priceChanged: Quote };

const findOrderNumber = (requestKey: string) =>
  db.order.findUnique({ where: { requestKey }, select: { number: true } });

export async function submitOrderAction(input: SubmitInput): Promise<SubmitResult> {
  const requestKey = String(input.requestKey).slice(0, 64);
  // Давтан илгээлт: эхний захиалгын дугаарыг буцаана.
  const existing = await findOrderNumber(requestKey);
  if (existing) return { ok: true, number: existing.number };

  const address = String(input.address ?? '').trim();
  const note = String(input.note ?? '').trim();
  if (address.length < 5 || address.length > 300 || note.length > 500) {
    return { ok: false, error: 'invalid_address' };
  }
  if (input.consent !== true) return { ok: false, error: 'consent' };

  const v = await currentVerification();
  if (!v || verificationStatus(v) !== 'verified') return { ok: false, error: 'not_verified' };

  const current = await quote(parseItems(input.items));
  if (!current.lines.length) return { ok: false, error: 'empty_cart' };
  if (quoteChanged(current, input.seen ?? {})) return { ok: false, priceChanged: current };

  try {
    const order = await db.$transaction(async (tx) => {
      // Баталгаажуулалтыг нэг л удаа ашиглана (зэрэг илгээлтээс хамгаална).
      const used = await tx.phoneVerification.updateMany({
        where: { id: v.id, usedAt: null },
        data: { usedAt: new Date() },
      });
      if (used.count !== 1) return null;
      return tx.order.create({
        data: {
          requestKey,
          phone: v.phone,
          address,
          note: note || null,
          consentAt: new Date(),
          total: current.total,
          items: {
            create: current.lines.map(({ serviceId, name, unit, unitPrice, quantity, amount }) => ({
              serviceId,
              name,
              unit,
              unitPrice,
              quantity,
              amount,
            })),
          },
        },
        select: { number: true },
      });
    });
    if (!order) {
      const again = await findOrderNumber(requestKey);
      return again ? { ok: true, number: again.number } : { ok: false, error: 'not_verified' };
    }
    (await cookies()).delete(COOKIE);
    return { ok: true, number: order.number };
  } catch (err) {
    // Ижил requestKey зэрэг ирвэл эхнийх нь хадгалагдана.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const again = await findOrderNumber(requestKey);
      if (again) return { ok: true, number: again.number };
    }
    throw err;
  }
}
