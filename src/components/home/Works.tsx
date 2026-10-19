import { Picture } from '@/components/ui/Picture';
import { getDictionary } from '@/i18n';
import type { PublicWork } from '@/lib/public-data';
import styles from './home.module.css';
import { Section } from './Section';

export async function Works({ works }: { works: PublicWork[] }) {
  const t = await getDictionary();
  return (
    <Section id="works" title={t.works.title} lead={t.works.lead}>
      {works.length ? (
        <ul className={styles.workList}>
          {works.map((work) => (
            <li key={work.id} className={styles.workCard}>
              <div className={styles.workPair}>
                <figure>
                  <Picture image={work.beforeImage} alt={`${work.title} — ${t.works.before}`} />
                  <figcaption className={styles.before}>{t.works.before}</figcaption>
                </figure>
                <figure>
                  <Picture image={work.afterImage} alt={`${work.title} — ${t.works.after}`} />
                  <figcaption className={styles.after}>{t.works.after}</figcaption>
                </figure>
              </div>
              <h3>{work.title}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{t.works.empty}</p>
      )}
    </Section>
  );
}
