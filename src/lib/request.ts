import 'server-only';
import { headers } from 'next/headers';

/** Хүсэлтийн IP: Railway-ийн proxy x-forwarded-for-д эхэнд нь бичнэ. */
export async function clientIp(): Promise<string> {
  const forwarded = (await headers()).get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}
