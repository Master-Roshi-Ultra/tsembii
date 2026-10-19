import { Picture } from '@/components/ui/Picture';
import { getDictionary } from '@/i18n';
import { formatPrice } from '@/lib/money';
import type { PublicService } from '@/lib/public-data';
import styles from './home.module.css';
import { Section } from './Section';

export async function Services({ services }: { services: PublicService[] }) {
  const t = await getDictionary();
  return (
    <Section id="services" title={t.services.title} lead={t.services.lead}>
      {services.length ? (
        <ul className={styles.serviceGrid}>
          {services.map((service) => (
            <li key={service.id} className={styles.serviceCard}>
              <Picture image={service.image} alt={service.name} placeholder={service.name[0]} />
              <div className={styles.serviceBody}>
                <h3>{service.name}</h3>
                {service.description && <p className="muted">{service.description}</p>}
                <p className={styles.servicePrice}>
                  {service.price === null ? (
                    t.prices.onRequest
                  ) : (
                    <>
                      {formatPrice(service.price)}
                      <span className="muted"> / {t.units[service.unit]}</span>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{t.services.empty}</p>
      )}
    </Section>
  );
}
