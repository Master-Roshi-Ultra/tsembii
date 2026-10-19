import Link from 'next/link';
import styles from './order.module.css';
import type { OrderTexts } from './texts';

/** Хүсэлт хүлээн авсан — баталгаажсан захиалга, төлбөр мэт харуулахгүй. */
export function DoneStep({ t, number }: { t: OrderTexts['done']; number: number }) {
  return (
    <section className={`card stack ${styles.done}`} role="status">
      <span className={styles.doneIcon} aria-hidden="true">
        ✓
      </span>
      <h2>{t.title}</h2>
      <p>{t.text}</p>
      <p>
        {t.number}: <strong className={styles.number}>#{number}</strong>
      </p>
      <div>
        <Link href="/" className="btn btn-secondary">
          {t.home}
        </Link>
      </div>
    </section>
  );
}
