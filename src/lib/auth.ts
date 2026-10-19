import 'server-only';
import type { Admin, Permission } from '@prisma/client';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { db } from './db';

const SESSION_COOKIE = 'admin_session';
const SESSION_HOURS = 12;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export type CurrentAdmin = Pick<Admin, 'id' | 'name' | 'email' | 'isOwner' | 'permissions'>;

/** Бүрэн эрхтэй админ бүх хэсэгт хандана; бусад нь олгосон эрхээрээ. */
export const can = (admin: CurrentAdmin, permission: Permission) =>
  admin.isOwner || admin.permissions.includes(permission);

/** Шинэ сесс: DB-д токены hash, browser-т HttpOnly cookie */
export async function startSession(adminId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await db.adminSession.create({ data: { id: hashToken(token), adminId, expiresAt } });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.adminSession.deleteMany({ where: { id: hashToken(token) } });
  store.delete(SESSION_COOKIE);
}

/** Хүчинтэй сесстэй, идэвхтэй админ; эсвэл null */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.adminSession.findUnique({
    where: { id: hashToken(token) },
    select: {
      expiresAt: true,
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
          isOwner: true,
          permissions: true,
          isActive: true,
        },
      },
    },
  });
  if (!session || session.expiresAt < new Date()) return null;
  const { isActive, ...admin } = session.admin;
  return isActive ? admin : null;
});

/**
 * Хуудас бүр ба server action бүрд дуудна (layout ба page зэрэг render хийгддэг тул layout-ийн
 * шалгалтад найдахгүй). Эрхгүй бол нэвтрэх эсвэл нүүр хуудас руу шилжүүлнэ.
 */
export async function requireAdmin(permission?: Permission | 'OWNER'): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  const allowed = !permission || (permission === 'OWNER' ? admin.isOwner : can(admin, permission));
  if (!allowed) redirect('/admin');
  return admin;
}
