import { Logo } from '@/components/ui/Logo';
import styles from './home.module.css';
import { NAV } from './nav';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <a href="#top" className={styles.logoLink} aria-label="Цэмбий — нүүр">
          <Logo />
        </a>
        <nav aria-label="Үндсэн цэс" className={styles.nav}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#services" className="btn btn-gold btn-sm">
          Захиалах <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
