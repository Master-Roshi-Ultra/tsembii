'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkbox, type FormState, FormError, handleForm, int, text } from '@/lib/form';
import { parseReelUrl } from '@/lib/reels';

const PATH = '/admin/reels';

function readReel(formData: FormData) {
  const link = parseReelUrl(text(formData, 'url', 'Reel линк', { max: 500 }));
  if (!link) {
    throw new FormError(
      'Facebook эсвэл Instagram reel-ийн линк оруулна уу (жишээ нь facebook.com/reel/… ).',
    );
  }
  return {
    url: link.url,
    sortOrder: int(formData, 'sortOrder', 'Дараалал', { max: 999 }),
    isVisible: checkbox(formData, 'isVisible'),
  };
}

export async function createReelAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin('CATALOG');
  return handleForm(async () => {
    await db.reel.create({ data: readReel(formData) });
    revalidatePath(PATH);
    return 'Reel нэмэгдлээ.';
  });
}

export async function updateReelAction(
  id: string,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin('CATALOG');
  return handleForm(async () => {
    const { count } = await db.reel.updateMany({ where: { id }, data: readReel(formData) });
    if (!count) throw new FormError('Reel олдсонгүй.');
    revalidatePath(PATH);
    return 'Хадгаллаа.';
  });
}

export async function deleteReelAction(id: string): Promise<FormState> {
  await requireAdmin('CATALOG');
  return handleForm(async () => {
    const reel = await db.reel.delete({ where: { id } }).catch(() => null);
    if (!reel) throw new FormError('Reel олдсонгүй.');
    revalidatePath(PATH);
    return 'Устгалаа.';
  });
}
