import type { ReactNode } from 'react';
import styles from './home.module.css';

/** Нүүрний нэг хэсэг: цэсний anchor (id), гарчиг, товч тайлбар */
export function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className="container">
        <header className={styles.sectionHeader}>
          <h2 id={`${id}-title`}>{title}</h2>
          {lead && <p className="muted">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
