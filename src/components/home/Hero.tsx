import { Picture } from '@/components/ui/Picture';
import type { PublicImage } from '@/lib/public-data';
import styles from './home.module.css';

export function Hero({ image }: { image: PublicImage }) {
  return (
    <section id="top" className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroText}>
          <h1>Цэвэрхэн гэр. Тайван амьдрал.</h1>
          <p className="muted">
            Хивс, буйдан, матрас, сандлын цэвэрлэгээгээ сонгоод хүсэлтээ илгээнэ үү. Бид тантай
            холбогдож үнэ, цагийг тохирно.
          </p>
          <div>
            <a href="#services" className="btn">
              Үйлчилгээгээ сонгох
            </a>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Picture image={image} alt="Цэвэрхэн гэрийн интерьер" priority />
        </div>
      </div>
    </section>
  );
}
