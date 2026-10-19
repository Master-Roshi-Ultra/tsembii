'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Quote } from '@/lib/cart';
import { clearCart, removeFromCart, useCartItems } from '@/lib/cart-store';
import { checkVerificationAction, quoteCartAction } from './actions';
import { AddressStep } from './AddressStep';
import { CartStep } from './CartStep';
import { DoneStep } from './DoneStep';
import styles from './order.module.css';
import { PhoneStep } from './PhoneStep';
import type { OrderTexts, UnitLabels } from './texts';

type Step = 'cart' | 'phone' | 'address' | 'done';
const STEPS = ['cart', 'phone', 'address'] as const;

/** Сагс → утас батлах → хаяг → амжилт. Үнэ, утсыг сервер л шийднэ. */
export function OrderFlow({
  t,
  units,
  onRequest,
}: {
  t: OrderTexts;
  units: UnitLabels;
  onRequest: string;
}) {
  const items = useCartItems();
  const [step, setStep] = useState<Step>('cart');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [removedNote, setRemovedNote] = useState(false);
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  // Нэг оролдлогын түлхүүр: давхар дарсан ч нэг л захиалга үүснэ.
  const [requestKey] = useState(() => crypto.randomUUID());

  // Сагс өөрчлөгдөх бүрт серверийн одоогийн үнээр дахин бодно.
  useEffect(() => {
    if (!items.length) return;
    let cancelled = false;
    quoteCartAction(items).then((next) => {
      if (cancelled) return;
      setQuote(next);
      if (next.removed.length) {
        setRemovedNote(true);
        removeFromCart(...next.removed);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  // PhoneStep-ийн polling effect дахин эхлэхгүйн тулд тогтвортой reference
  const onVerified = useCallback((verified: string) => {
    setPhone(verified);
    setStep('address');
  }, []);

  async function continueFromCart() {
    const check = await checkVerificationAction();
    if (check.status === 'verified' && check.phone) {
      setPhone(check.phone);
      setStep('address');
    } else {
      setStep('phone');
    }
  }

  if (step === 'done' && orderNumber !== null) return <DoneStep t={t.done} number={orderNumber} />;

  // Сагс хоосон бол серверийн хуучин тооцоог харуулахгүй.
  const current = items.length ? quote : { lines: [], total: 0, hasUnpriced: false, removed: [] };

  return (
    <div className={styles.flow}>
      <ol className={styles.steps} aria-label={t.title}>
        {STEPS.map((name, i) => (
          <li key={name} aria-current={step === name ? 'step' : undefined}>
            <span>{i + 1}</span> {t.steps[name]}
          </li>
        ))}
      </ol>

      {step === 'cart' && (
        <CartStep
          t={t.cart}
          units={units}
          onRequest={onRequest}
          items={items}
          quote={current}
          removedNote={removedNote}
          onContinue={continueFromCart}
        />
      )}
      {step === 'phone' && (
        <PhoneStep
          t={t.phone}
          errors={t.errors}
          onBack={() => setStep('cart')}
          onVerified={onVerified}
        />
      )}
      {step === 'address' && current && (
        <AddressStep
          t={t}
          units={units}
          onRequest={onRequest}
          quote={current}
          phone={phone}
          requestKey={requestKey}
          onPriceChanged={setQuote}
          onNotVerified={() => setStep('phone')}
          onDone={(number) => {
            clearCart();
            setOrderNumber(number);
            setStep('done');
          }}
        />
      )}
    </div>
  );
}
