import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { getLocale } from '@/i18n';
import styles from './status-page.module.css';

const TEXT = {
  mn: { title: 'Хуудас олдсонгүй', home: 'Нүүр хуудас руу буцах' },
  en: { title: 'Page not found', home: 'Back to home page' },
};

export default async function NotFound() {
  const t = TEXT[await getLocale()];
  return (
    <main className={styles.page}>
      <Logo showName />
      <h1>{t.title}</h1>
      <Link href="/" className="btn btn-light">
        {t.home}
      </Link>
    </main>
  );
}
