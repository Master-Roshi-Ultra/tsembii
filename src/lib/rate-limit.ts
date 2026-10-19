/**
 * Нэг process доторх энгийн хязгаарлагч (Railway дээр нэг instance).
 * `key`-ээр `windowMs` хугацаанд `limit`-ээс олон оролдлогыг хориглоно.
 */
const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

export function isRateLimited(key: string, limit: number, windowMs: number, now = Date.now()) {
  // Санах ой өсөхгүйн тулд олон түлхүүр хуримтлагдвал хуучирсныг хаяна.
  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) if (now - times[times.length - 1] >= windowMs) hits.delete(k);
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}

export function clearRateLimit(key: string) {
  hits.delete(key);
}
