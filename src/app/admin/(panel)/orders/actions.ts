'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { type FormState, FormError, handleForm, text } from '@/lib/form';
import { isOrderStatus } from './status';

export async function updateOrderAction(
  id: string,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin('ORDERS');
  return handleForm(async () => {
    const status = formData.get('status');
    if (!isOrderStatus(status)) throw new FormError('Төлвөө сонгоно уу.');
    const internalNote = text(formData, 'internalNote', 'Дотоод тэмдэглэл', {
      max: 2000,
      optional: true,
    });
    const order = await db.order
      .update({ where: { id }, data: { status, internalNote: internalNote || null } })
      .catch(() => null);
    if (!order) throw new FormError('Захиалга олдсонгүй.');
    revalidatePath('/admin/orders');
    return 'Хадгаллаа.';
  });
}
