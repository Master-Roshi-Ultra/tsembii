import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password', () => {
  it('зөв нууц үгийг л зөвшөөрнө', async () => {
    const stored = await hashPassword('secret-pass');
    expect(await verifyPassword('secret-pass', stored)).toBe(true);
    expect(await verifyPassword('wrong', stored)).toBe(false);
    expect(await verifyPassword('secret-pass', 'broken')).toBe(false);
  });
});
