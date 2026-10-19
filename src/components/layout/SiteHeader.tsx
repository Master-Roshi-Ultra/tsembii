import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import styles from './SiteHeader.module.css';
import { NAV } from './nav';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/#top" className={styles.logoLink} aria-label="Цэмбий — нүүр">
          <Logo />
        </Link>
        <nav aria-label="Үндсэн цэс" className={styles.nav}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
