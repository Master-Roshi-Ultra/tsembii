import type { Metadata } from 'next';
import { getDictionary } from '@/i18n';
import type { LegalSection } from '@/i18n/mn';
import styles from './LegalPage.module.css';

export type LegalKey = 'privacy' | 'terms';

/** Сүүлд шинэчилсэн огноо — агуулга өөрчлөгдөхөд шинэчилнэ */
const UPDATED = '2026-10-19';

export async function legalMetadata(key: LegalKey): Promise<Metadata> {
  const t = await getDictionary();
  return { title: `${t.legal[key].title} — ${t.brand}` };
}

/** Нууцлалын бодлого, үйлчилгээний нөхцөл: толь бичгийн хэсгүүдээс бүрдэнэ */
export async function LegalPage({ page }: { page: LegalKey }) {
  const t = await getDictionary();
  const { title, intro, sections } = t.legal[page];
  return (
    <article className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>{title}</h1>
        <p className="muted">
          {t.legal.updated}: {UPDATED}
        </p>
      </header>
      <div className={styles.body}>
        <p>{intro}</p>
        {(sections as LegalSection[]).map((section) => (
          <section key={section.title} className={styles.body}>
            <h2>{section.title}</h2>
            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.text?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
