import { afterEach, describe, expect, it, vi } from 'vitest';
import { VerifierError, VerifyMn } from './phone-verifier';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);
afterEach(() => fetchMock.mockReset());

const json = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));

describe('VerifyMn', () => {
  const verifier = new VerifyMn('vrf_test');

  it('сесс үүсгэхэд Bearer түлхүүр, утас, текстийг илгээж хариуг хөрвүүлнэ', async () => {
    fetchMock.mockReturnValueOnce(
      json(201, {
        sessionId: 's1',
        smsUri: 'sms:144773?body=123456',
        displayInstruction: '123456 гэж 144773 руу илгээнэ үү',
        expiresAt: '2026-10-19T10:05:00Z',
      }),
    );
    const session = await verifier.createSession('94227111', '123456');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.verify.mn/sessions');
    expect(init.headers.Authorization).toBe('Bearer vrf_test');
    expect(JSON.parse(init.body)).toEqual({ phone: '94227111', text: '123456' });
    expect(session).toMatchObject({ sessionId: 's1', instruction: expect.any(String) });
    expect(session.expiresAt.toISOString()).toBe('2026-10-19T10:05:00.000Z');
  });

  it('төлөвийг уншина', async () => {
    fetchMock.mockReturnValueOnce(json(200, { sessionStatus: 'VERIFIED' }));
    expect(await verifier.getStatus('s1')).toBe('VERIFIED');
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.verify.mn/sessions/s1');
  });

  it('API алдаа (401 буруу түлхүүр) ба сүлжээний алдааг VerifierError болгоно', async () => {
    fetchMock.mockReturnValueOnce(json(401, { error: 'unauthorized' }));
    await expect(verifier.createSession('94227111', '1')).rejects.toThrow(VerifierError);

    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(verifier.getStatus('s1')).rejects.toThrow(VerifierError);
  });
});
