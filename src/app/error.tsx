'use client';

import styles from './status-page.module.css';

/** Нийтийн хэсгийн алдаа. Client талд хэлний cookie уншихгүй тул хоёр хэлээр. */
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className={styles.page}>
      <h1>Алдаа гарлаа · Something went wrong</h1>
      <p>Түр хүлээгээд дахин оролдоно уу. · Please try again in a moment.</p>
      <button type="button" className="btn btn-light" onClick={reset}>
        Дахин оролдох · Try again
      </button>
    </main>
  );
}
