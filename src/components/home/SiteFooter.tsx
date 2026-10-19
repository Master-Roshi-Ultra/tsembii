import { Logo } from '@/components/ui/Logo';
import styles from './home.module.css';
import { NAV } from './nav';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Logo size="lg" />
            <p>Хивс, буйдан, матрас, сандлын цэвэрлэгээ.</p>
          </div>
          <nav aria-label="Хөлийн цэс" className={styles.footerNav}>
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} Цэмбий</p>
      </div>
    </footer>
  );
}
