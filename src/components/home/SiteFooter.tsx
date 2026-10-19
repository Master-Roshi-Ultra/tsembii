import { Logo } from '@/components/ui/Logo';
import { telHref } from '@/lib/public-data';
import styles from './SiteFooter.module.css';
import { NAV, SOCIAL_LINKS } from './nav';

type Link = { href: string; label: string; external?: boolean };

function FooterColumn({ title, links }: { title: string; links: Link[] }) {
  if (!links.length) return null;
  return (
    <nav aria-label={title} className={styles.column}>
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <a href={link.href}>{link.label}</a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z"
    />
  </svg>
);

export function SiteFooter({ phones, services }: { phones: string[]; services: string[] }) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo showName />
            <p>Хивс, буйдан, матрас, сандлын цэвэрлэгээ — сагслаад хүсэлтээ илгээнэ үү.</p>
            {phones.length > 0 && (
              <ul className={styles.contacts}>
                {phones.map((phone) => (
                  <li key={phone}>
                    <a href={telHref(phone)}>
                      <PhoneIcon />
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <FooterColumn
            title="Үйлчилгээ"
            links={services.map((name) => ({ href: '#services', label: name }))}
          />
          <FooterColumn title="Цэс" links={NAV} />
          <FooterColumn
            title="Сошиал"
            links={SOCIAL_LINKS.map((link) => ({ ...link, external: true }))}
          />
        </div>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Цэмбий. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p>
            Вэбсайтыг{' '}
            <a href="https://www.chameleon.mn/" target="_blank" rel="noopener noreferrer">
              Chameleon
            </a>{' '}
            хийсэн
          </p>
        </div>
      </div>
    </footer>
  );
}
