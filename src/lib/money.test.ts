import { describe, expect, it } from 'vitest';
import { formatPrice, formatQuantity, lineAmount, tugrikToMinor } from './money';

describe('money', () => {
  it('үнэгүй бол «Үнэ тохирно», 0₮ биш', () => {
    expect(formatPrice(null)).toBe('Үнэ тохирно');
    expect(formatPrice(tugrikToMinor(25000))).toMatch(/^25.000₮$/);
  });

  it('м²-ийн аравтын хэмжээгээр мөрийн дүн бодно', () => {
    expect(lineAmount(tugrikToMinor(3000), 65)).toBe(tugrikToMinor(19500));
    expect(lineAmount(null, 30)).toBeNull();
    expect(formatQuantity(65, 'SQM')).toBe('6.5 м²');
  });
});
