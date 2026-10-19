/** DB-д UTC; харуулахдаа Улаанбаатарын цагаар: «2026-10-19 18:05» */
const ubFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ulaanbaatar',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export function formatUbDateTime(date: Date): string {
  const parts = Object.fromEntries(ubFormat.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

/** Өнөөдөр (Улаанбаатар) «YYYY-MM-DD» — date input-ийн max-д */
export const ubToday = (now = new Date()) => formatUbDateTime(now).slice(0, 10);

/**
 * Date input-ийн «YYYY-MM-DD» → UTC шөнө дундын Date (DB-ийн DATE). Буруу эсвэл ирээдүйн
 * огноо бол null.
 */
export function parseDateInput(value: string, now = new Date()): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > ubToday(now) || value < '2000-01-01') {
    return null;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return date.toISOString().slice(0, 10) === value ? date : null;
}

/** DATE багана → «2026.10.19» (цагийн бүсгүй огноо тул UTC хэсгээр) */
export const formatDate = (date: Date) => date.toISOString().slice(0, 10).replaceAll('-', '.');

/** DATE багана → date input-ийн утга */
export const toDateInput = (date: Date) => date.toISOString().slice(0, 10);
