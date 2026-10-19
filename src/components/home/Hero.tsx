import { getDictionary } from '@/i18n';
import { imageUrl } from '@/lib/images';
import type { PublicImage } from '@/lib/public-data';
import styles from './home.module.css';

/** Зурган дэвсгэр + бараан сүүдэр; зураг ороогүй үед бараан дэвсгэр хэвээр харагдана. */
export async function Hero({ image }: { image: PublicImage }) {
  const t = await getDictionary();
  return (
    <section id="top" className={styles.hero}>
      {image && (
        <img
          className={styles.heroBg}
          src={imageUrl(image.key)}
          width={image.width}
          height={image.height}
          alt=""
          fetchPriority="high"
        />
      )}
      <div className={`container ${styles.heroInner}`}>
        <h1>
          {t.hero.title}
          <br />
          <span>{t.hero.accent}</span>
        </h1>
        <p className={styles.heroLead}>{t.hero.lead}</p>
        <div className={styles.heroActions}>
          <a href="#services" className="btn btn-light">
            {t.hero.cta} <span aria-hidden="true">→</span>
          </a>
          <a href="#prices" className="btn btn-outline-light">
            {t.hero.prices}
          </a>
        </div>
        <p className={styles.heroNote}>{t.hero.note.join(' • ')}</p>
      </div>
    </section>
  );
}
