import { type PublicSettings, telHref } from '@/lib/public-data';
import styles from './home.module.css';
import { Section } from './Section';

export function Contact({ settings }: { settings: PublicSettings | null }) {
  return (
    <Section id="contact" title="Холбоо барих">
      <div className={styles.contact}>
        <dl className={styles.contactList}>
          {settings?.phones.length ? (
            <div>
              <dt>Утас</dt>
              <dd>
                {settings.phones.map((phone) => (
                  <a key={phone} href={telHref(phone)}>
                    {phone}
                  </a>
                ))}
              </dd>
            </div>
          ) : null}
          {settings?.hours && (
            <div>
              <dt>Ажлын цаг</dt>
              <dd>{settings.hours}</dd>
            </div>
          )}
          {settings?.area && (
            <div>
              <dt>Үйлчлэх бүс</dt>
              <dd>{settings.area}</dd>
            </div>
          )}
        </dl>
        <div>
          <a href="#services" className="btn">
            Захиалга үргэлжлүүлэх
          </a>
        </div>
      </div>
    </Section>
  );
}
