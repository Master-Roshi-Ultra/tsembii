import styles from './home.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div>
          <p className={styles.logo}>Цэмбий</p>
          <p className="muted">Хивс, буйдан, матрас, сандлын цэвэрлэгээ.</p>
        </div>
        <p className="muted">© {new Date().getFullYear()} Цэмбий</p>
      </div>
    </footer>
  );
}
