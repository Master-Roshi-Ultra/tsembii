import styles from './Logo.module.css';

/** Дугуй тэмдэг, хүсвэл хажууд нь «Цэмбий» бичиг */
export function Logo({ showName = false }: { showName?: boolean }) {
  return (
    <span className={styles.logo}>
      <img src="/logo.webp" alt="" width={320} height={320} className={styles.mark} />
      {showName && <span className={styles.name}>Цэмбий</span>}
    </span>
  );
}
