import { getDictionary } from '@/i18n';
import styles from './home.module.css';
import { Section } from './Section';

export async function OrderSteps() {
  const t = await getDictionary();
  return (
    <Section id="steps" title={t.steps.title} dark>
      <ol className={styles.steps}>
        {t.steps.items.map((step, i) => (
          <li key={step.title}>
            <span className={styles.stepNumber} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
