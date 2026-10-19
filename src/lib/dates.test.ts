import { describe, expect, it } from 'vitest';
import { formatDate, formatUbDateTime, parseDateInput, ubToday } from './dates';

describe('formatUbDateTime', () => {
  it('UTC-г Улаанбаатарын цаг (+8) болгоно, өдөр шилжихийг зөв тооцно', () => {
    expect(formatUbDateTime(new Date('2026-10-19T10:05:00Z'))).toBe('2026-10-19 18:05');
    expect(formatUbDateTime(new Date('2026-10-19T17:30:00Z'))).toBe('2026-10-20 01:30');
  });
});

describe('parseDateInput', () => {
  // Улаанбаатарт 2026-10-20 01:30
  const now = new Date('2026-10-19T17:30:00Z');

  it('Улаанбаатарын өнөөдрийг хүртэл зөвшөөрнө', () => {
    expect(ubToday(now)).toBe('2026-10-20');
    expect(parseDateInput('2026-10-20', now)?.toISOString()).toBe('2026-10-20T00:00:00.000Z');
  });

  it('ирээдүй, буруу огноо, хэлбэрийг татгалзана', () => {
    expect(parseDateInput('2026-10-21', now)).toBeNull();
    expect(parseDateInput('2026-02-30', now)).toBeNull();
    expect(parseDateInput('20.10.2026', now)).toBeNull();
    expect(parseDateInput('', now)).toBeNull();
  });

  it('огноог «YYYY.MM.DD» хэлбэрээр харуулна', () => {
    expect(formatDate(new Date('2026-10-20T00:00:00Z'))).toBe('2026.10.20');
  });
});
