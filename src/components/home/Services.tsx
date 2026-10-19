import { Picture } from '@/components/ui/Picture';
import { formatPrice, UNIT_LABELS } from '@/lib/money';
import type { PublicService } from '@/lib/public-data';
import styles from './home.module.css';
import { Section } from './Section';

export function Services({ services }: { services: PublicService[] }) {
  return (
    <Section id="services" title="Үйлчилгээ" lead="Нэг буюу хэд хэдэн үйлчилгээ сонгож болно.">
      {services.length ? (
        <ul className={styles.serviceGrid}>
          {services.map((service) => (
            <li key={service.id} className={styles.serviceCard}>
              <Picture image={service.image} alt={service.name} placeholder={service.name[0]} />
              <div className={styles.serviceBody}>
                <h3>{service.name}</h3>
                {service.description && <p className="muted">{service.description}</p>}
                <p className={styles.servicePrice}>
                  {formatPrice(service.price)}
                  {service.price !== null && (
                    <span className="muted"> / {UNIT_LABELS[service.unit]}</span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Үйлчилгээ удахгүй нэмэгдэнэ.</p>
      )}
    </Section>
  );
}
