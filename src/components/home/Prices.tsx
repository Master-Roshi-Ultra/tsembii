import { getDictionary } from '@/i18n';
import { formatPrice } from '@/lib/money';
import type { PublicService } from '@/lib/public-data';
import styles from './home.module.css';
import { Section } from './Section';

export async function Prices({ services }: { services: PublicService[] }) {
  if (!services.length) return null;
  const t = await getDictionary();
  return (
    <Section id="prices" title={t.prices.title} lead={t.prices.lead}>
      <table className={styles.priceTable}>
        <thead>
          <tr>
            <th scope="col">{t.prices.service}</th>
            <th scope="col">{t.prices.unit}</th>
            <th scope="col">{t.prices.price}</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{t.units[service.unit]}</td>
              <td>{service.price === null ? t.prices.onRequest : formatPrice(service.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
