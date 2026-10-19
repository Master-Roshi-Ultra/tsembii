import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { getDictionary } from '@/i18n';
import { telHref } from '@/lib/public-data';
import { LanguageSwitch } from './LanguageSwitch';
import styles from './SiteFooter.module.css';
import { BUILDER, LEGAL_LINKS, NAV, SOCIAL_LINKS } from './nav';

type FooterLink = { href: string; label: string; external?: boolean };

/** Гадаад холбоос шинэ табд ↗ тэмдэгтэй, дотоод нь Next-ийн Link */
function FooterLinkItem({ href, label, external }: FooterLink) {
  if (!external) return <Link href={href}>{label}</Link>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  if (!links.length) return null;
  return (
    <nav aria-label={title} className={styles.column}>
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <FooterLinkItem {...link} />
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

export async function SiteFooter({ phones, services }: { phones: string[]; services: string[] }) {
  const t = await getDictionary();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo showName />
            <p>{t.footer.tagline}</p>
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
            title={t.footer.services}
            links={services.map((name) => ({ href: '/#services', label: name }))}
          />
          <FooterColumn
            title={t.footer.menu}
            links={NAV.map((item) => ({ href: item.href, label: t.nav[item.key] }))}
          />
          <FooterColumn
            title={t.footer.social}
            links={SOCIAL_LINKS.map((link) => ({ ...link, external: true }))}
          />
        </div>
        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} {t.footer.rights}
          </p>
          <div className={styles.bottomLinks}>
            <LanguageSwitch />
            {LEGAL_LINKS.map((link) => (
              <FooterLinkItem key={link.href} href={link.href} label={t.legal[link.key].title} />
            ))}
            <span>
              {t.footer.poweredBy} <FooterLinkItem {...BUILDER} external />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
