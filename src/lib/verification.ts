import { randomInt } from 'node:crypto';

/** Баталгаажсан утсаар захиалга илгээх хугацаа */
export const VERIFIED_TTL_MS = 30 * 60 * 1000;
/** Нэг дугаарт шинэ код авах хоорондын зай */
export const RESEND_COOLDOWN_MS = 60 * 1000;
export const MAX_PER_PHONE_PER_HOUR = 5;
export const MAX_PER_IP_PER_HOUR = 10;

export const generateCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');

/** Шинэ код авахыг хориглох шалтгаан; зөвшөөрвөл null */
export function startBlockReason(
  {
    lastForPhoneAt,
    phoneCountHour,
    ipCountHour,
  }: { lastForPhoneAt: Date | null; phoneCountHour: number; ipCountHour: number },
  now = new Date(),
): 'cooldown' | 'limit' | null {
  if (phoneCountHour >= MAX_PER_PHONE_PER_HOUR || ipCountHour >= MAX_PER_IP_PER_HOUR) {
    return 'limit';
  }
  if (lastForPhoneAt && now.getTime() - lastForPhoneAt.getTime() < RESEND_COOLDOWN_MS) {
    return 'cooldown';
  }
  return null;
}

type VerificationState = { expiresAt: Date; verifiedAt: Date | null; usedAt: Date | null };

export type VerificationStatus = 'pending' | 'verified' | 'expired' | 'used';

/** Browser-т холбогдсон баталгаажуулалтын одоогийн төлөв (Verify.mn-ийг дуудахаас өмнө) */
export function verificationStatus(v: VerificationState, now = new Date()): VerificationStatus {
  if (v.usedAt) return 'used';
  if (v.verifiedAt) {
    return now.getTime() - v.verifiedAt.getTime() < VERIFIED_TTL_MS ? 'verified' : 'expired';
  }
  return v.expiresAt > now ? 'pending' : 'expired';
}
