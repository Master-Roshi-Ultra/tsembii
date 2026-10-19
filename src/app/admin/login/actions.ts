'use server';

import { redirect } from 'next/navigation';
import { startSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { type FormState } from '@/lib/form';
import { verifyPassword } from '@/lib/password';
import { clearRateLimit, isRateLimited } from '@/lib/rate-limit';
import { clientIp } from '@/lib/request';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const WRONG = 'Имэйл эсвэл нууц үг буруу байна.';

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { ok: false, message: 'Имэйл, нууц үгээ оруулна уу.' };

  const key = `login:${await clientIp()}:${email}`;
  if (isRateLimited(key, MAX_ATTEMPTS, WINDOW_MS)) {
    return { ok: false, message: 'Олон удаа буруу оролдлоо. 15 минутын дараа дахин оролдоно уу.' };
  }

  const admin = await db.admin.findUnique({
    where: { email },
    select: { id: true, passwordHash: true, isActive: true },
  });
  if (!admin?.isActive || !(await verifyPassword(password, admin.passwordHash))) {
    return { ok: false, message: WRONG };
  }

  clearRateLimit(key);
  await startSession(admin.id);
  redirect('/admin');
}
