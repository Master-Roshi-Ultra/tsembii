import type { ReactNode } from 'react';
import styles from './home.module.css';

/** Нүүрний нэг хэсэг: цэсний anchor (id), гарчиг, товч тайлбар. `dark` — бараан тууз. */
export function Section({
  id,
  title,
  lead,
  dark = false,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${styles.section} ${dark ? styles.sectionDark : ''}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="container">
        <header className={styles.sectionHeader}>
          <h2 id={`${id}-title`}>{title}</h2>
          {lead && <p className={styles.sectionLead}>{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
