'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkbox, type FormState, FormError, handleForm, int, text } from '@/lib/form';
import { deleteImageIfUnused, saveImage } from '@/lib/image-store';

const PATH = '/admin/works';

const readWork = (formData: FormData) => ({
  title: text(formData, 'title', 'Ажлын нэр', { max: 120 }),
  sortOrder: int(formData, 'sortOrder', 'Дараалал', { max: 999 }),
  isVisible: checkbox(formData, 'isVisible'),
});

/** Өмнөх, дараах зургийг хадгална; алдаа гарвал шинээр хадгалснаа цэвэрлэнэ. */
async function saveImages(formData: FormData) {
  const before = await saveImage(formData.get('before'));
  const after = await saveImage(formData.get('after')).catch(async (err) => {
    await deleteImageIfUnused(before);
    throw err;
  });
  return { before, after };
}

export async function createWorkAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin('CATALOG');
  return handleForm(async () => {
    const data = readWork(formData);
    const { before, after } = await saveImages(formData);
    if (!before || !after) {
      await Promise.all([deleteImageIfUnused(before), deleteImageIfUnused(after)]);
      throw new FormError('Өмнөх ба дараах зургийг хоёуланг нь оруулна уу.');
    }
    await db.work.create({ data: { ...data, beforeImageId: before, afterImageId: after } });
    revalidatePath(PATH);
    return `«${data.title}» нэмэгдлээ.`;
  });
}

export async function updateWorkAction(
  id: string,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin('CATALOG');
  return handleForm(async () => {
    const data = readWork(formData);
    const old = await db.work.findUnique({
      where: { id },
      select: { beforeImageId: true, afterImageId: true },
    });
    if (!old) throw new FormError('Ажил олдсонгүй.');

    const { before, after } = await saveImages(formData);
    await db.work
      .update({
        where: { id },
        data: { ...data, beforeImageId: before ?? undefined, afterImageId: after ?? undefined },
      })
      .catch(async (err) => {
        await Promise.all([deleteImageIfUnused(before), deleteImageIfUnused(after)]);
        throw err;
      });
    if (before) await deleteImageIfUnused(old.beforeImageId);
    if (after) await deleteImageIfUnused(old.afterImageId);

    revalidatePath(PATH);
    return 'Хадгаллаа.';
  });
}

export async function deleteWorkAction(id: string): Promise<FormState> {
  await requireAdmin('CATALOG');
  return handleForm(async () => {
    const work = await db.work.delete({ where: { id } }).catch(() => null);
    if (!work) throw new FormError('Ажил олдсонгүй.');
    await deleteImageIfUnused(work.beforeImageId);
    await deleteImageIfUnused(work.afterImageId);
    revalidatePath(PATH);
    return 'Устгалаа.';
  });
}
