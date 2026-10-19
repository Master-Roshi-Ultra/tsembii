import styles from './Logo.module.css';

/** Дугуй тэмдэг + «Цэмбий» бичиг. Тэмдэг жижиг үед доторх бичиг уншигдахгүй тул нэрийг хажууд нь бичнэ. */
export function Logo({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <span className={`${styles.logo} ${styles[size]}`}>
      <img src="/logo.webp" alt="" width={320} height={320} className={styles.mark} />
      <span className={styles.name}>Цэмбий</span>
    </span>
  );
}
