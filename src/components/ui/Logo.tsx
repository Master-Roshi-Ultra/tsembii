import styles from './Logo.module.css';

/** Дугуй тэмдэг, хүсвэл хажууд нь «Цэмбий» бичиг */
export function Logo({
  size = 'sm',
  showName = false,
}: {
  size?: 'sm' | 'lg';
  showName?: boolean;
}) {
  return (
    <span className={`${styles.logo} ${styles[size]}`}>
      <img src="/logo.webp" alt="" width={320} height={320} className={styles.mark} />
      {showName && <span className={styles.name}>Цэмбий</span>}
    </span>
  );
}
