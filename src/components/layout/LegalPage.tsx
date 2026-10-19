import type { ReactNode } from 'react';
import styles from './LegalPage.module.css';

/** Нууцлалын бодлого, үйлчилгээний нөхцөл зэрэг текст хуудас */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  /** Сүүлд шинэчилсэн огноо (YYYY-MM-DD) */
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>{title}</h1>
        <p className="muted">Сүүлд шинэчилсэн: {updated}</p>
      </header>
      <div className={styles.body}>{children}</div>
    </article>
  );
}
