/** «+976 9422-7111», «94227111» → «94227111». Монголын 8 оронтой биш бол null. */
export function normalizeMnPhone(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, '').replace(/^(\+?976)/, '');
  return /^\d{8}$/.test(digits) ? digits : null;
}

/** Мөр бүрт нэг утас; бичсэн хэлбэрийг нь хадгалж, буруу мөрийг буцаана. */
export function parsePhoneList(input: string): { phones: string[]; invalid?: string } {
  const phones = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return { phones, invalid: phones.find((phone) => !normalizeMnPhone(phone)) };
}
