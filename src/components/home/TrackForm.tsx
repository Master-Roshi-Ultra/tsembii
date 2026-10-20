'use client';

import { type FormEvent, useState, useTransition } from 'react';
import { type TrackedOrder, trackOrderAction, type TrackResult } from '@/app/(site)/actions';
import { formatQuantity, type UnitLabels } from '@/app/(site)/order/texts';
import type { Dictionary } from '@/i18n/mn';
import styles from './home.module.css';

type TrackTexts = Dictionary['track'];

/** Цуцлагдаагүй захиалгын явцын дараалал */
const PROGRESS = ['NEW', 'CONFIRMED', 'DONE'] as const;

export function TrackForm({ t, units }: { t: TrackTexts; units: UnitLabels }) {
  const [result, setResult] = useState<TrackResult | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      setResult(await trackOrderAction(String(data.get('phone')), String(data.get('number'))));
    });
  }

  return (
    <>
      <form className={styles.trackForm} onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="track-phone">{t.phone}</label>
          <input
            id="track-phone"
            name="phone"
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="9911-2233"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="track-number">{t.number}</label>
          <input
            id="track-number"
            name="number"
            className="input"
            inputMode="numeric"
            autoComplete="off"
            placeholder="#12"
            required
          />
        </div>
        <button type="submit" className="btn" disabled={pending}>
          {pending ? t.loading : t.submit}
        </button>
      </form>
      <div className={styles.trackOutput} aria-live="polite">
        {result?.ok === false && <p className="notice notice-error">{t.errors[result.error]}</p>}
        {result?.ok && <TrackedOrderCard order={result.order} t={t} units={units} />}
      </div>
    </>
  );
}

function TrackedOrderCard({
  order,
  t,
  units,
}: {
  order: TrackedOrder;
  t: TrackTexts;
  units: UnitLabels;
}) {
  const current = PROGRESS.findIndex((status) => status === order.status);
  return (
    <div className={styles.trackResult}>
      <p className={styles.trackHead}>
        <strong>#{order.number}</strong>
        <span className="muted">
          {t.sentAt}: {order.createdAt}
        </span>
      </p>
      {current >= 0 ? (
        <ol className={styles.progress}>
          {PROGRESS.map((status, i) => (
            <li
              key={status}
              className={i <= current ? styles.progressDone : undefined}
              aria-current={i === current ? 'step' : undefined}
            >
              {t.statuses[status].label}
            </li>
          ))}
        </ol>
      ) : (
        <p className="badge">{t.statuses[order.status].label}</p>
      )}
      <p>{t.statuses[order.status].text}</p>
      <ul className={styles.trackItems}>
        {order.items.map((item, i) => (
          <li key={i}>
            {item.name} — {formatQuantity(item.quantity, item.unit, units)}
          </li>
        ))}
      </ul>
    </div>
  );
}
