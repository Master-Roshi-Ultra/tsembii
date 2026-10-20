/** «#123», « 123 » → 123. Эерэг бүхэл тоо биш бол null. */
export function parseOrderNumber(input: string): number | null {
  const digits = input.trim().replace(/^#/, '');
  if (!/^\d{1,7}$/.test(digits)) return null;
  const number = Number(digits);
  return number > 0 ? number : null;
}
