'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  checkVerificationAction,
  confirmTestVerificationAction,
  type OrderError,
  startVerificationAction,
  type StartResult,
} from './actions';
import styles from './order.module.css';
import { fill, formatPhone, type OrderTexts } from './texts';

type Session = Extract<StartResult, { ok: true }>;

const POLL_MS = 3000;

/**
 * Утас баталгаажуулах: код авах → хэрэглэгч өөрийн дугаараас SMS илгээнэ → сервер
 * Verify.mn-ээс ~3 секунд тутам төлөв асууна. Хугацаа дуусвал шинэ код авна.
 */
export function PhoneStep({
  t,
  errors,
  onBack,
  onVerified,
}: {
  t: OrderTexts['phone'];
  errors: OrderTexts['errors'];
  onBack: () => void;
  onVerified: (phone: string) => void;
}) {
  const [phoneInput, setPhoneInput] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<OrderError | null>(null);
  const [expired, setExpired] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [pending, startTransition] = useTransition();

  const secondsLeft = session
    ? Math.max(0, Math.round((new Date(session.expiresAt).getTime() - now) / 1000))
    : 0;
  const waiting = session !== null && !expired && secondsLeft > 0;

  // Хүлээж байх үед төлөв шалгаж, үлдсэн хугацааг тоолно.
  useEffect(() => {
    if (!waiting) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const poll = setInterval(async () => {
      const result = await checkVerificationAction();
      if (result.status === 'verified' && result.phone) onVerified(result.phone);
      if (result.status === 'expired') setExpired(true);
    }, POLL_MS);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [waiting, onVerified]);

  function start() {
    startTransition(async () => {
      setError(null);
      const result = await startVerificationAction(phoneInput);
      if (!result.ok) return setError(result.error);
      setSession(result);
      setExpired(false);
      setNow(Date.now());
    });
  }

  function confirmTest() {
    startTransition(async () => {
      await confirmTestVerificationAction();
      const result = await checkVerificationAction();
      if (result.status === 'verified' && result.phone) onVerified(result.phone);
    });
  }

  const errorMessage = error && <p className="notice notice-error">{errors[error]}</p>;

  if (!session) {
    return (
      <section className="card stack">
        <h2>{t.title}</h2>
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <div className="field">
            <label htmlFor="phone">{t.label}</label>
            <input
              id="phone"
              className="input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="9911-2233"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              required
            />
          </div>
          <p className="muted">{t.costNote}</p>
          {errorMessage}
          <div className="row">
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              ←
            </button>
            <button type="submit" className="btn" disabled={pending}>
              {t.getCode}
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="card stack">
      <h2>{t.title}</h2>
      {session.isTest && <p className="notice notice-error">{t.testMode}</p>}
      <p>{fill(t.sendFrom, { phone: formatPhone(session.phone) })}</p>
      <p className={styles.code}>{session.code}</p>
      <p className="muted">{session.instruction}</p>

      {waiting ? (
        <>
          <a href={session.smsUri} className="btn">
            {t.sendSms}
          </a>
          <p className="muted" role="status">
            {t.waiting} {t.expiresIn} {Math.floor(secondsLeft / 60)}:
            {String(secondsLeft % 60).padStart(2, '0')}
          </p>
          {session.isTest && (
            <button type="button" className="btn btn-secondary" onClick={confirmTest}>
              {t.testConfirm}
            </button>
          )}
        </>
      ) : (
        <>
          <p className="notice notice-error">{t.expired}</p>
          {errorMessage}
          <button type="button" className="btn" onClick={start} disabled={pending}>
            {t.newCode}
          </button>
        </>
      )}

      <button type="button" className={styles.link} onClick={() => setSession(null)}>
        {t.changePhone}
      </button>
    </section>
  );
}
