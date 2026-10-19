import { Picture } from '@/components/ui/Picture';
import type { PublicWork } from '@/lib/public-data';
import styles from './home.module.css';
import { Section } from './Section';

export function Works({ works }: { works: PublicWork[] }) {
  return (
    <Section id="works" title="Ажлын үр дүн" lead="Бидний хийсэн ажлын өмнөх ба дараах зураг.">
      {works.length ? (
        <ul className={styles.workList}>
          {works.map((work) => (
            <li key={work.id} className={styles.workCard}>
              <div className={styles.workPair}>
                <figure>
                  <Picture image={work.beforeImage} alt={`${work.title} — өмнө`} />
                  <figcaption>Өмнө</figcaption>
                </figure>
                <figure>
                  <Picture image={work.afterImage} alt={`${work.title} — дараа`} />
                  <figcaption>Дараа</figcaption>
                </figure>
              </div>
              <h3>{work.title}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Ажлын зураг удахгүй нэмэгдэнэ.</p>
      )}
    </Section>
  );
}
