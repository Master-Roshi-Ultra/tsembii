import { getDictionary } from '@/i18n';
import { type PublicSettings, telHref } from '@/lib/public-data';
import styles from './home.module.css';
import { Section } from './Section';

export async function Contact({ settings }: { settings: PublicSettings | null }) {
  const t = await getDictionary();
  return (
    <Section id="contact" title={t.contact.title}>
      <div className={styles.contact}>
        <dl className={styles.contactList}>
          {settings?.phones.length ? (
            <div>
              <dt>{t.contact.phone}</dt>
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
              <dt>{t.contact.hours}</dt>
              <dd>{settings.hours}</dd>
            </div>
          )}
          {settings?.area && (
            <div>
              <dt>{t.contact.area}</dt>
              <dd>{settings.area}</dd>
            </div>
          )}
        </dl>
        <div>
          <a href="#services" className="btn">
            {t.contact.cta}
          </a>
        </div>
      </div>
    </Section>
  );
}
