'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkbox, type FormState, FormError, handleForm, oneOf, text } from '@/lib/form';
import { hashPassword } from '@/lib/password';
import { PERMISSIONS } from '@/lib/permissions';

const PATH = '/admin/admins';
const MIN_PASSWORD = 10;

function readPassword(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  if (password.length < MIN_PASSWORD) {
    throw new FormError(`Нууц үг дор хаяж ${MIN_PASSWORD} тэмдэгт байна.`);
  }
  return hashPassword(password);
}

/** Бүрэн эрхтэй админыг энэ хуудаснаас өөрчлөхгүй (өөрийгөө түгжихээс сэргийлнэ). */
async function findEditable(id: string) {
  const target = await db.admin.findUnique({ where: { id }, select: { isOwner: true } });
  if (!target) throw new FormError('Админ олдсонгүй.');
  if (target.isOwner) throw new FormError('Бүрэн эрхтэй админыг өөрчлөх боломжгүй.');
}

export async function createAdminAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin('OWNER');
  return handleForm(async () => {
    const email = text(formData, 'email', 'Имэйл', { max: 120 }).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new FormError('Имэйл буруу байна.');
    await db.admin.create({
      data: {
        email,
        name: text(formData, 'name', 'Нэр', { max: 80 }),
        passwordHash: await readPassword(formData),
        permissions: oneOf(formData, 'permissions', PERMISSIONS),
      },
    });
    revalidatePath(PATH);
    return 'Админ нэмэгдлээ.';
  });
}

export async function updateAdminAction(
  id: string,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin('OWNER');
  return handleForm(async () => {
    await findEditable(id);
    const isActive = checkbox(formData, 'isActive');
    await db.$transaction([
      db.admin.update({
        where: { id },
        data: {
          name: text(formData, 'name', 'Нэр', { max: 80 }),
          permissions: oneOf(formData, 'permissions', PERMISSIONS),
          isActive,
        },
      }),
      // Идэвхгүй болгосон бол нэвтэрсэн сессийг нь хаана.
      ...(isActive ? [] : [db.adminSession.deleteMany({ where: { adminId: id } })]),
    ]);
    revalidatePath(PATH);
    return 'Хадгаллаа.';
  });
}

export async function resetPasswordAction(
  id: string,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin('OWNER');
  return handleForm(async () => {
    await findEditable(id);
    const passwordHash = await readPassword(formData);
    await db.$transaction([
      db.admin.update({ where: { id }, data: { passwordHash } }),
      db.adminSession.deleteMany({ where: { adminId: id } }),
    ]);
    return 'Нууц үг солигдлоо. Тухайн админ дахин нэвтэрнэ.';
  });
}
