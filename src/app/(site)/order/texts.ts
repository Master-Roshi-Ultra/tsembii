import type { Unit } from '@prisma/client';
import type { Dictionary } from '@/i18n/mn';

export type OrderTexts = Dictionary['order'];
export type UnitLabels = Dictionary['units'];

/** «{phone} дугаар…» загварт утга оруулна. */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

/** 65, SQM → «6.5 м²» */
export const formatQuantity = (tenths: number, unit: Unit, units: UnitLabels) =>
  `${tenths / 10} ${units[unit]}`;

/** 94227111 → «9422-7111» */
export const formatPhone = (phone: string) => `${phone.slice(0, 4)}-${phone.slice(4)}`;
