import styles from './home.module.css';
import { Section } from './Section';

const STEPS = [
  { title: 'Үйлчилгээ сагслах', text: 'Хэрэгтэй үйлчилгээ, хэмжээгээ сонгоно.' },
  { title: 'Утсаа батлах', text: 'Дугаараасаа Verify.mn руу SMS илгээж баталгаажуулна.' },
  { title: 'Хаягаа оруулж илгээх', text: 'Бид холбогдож үнэ, цагийг тохирно.' },
];

export function OrderSteps() {
  return (
    <Section id="steps" title="Захиалах алхам">
      <ol className={styles.steps}>
        {STEPS.map((step, i) => (
          <li key={step.title}>
            <span className={styles.stepNumber} aria-hidden="true">
              {i + 1}
            </span>
            <h3>{step.title}</h3>
            <p className="muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
