import { setLocale } from '@/i18n/actions';
import { getDictionary, getLocale, LOCALES } from '@/i18n';
import styles from './SiteFooter.module.css';

/** MN / EN — JavaScript-гүйгээр ч ажиллах энгийн маягт */
export async function LanguageSwitch() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <form action={setLocale} className={styles.languages} aria-label={t.footer.language}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="submit"
          name="locale"
          value={code}
          aria-pressed={code === locale}
          lang={code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </form>
  );
}
