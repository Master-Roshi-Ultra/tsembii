import 'server-only';

export type VerifySession = {
  sessionId: string;
  smsUri: string;
  instruction: string;
  expiresAt: Date;
};

export type VerifyRemoteStatus = 'PENDING' | 'VERIFIED' | 'EXPIRED';

export interface PhoneVerifier {
  /** Туршилтын горим эсэх — UI-д тодорхой тэмдэглэнэ */
  readonly isTest: boolean;
  createSession(phone: string, text: string): Promise<VerifySession>;
  getStatus(sessionId: string): Promise<VerifyRemoteStatus>;
}

export class VerifierError extends Error {}

const API = 'https://api.verify.mn';
const TIMEOUT_MS = 10_000;

/** Verify.mn: хэрэглэгч кодыг өөрийн дугаараас 144773 руу SMS-ээр илгээнэ. */
export class VerifyMn implements PhoneVerifier {
  readonly isTest = false;
  constructor(private readonly apiKey: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(API + path, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    }).catch(() => {
      throw new VerifierError('Verify.mn-тэй холбогдож чадсангүй.');
    });
    if (!res.ok) throw new VerifierError(`Verify.mn алдаа (${res.status}).`);
    return res.json() as Promise<T>;
  }

  async createSession(phone: string, text: string): Promise<VerifySession> {
    const body = await this.request<{
      sessionId: string;
      smsUri: string;
      displayInstruction: string;
      expiresAt: string;
    }>('/sessions', { method: 'POST', body: JSON.stringify({ phone, text }) });
    return {
      sessionId: body.sessionId,
      smsUri: body.smsUri,
      instruction: body.displayInstruction,
      expiresAt: new Date(body.expiresAt),
    };
  }

  async getStatus(sessionId: string): Promise<VerifyRemoteStatus> {
    const body = await this.request<{ sessionStatus: VerifyRemoteStatus }>(
      `/sessions/${encodeURIComponent(sessionId)}`,
    );
    return body.sessionStatus;
  }
}

/**
 * Локал туршилт: SMS илгээхгүй. «Туршилт: баталгаажуулах» товчоор л VERIFIED болно.
 * Production дээр хэзээ ч үүсэхгүй (`createPhoneVerifier`).
 */
class TestVerifier implements PhoneVerifier {
  readonly isTest = true;
  private readonly confirmed = new Set<string>();

  async createSession(_phone: string, text: string): Promise<VerifySession> {
    return {
      sessionId: `test-${crypto.randomUUID()}`,
      smsUri: `sms:144773?body=${encodeURIComponent(text)}`,
      instruction: 'ТУРШИЛТЫН ГОРИМ: SMS илгээгдэхгүй.',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
  }

  async getStatus(sessionId: string): Promise<VerifyRemoteStatus> {
    return this.confirmed.has(sessionId) ? 'VERIFIED' : 'PENDING';
  }

  confirm(sessionId: string) {
    this.confirmed.add(sessionId);
  }
}

/** Production дээр түлхүүргүй үед: хэрэглэгчид «түр ажиллахгүй» гэж харагдана. */
class UnconfiguredVerifier implements PhoneVerifier {
  readonly isTest = false;
  private fail(): never {
    throw new VerifierError('VERIFYMN_API_KEY тохируулаагүй.');
  }
  createSession = async (): Promise<VerifySession> => this.fail();
  getStatus = async (): Promise<VerifyRemoteStatus> => this.fail();
}

function createPhoneVerifier(): PhoneVerifier {
  const apiKey = process.env.VERIFYMN_API_KEY;
  if (apiKey) return new VerifyMn(apiKey);
  if (process.env.NODE_ENV === 'production') {
    // Туршилтын горим production-д хориотой.
    console.error('VERIFYMN_API_KEY тохируулаагүй — утас баталгаажуулалт ажиллахгүй.');
    return new UnconfiguredVerifier();
  }
  return new TestVerifier();
}

// Dev горимд hot reload-д туршилтын баталгаажуулалт алдагдахгүй.
const globalForVerifier = globalThis as unknown as { phoneVerifier?: PhoneVerifier };

export function phoneVerifier(): PhoneVerifier {
  globalForVerifier.phoneVerifier ??= createPhoneVerifier();
  return globalForVerifier.phoneVerifier;
}

/** Зөвхөн туршилтын горимд: сессийг баталгаажсан болгоно. */
export function confirmTestSession(sessionId: string): boolean {
  const verifier = phoneVerifier();
  if (!(verifier instanceof TestVerifier)) return false;
  verifier.confirm(sessionId);
  return true;
}
