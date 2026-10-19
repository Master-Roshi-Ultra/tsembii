import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { getDictionary } from '@/i18n';
import styles from './SiteHeader.module.css';
import { NAV } from './nav';

export async function SiteHeader() {
  const t = await getDictionary();
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/#top" className={styles.logoLink} aria-label={t.nav.home}>
          <Logo />
        </Link>
        <nav aria-label={t.nav.label} className={styles.nav}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
