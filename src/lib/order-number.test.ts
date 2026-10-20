import { describe, expect, it } from 'vitest';
import { parseOrderNumber } from './order-number';

describe('parseOrderNumber', () => {
  it('# тэмдэг ба хоосон зайг зөвшөөрнө', () => {
    expect(parseOrderNumber('#12')).toBe(12);
    expect(parseOrderNumber(' 345 ')).toBe(345);
  });

  it('буруу оролтыг хүлээн авахгүй', () => {
    expect(parseOrderNumber('')).toBeNull();
    expect(parseOrderNumber('0')).toBeNull();
    expect(parseOrderNumber('12a')).toBeNull();
    expect(parseOrderNumber('-5')).toBeNull();
    expect(parseOrderNumber('12345678')).toBeNull();
  });
});
