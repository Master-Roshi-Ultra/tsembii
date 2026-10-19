import type { Metadata } from 'next';
import { getDictionary } from '@/i18n';
import { OrderFlow } from './OrderFlow';
import styles from './order.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: `${t.order.title} — ${t.brand}`, robots: { index: false } };
}

export default async function OrderPage() {
  const t = await getDictionary();
  return (
    <div className={`container ${styles.page}`}>
      <h1>{t.order.title}</h1>
      <OrderFlow t={t.order} units={t.units} onRequest={t.prices.onRequest} />
    </div>
  );
}
