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
