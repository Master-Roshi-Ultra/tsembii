import { describe, expect, it } from 'vitest';
import { formatUbDateTime } from './dates';

describe('formatUbDateTime', () => {
  it('UTC-г Улаанбаатарын цаг (+8) болгоно, өдөр шилжихийг зөв тооцно', () => {
    expect(formatUbDateTime(new Date('2026-10-19T10:05:00Z'))).toBe('2026-10-19 18:05');
    expect(formatUbDateTime(new Date('2026-10-19T17:30:00Z'))).toBe('2026-10-20 01:30');
  });
});
