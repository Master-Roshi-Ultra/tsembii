'use server';

import type { Unit } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { mn } from '@/i18n/mn';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkbox, type FormState, FormError, handleForm, int, text } from '@/lib/form';
import { deleteImageIfUnused, saveImage } from '@/lib/image-store';
import { parseTugrik } from '@/lib/money';

const PATH = '/admin/services';
const UNITS = Object.keys(mn.units) as Unit[];

function readService(formData: FormData) {
  const unit = formData.get('unit') as Unit;
  if (!UNITS.includes(unit)) throw new FormError('Хэмжих нэгжээ сонгоно уу.');
  const price = parseTugrik(String(formData.get('price') ?? ''));
  if (price === undefined) throw new FormError('Үнийг төгрөгөөр, бүхэл тоогоор оруулна уу.');
  return {
    name: text(formData, 'name', 'Нэр', { max: 80 }),
    description: text(formData, 'description', 'Тайлбар', { max: 300, optional: true }) || null,
    unit,
    price,
    sortOrder: int(formData, 'sortOrder', 'Дараалал', { max: 999 }),
    isVisible: checkbox(formData, 'isVisible'),
  };
}

export async function createServiceAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin('CATALOG');
  return handleForm(async () => {
    const data = readService(formData);
    const imageId = await saveImage(formData.get('image'));
    await db.service.create({ data: { ...data, imageId } }).catch(async (err) => {
      await deleteImageIfUnused(imageId);
      throw err;
    });
    revalidatePath(PATH);
    return `«${data.name}» нэмэгдлээ.`;
  });
}

export async function updateServiceAction(
  id: string,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin('CATALOG');
  return handleForm(async () => {
    const data = readService(formData);
    const old = await db.service.findUnique({ where: { id }, select: { imageId: true } });
    if (!old) throw new FormError('Үйлчилгээ олдсонгүй.');

    const newImageId = await saveImage(formData.get('image'));
    const imageId = newImageId ?? (checkbox(formData, 'imageRemove') ? null : old.imageId);
    await db.service.update({ where: { id }, data: { ...data, imageId } }).catch(async (err) => {
      await deleteImageIfUnused(newImageId);
      throw err;
    });
    if (imageId !== old.imageId) await deleteImageIfUnused(old.imageId);

    revalidatePath(PATH);
    return 'Хадгаллаа.';
  });
}

/** Захиалгад ашиглагдсан үйлчилгээг устгахгүй — өмнөх захиалгын холбоос хадгалагдана. */
export async function deleteServiceAction(id: string): Promise<FormState> {
  await requireAdmin('CATALOG');
  return handleForm(async () => {
    const service = await db.service.findUnique({
      where: { id },
      select: { imageId: true, _count: { select: { orderItems: true } } },
    });
    if (!service) throw new FormError('Үйлчилгээ олдсонгүй.');
    if (service._count.orderItems) {
      throw new FormError(
        'Захиалгад ашиглагдсан тул устгах боломжгүй. «Сайтад харуулах»-ыг унтрааж нууна уу.',
      );
    }
    await db.service.delete({ where: { id } });
    await deleteImageIfUnused(service.imageId);
    revalidatePath(PATH);
    return 'Устгалаа.';
  });
}
