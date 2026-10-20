'use client';

import { type FormEvent, useState, useTransition } from 'react';
import type { Quote } from '@/lib/cart';
import { formatEstimate, formatPrice } from '@/lib/money';
import { type OrderError, submitOrderAction } from './actions';
import styles from './order.module.css';
import { fill, formatPhone, formatQuantity, type OrderTexts, type UnitLabels } from './texts';

/** Хаяг оруулж хүсэлт илгээнэ. Үнэ өөрчлөгдсөн бол шинэ үнийг харуулж дахин батлуулна. */
export function AddressStep({
  t,
  units,
  onRequest,
  quote,
  phone,
  requestKey,
  onPriceChanged,
  onNotVerified,
  onDone,
}: {
  t: OrderTexts;
  units: UnitLabels;
  onRequest: string;
  quote: Quote;
  phone: string;
  requestKey: string;
  onPriceChanged: (quote: Quote) => void;
  onNotVerified: () => void;
  onDone: (number: number) => void;
}) {
  const [error, setError] = useState<OrderError | 'generic' | null>(null);
  const [priceChanged, setPriceChanged] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      setError(null);
      const result = await submitOrderAction({
        requestKey,
        // Сервер дахин бодсон мөрүүдийг л илгээнэ; харсан үнийг харьцуулалтад
        items: quote.lines.map(({ serviceId, quantity }) => ({ serviceId, quantity })),
        seen: Object.fromEntries(quote.lines.map((l) => [l.serviceId, l.unitPrice])),
        address: String(form.get('address') ?? ''),
        note: String(form.get('note') ?? ''),
        consent: form.get('consent') === 'on',
      }).catch(() => ({ ok: false as const, error: 'generic' as const }));

      if (result.ok) return onDone(result.number);
      if ('priceChanged' in result) {
        setPriceChanged(true);
        return onPriceChanged(result.priceChanged);
      }
      if (result.error === 'not_verified') return onNotVerified();
      setError(result.error);
    });
  }

  return (
    <section className="stack">
      <div className="card stack">
        {priceChanged && <p className="notice notice-error">{t.address.priceChanged}</p>}
        <ul className={styles.summary}>
          {quote.lines.map((line) => (
            <li key={line.serviceId}>
              <span>
                {line.name} · {formatQuantity(line.quantity, line.unit, units)}
              </span>
              <strong>{line.amount === null ? onRequest : formatPrice(line.amount)}</strong>
            </li>
          ))}
        </ul>
        <p>
          {t.cart.total}:{' '}
          <strong>
            {formatEstimate(
              quote.lines.map((line) => line.amount),
              onRequest,
            )}
          </strong>
        </p>
        <p className="notice">{fill(t.phone.verified, { phone: formatPhone(phone) })}</p>
      </div>

      <form className="card stack" onSubmit={submit}>
        <h2>{t.address.title}</h2>
        <div className="field">
          <span>{t.address.city}</span>
          <strong>{t.address.cityValue}</strong>
        </div>
        <div className="field">
          <label htmlFor="address">{t.address.address}</label>
          <textarea
            id="address"
            name="address"
            className="input"
            rows={3}
            minLength={5}
            maxLength={300}
            placeholder={t.address.addressHint}
            autoComplete="street-address"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="note">{t.address.note}</label>
          <textarea id="note" name="note" className="input" rows={2} maxLength={500} />
        </div>
        <label className="checkbox">
          <input type="checkbox" name="consent" required />
          <span>{t.address.consent}</span>
        </label>
        {error && <p className="notice notice-error">{t.errors[error]}</p>}
        <div>
          <button type="submit" className="btn" disabled={pending || !quote.lines.length}>
            {pending ? '…' : t.address.submit}
          </button>
        </div>
      </form>
    </section>
  );
}
