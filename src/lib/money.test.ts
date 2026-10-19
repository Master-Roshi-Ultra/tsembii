import { describe, expect, it } from 'vitest';
import { formatPrice, lineAmount, tugrikToMinor } from './money';

describe('money', () => {
  it('мөнгийг төгрөгөөр харуулна', () => {
    expect(formatPrice(tugrikToMinor(25000))).toMatch(/^25.000₮$/);
  });

  it('м²-ийн аравтын хэмжээгээр мөрийн дүн бодно, үнэгүй бол null', () => {
    expect(lineAmount(tugrikToMinor(3000), 65)).toBe(tugrikToMinor(19500));
    expect(lineAmount(null, 30)).toBeNull();
  });
});
