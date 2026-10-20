import { describe, expect, it } from 'vitest';
import { formatEstimate, formatPrice, lineAmount, parseTugrik, tugrikToMinor } from './money';

describe('money', () => {
  it('мөнгийг төгрөгөөр харуулна', () => {
    expect(formatPrice(tugrikToMinor(25000))).toMatch(/^25.000₮$/);
  });

  it('м²-ийн аравтын хэмжээгээр мөрийн дүн бодно, үнэгүй бол null', () => {
    expect(lineAmount(tugrikToMinor(3000), 65)).toBe(tugrikToMinor(19500));
    expect(lineAmount(null, 30)).toBeNull();
  });
});

describe('parseTugrik', () => {
  it('таслал, зай, ₮-тэй бичлэгийг уншиж, хоосныг null болгоно', () => {
    expect(parseTugrik('25,000')).toBe(tugrikToMinor(25000));
    expect(parseTugrik(' 25 000₮ ')).toBe(tugrikToMinor(25000));
    expect(parseTugrik('')).toBeNull();
  });

  it('сөрөг, бутархай, үсэгтэйг буруу гэж үзнэ', () => {
    expect(parseTugrik('-5')).toBeUndefined();
    expect(parseTugrik('12.5')).toBeUndefined();
    expect(parseTugrik('abc')).toBeUndefined();
  });
});

describe('formatEstimate', () => {
  const onRequest = 'Үнэ тохирно';

  it('үнэтэй мөр байхгүй бол 0₮ биш «Үнэ тохирно»', () => {
    expect(formatEstimate([null, null], onRequest)).toBe(onRequest);
    expect(formatEstimate([], onRequest)).toBe(onRequest);
  });

  it('үнэтэй мөрүүдийг нэмж, үнэгүй мөр байвал тэмдэглэнэ', () => {
    expect(formatEstimate([tugrikToMinor(1000), tugrikToMinor(500)], onRequest)).toMatch(
      /^1.500₮$/,
    );
    expect(formatEstimate([tugrikToMinor(1000), null], onRequest)).toMatch(
      /^1.000₮ \+ Үнэ тохирно$/,
    );
  });
});
