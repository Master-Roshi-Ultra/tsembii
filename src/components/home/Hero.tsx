import { imageUrl } from '@/lib/images';
import type { PublicImage } from '@/lib/public-data';
import styles from './home.module.css';

/** Зурган дэвсгэр + бараан сүүдэр; зураг ороогүй үед бараан дэвсгэр хэвээр харагдана. */
export function Hero({ image }: { image: PublicImage }) {
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
          Цэвэрлэгээг бидэнд.
          <br />
          <span>Чөлөөт цагаа өөртөө.</span>
        </h1>
        <p className={styles.heroLead}>Хивс, буйдан, матрас, сандлын цэвэрлэгээ</p>
        <div className={styles.heroActions}>
          <a href="#services" className="btn btn-light">
            Үйлчилгээгээ сонгох <span aria-hidden="true">→</span>
          </a>
          <a href="#prices" className="btn btn-outline-light">
            Үнэ харах
          </a>
        </div>
        <p className={styles.heroNote}>
          Үнийг урьдчилан харна <span aria-hidden="true">•</span> Онлайнаар хүсэлт илгээнэ
        </p>
      </div>
    </section>
  );
}
