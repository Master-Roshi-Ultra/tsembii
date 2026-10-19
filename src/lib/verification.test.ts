import { describe, expect, it } from 'vitest';
import {
  generateCode,
  MAX_PER_PHONE_PER_HOUR,
  startBlockReason,
  VERIFIED_TTL_MS,
  verificationStatus,
} from './verification';

const now = new Date('2026-10-19T10:00:00Z');
const ago = (ms: number) => new Date(now.getTime() - ms);

describe('generateCode', () => {
  it('6 оронтой тоо', () => {
    for (let i = 0; i < 20; i++) expect(generateCode()).toMatch(/^\d{6}$/);
  });
});

describe('startBlockReason', () => {
  const base = { lastForPhoneAt: null, phoneCountHour: 0, ipCountHour: 0 };

  it('анх удаа зөвшөөрнө', () => {
    expect(startBlockReason(base, now)).toBeNull();
  });

  it('60 секундэд дахин авахыг хориглоно', () => {
    expect(startBlockReason({ ...base, lastForPhoneAt: ago(30_000) }, now)).toBe('cooldown');
    expect(startBlockReason({ ...base, lastForPhoneAt: ago(61_000) }, now)).toBeNull();
  });

  it('цагийн хязгаар хэтэрвэл хориглоно', () => {
    expect(startBlockReason({ ...base, phoneCountHour: MAX_PER_PHONE_PER_HOUR }, now)).toBe(
      'limit',
    );
  });
});

describe('verificationStatus', () => {
  const pending = { expiresAt: new Date(now.getTime() + 60_000), verifiedAt: null, usedAt: null };

  it('хугацаандаа хүлээгдэж, хугацаа дуусвал expired', () => {
    expect(verificationStatus(pending, now)).toBe('pending');
    expect(verificationStatus({ ...pending, expiresAt: ago(1) }, now)).toBe('expired');
  });

  it('баталгаажсаныг 30 минут хүчинтэй, ашигласныг дахин ашиглуулахгүй', () => {
    expect(verificationStatus({ ...pending, verifiedAt: ago(1000) }, now)).toBe('verified');
    expect(verificationStatus({ ...pending, verifiedAt: ago(VERIFIED_TTL_MS + 1) }, now)).toBe(
      'expired',
    );
    expect(verificationStatus({ ...pending, verifiedAt: ago(1000), usedAt: now }, now)).toBe(
      'used',
    );
  });
});
