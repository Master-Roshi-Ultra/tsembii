import { formatPrice, UNIT_LABELS } from '@/lib/money';
import type { PublicService } from '@/lib/public-data';
import styles from './home.module.css';
import { Section } from './Section';

export function Prices({ services }: { services: PublicService[] }) {
  if (!services.length) return null;
  return (
    <Section
      id="prices"
      title="Үнийн мэдээлэл"
      lead="Урьдчилсан үнэ. Эцсийн үнийг ажилтан холбогдож тохирно."
    >
      <table className={styles.priceTable}>
        <thead>
          <tr>
            <th scope="col">Үйлчилгээ</th>
            <th scope="col">Нэгж</th>
            <th scope="col">Үнэ</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{UNIT_LABELS[service.unit]}</td>
              <td>{formatPrice(service.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
