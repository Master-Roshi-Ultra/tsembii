/**
 * Нэг process доторх энгийн хязгаарлагч (Railway дээр нэг instance).
 * `key`-ээр `windowMs` хугацаанд `limit`-ээс олон оролдлогыг хориглоно.
 */
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}

export function clearRateLimit(key: string) {
  hits.delete(key);
}
