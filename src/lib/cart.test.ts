import { describe, expect, it } from 'vitest';
import { isValidQuantity, priceCart, type PricedService, quoteChanged } from './cart';

const services: PricedService[] = [
  { id: 'carpet', name: 'Хивс', unit: 'SQM', price: 300000 }, // 3,000₮ / м²
  { id: 'sofa', name: 'Буйдан', unit: 'SEAT', price: null }, // Үнэ тохирно
];

describe('isValidQuantity', () => {
  it('м²-д 0.1, ширхэг/суудалд бүхэл алхамыг зөвшөөрнө', () => {
    expect(isValidQuantity('SQM', 65)).toBe(true);
    expect(isValidQuantity('SQM', 0)).toBe(false);
    expect(isValidQuantity('SEAT', 30)).toBe(true);
    expect(isValidQuantity('SEAT', 35)).toBe(false);
    expect(isValidQuantity('PIECE', 10.5)).toBe(false);
    expect(isValidQuantity('PIECE', 100010)).toBe(false);
  });
});

describe('priceCart', () => {
  it('сервер дээрх үнээр бодож, үнэгүй мөрийг нийлбэрт оруулахгүй', () => {
    const quote = priceCart(
      [
        { serviceId: 'carpet', quantity: 65 },
        { serviceId: 'sofa', quantity: 30 },
      ],
      services,
    );
    expect(quote.total).toBe(1950000); // 6.5 × 3,000₮ = 19,500₮
    expect(quote.hasUnpriced).toBe(true);
    expect(quote.lines.map((l) => l.amount)).toEqual([1950000, null]);
  });

  it('давхардсан мөрийг нэгтгэж, нуусан үйлчилгээ болон буруу хэмжээг хасна', () => {
    const quote = priceCart(
      [
        { serviceId: 'carpet', quantity: 10 },
        { serviceId: 'carpet', quantity: 5 },
        { serviceId: 'gone', quantity: 10 },
        { serviceId: 'sofa', quantity: 15 },
      ],
      services,
    );
    expect(quote.lines).toHaveLength(1);
    expect(quote.lines[0].quantity).toBe(15);
    expect(quote.removed).toEqual(['gone']);
  });
});

describe('quoteChanged', () => {
  const quote = priceCart([{ serviceId: 'carpet', quantity: 10 }], services);

  it('харсан үнэ ижил бол өөрчлөлтгүй', () => {
    expect(quoteChanged(quote, { carpet: 300000 })).toBe(false);
  });

  it('үнэ өөрчлөгдсөн эсвэл мөр нэмэгдсэн/хасагдсан бол өөрчлөлттэй', () => {
    expect(quoteChanged(quote, { carpet: 250000 })).toBe(true);
    expect(quoteChanged(quote, { carpet: 300000, sofa: null })).toBe(true);
  });
});
