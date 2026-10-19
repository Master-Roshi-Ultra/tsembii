'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkbox, type FormState, FormError, handleForm, text } from '@/lib/form';
import { deleteImageIfUnused, saveImage } from '@/lib/image-store';
import { parsePhoneList } from '@/lib/phone';

export async function updateSettingsAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin('SETTINGS');
  return handleForm(async () => {
    const { phones, invalid } = parsePhoneList(String(formData.get('phones') ?? ''));
    if (!phones.length) throw new FormError('Дор хаяж нэг утасны дугаар оруулна уу.');
    if (invalid) throw new FormError(`«${invalid}» — 8 оронтой утасны дугаар оруулна уу.`);

    const data = {
      phones,
      hours: text(formData, 'hours', 'Ажлын цаг', { max: 80 }),
      area: text(formData, 'area', 'Үйлчлэх бүс', { max: 80 }),
    };
    const old = await db.setting.findUnique({ where: { id: 1 }, select: { heroImageId: true } });
    const newImageId = await saveImage(formData.get('image'));
    const heroImageId =
      newImageId ?? (checkbox(formData, 'imageRemove') ? null : (old?.heroImageId ?? null));

    await db.setting
      .upsert({
        where: { id: 1 },
        update: { ...data, heroImageId },
        create: { ...data, heroImageId },
      })
      .catch(async (err) => {
        await deleteImageIfUnused(newImageId);
        throw err;
      });
    if (heroImageId !== old?.heroImageId) await deleteImageIfUnused(old?.heroImageId);

    revalidatePath('/admin/settings');
    return 'Хадгаллаа.';
  });
}
