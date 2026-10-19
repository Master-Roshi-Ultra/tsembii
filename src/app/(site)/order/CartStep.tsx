'use client';

import type { Unit } from '@prisma/client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { type CartItem, isValidQuantity, type Quote, UNIT_STEP } from '@/lib/cart';
import { removeFromCart, setCartQuantity } from '@/lib/cart-store';
import { formatPrice } from '@/lib/money';
import styles from './order.module.css';
import type { OrderTexts, UnitLabels } from './texts';

/** Хэмжээ: −/+ товч (1 нэгжээр) ба гараар бичих (м² бол 0.1 нарийвчлал) */
function QuantityInput({
  serviceId,
  unit,
  quantity,
  t,
}: {
  serviceId: string;
  unit: Unit;
  quantity: number;
  t: OrderTexts['cart'];
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const step = UNIT_STEP[unit];
  const set = (next: number) => isValidQuantity(unit, next) && setCartQuantity(serviceId, next);

  function commit() {
    if (draft !== null) set(Math.round(Number(draft.replace(',', '.')) * 10));
    setDraft(null);
  }

  return (
    <div className={styles.quantity}>
      <button
        type="button"
        aria-label={t.decrease}
        onClick={() => set(Math.max(step, quantity - 10))}
        disabled={quantity <= step}
      >
        −
      </button>
      <input
        aria-label={t.quantity}
        inputMode={unit === 'SQM' ? 'decimal' : 'numeric'}
        value={draft ?? String(quantity / 10)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && commit()}
      />
      <button type="button" aria-label={t.increase} onClick={() => set(quantity + 10)}>
        +
      </button>
    </div>
  );
}

export function CartStep({
  t,
  units,
  onRequest,
  items,
  quote,
  removedNote,
  onContinue,
}: {
  t: OrderTexts['cart'];
  units: UnitLabels;
  onRequest: string;
  items: CartItem[];
  quote: Quote | null;
  removedNote: boolean;
  onContinue: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  if (!items.length) {
    return (
      <div className={`card ${styles.empty}`}>
        {removedNote && <p className="notice notice-error">{t.removedNote}</p>}
        <p>{t.empty}</p>
        <Link href="/#services" className="btn">
          {t.chooseServices}
        </Link>
      </div>
    );
  }
  if (!quote) return <p className="muted">{t.loading}</p>;

  const quantityOf = (serviceId: string) =>
    items.find((i) => i.serviceId === serviceId)?.quantity ?? 0;

  return (
    <section className="stack">
      {removedNote && <p className="notice notice-error">{t.removedNote}</p>}
      <ul className={styles.lines}>
        {quote.lines.map((line) => (
          <li key={line.serviceId} className="card">
            <div className={styles.lineHead}>
              <strong>{line.name}</strong>
              <span className="muted">
                {line.unitPrice === null
                  ? onRequest
                  : `${formatPrice(line.unitPrice)} / ${units[line.unit]}`}
              </span>
            </div>
            <div className={styles.lineControls}>
              <QuantityInput
                serviceId={line.serviceId}
                unit={line.unit}
                quantity={quantityOf(line.serviceId)}
                t={t}
              />
              <span className="muted">{units[line.unit]}</span>
              <strong className={styles.amount}>
                {line.amount === null ? onRequest : formatPrice(line.amount)}
              </strong>
            </div>
            <button
              type="button"
              className={styles.remove}
              onClick={() => removeFromCart(line.serviceId)}
            >
              {t.remove}
            </button>
          </li>
        ))}
      </ul>

      <div className={`card ${styles.total}`}>
        <p>
          {t.total}: <strong>{formatPrice(quote.total)}</strong>
        </p>
        {quote.hasUnpriced && <p className="muted">{t.unpricedNote}</p>}
        <p className="muted">{t.estimateNote}</p>
      </div>

      <div>
        <button
          type="button"
          className="btn"
          disabled={pending || !quote.lines.length}
          onClick={() => startTransition(onContinue)}
        >
          {t.continue} <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
