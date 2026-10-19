import { describe, expect, it } from 'vitest';
import { clearRateLimit, isRateLimited } from './rate-limit';

describe('isRateLimited', () => {
  it('хязгаараас хэтэрвэл хориглож, хугацаа өнгөрөхөд дахин зөвшөөрнө', () => {
    const key = 'test-key';
    expect(isRateLimited(key, 2, 1000, 0)).toBe(false);
    expect(isRateLimited(key, 2, 1000, 10)).toBe(false);
    expect(isRateLimited(key, 2, 1000, 20)).toBe(true);
    expect(isRateLimited(key, 2, 1000, 5000)).toBe(false);
    clearRateLimit(key);
  });
});
