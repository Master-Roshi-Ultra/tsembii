import { Prisma } from '@prisma/client';

/** Маягтын server action-ийн үр дүн */
export type FormState = { ok?: boolean; message?: string };

/** Оролтын алдаа: хэрэглэгчид мессежээр харагдана */
export class FormError extends Error {}

/**
 * Маягтын action-ийг ажиллуулж, оролтын болон давхардлын алдааг мессеж болгоно.
 * Бусад алдаа (redirect, notFound гэх мэт) дээш дамжина.
 */
export async function handleForm(task: () => Promise<string>): Promise<FormState> {
  try {
    return { ok: true, message: await task() };
  } catch (err) {
    if (err instanceof FormError) return { ok: false, message: err.message };
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return { ok: false, message: 'Ийм утгатай бичлэг бүртгэлтэй байна.' };
    }
    throw err;
  }
}

/** Тэмдэгт мөр: хоосон зай арилгаж, урт ба заавал эсэхийг шалгана. */
export function text(
  formData: FormData,
  name: string,
  label: string,
  { max = 200, optional = false }: { max?: number; optional?: boolean } = {},
): string {
  const value = String(formData.get(name) ?? '').trim();
  if (!value && !optional) throw new FormError(`«${label}» хоосон байна.`);
  if (value.length > max) throw new FormError(`«${label}» ${max} тэмдэгтээс хэтэрсэн байна.`);
  return value;
}

export const checkbox = (formData: FormData, name: string) => formData.get(name) === 'on';

/** Сонголтын утга зөвшөөрөгдсөн жагсаалтад байгаа эсэх */
export function oneOf<T extends string>(
  formData: FormData,
  name: string,
  allowed: readonly T[],
): T[] {
  return formData.getAll(name).filter((v): v is T => allowed.includes(v as T));
}

/** Бүхэл тоо; хоосон бол `fallback` */
export function int(
  formData: FormData,
  name: string,
  label: string,
  { min = 0, max = 100000, fallback = 0 }: { min?: number; max?: number; fallback?: number } = {},
): number {
  const raw = String(formData.get(name) ?? '').trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new FormError(`«${label}» ${min}–${max} хооронд бүхэл тоо байна.`);
  }
  return value;
}
