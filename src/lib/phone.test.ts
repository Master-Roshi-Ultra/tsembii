import { describe, expect, it } from 'vitest';
import { normalizeMnPhone, parsePhoneList } from './phone';

describe('normalizeMnPhone', () => {
  it('+976 угтвар, зураас, зайг арилгана', () => {
    expect(normalizeMnPhone('+976 9422-7111')).toBe('94227111');
    expect(normalizeMnPhone('97694227111')).toBe('94227111');
    expect(normalizeMnPhone('9686 3070')).toBe('96863070');
  });

  it('8 оронтой биш бол null', () => {
    expect(normalizeMnPhone('9422711')).toBeNull();
    expect(normalizeMnPhone('942271112')).toBeNull();
    expect(normalizeMnPhone('9422-71a1')).toBeNull();
  });
});

describe('parsePhoneList', () => {
  it('хоосон мөрийг алгасаж, буруу дугаарыг заана', () => {
    expect(parsePhoneList('9422-7111\n\n96863070\n')).toEqual({
      phones: ['9422-7111', '96863070'],
      invalid: undefined,
    });
    expect(parsePhoneList('9422-7111\n123').invalid).toBe('123');
  });
});
