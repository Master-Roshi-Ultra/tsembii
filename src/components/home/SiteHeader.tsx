import styles from './home.module.css';

const NAV = [
  { href: '#services', label: 'Үйлчилгээ' },
  { href: '#prices', label: 'Үнэ' },
  { href: '#works', label: 'Ажлын үр дүн' },
  { href: '#contact', label: 'Холбоо барих' },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <a href="#top" className={styles.logo}>
          Цэмбий
        </a>
        <nav aria-label="Үндсэн цэс" className={styles.nav}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
