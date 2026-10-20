import { getDictionary } from '@/i18n';
import styles from './home.module.css';
import { TrackForm } from './TrackForm';

/** Нүүрний зургийн доод ирмэг дээр давхарласан «Захиалгаа шалгах» карт */
export async function OrderTrack() {
  const t = await getDictionary();
  return (
    <section id="track" className={styles.track} aria-labelledby="track-title">
      <div className="container">
        <div className={styles.trackCard}>
          <div className={styles.trackIntro}>
            <h2 id="track-title">{t.track.title}</h2>
            <p className="muted">{t.track.lead}</p>
          </div>
          <TrackForm t={t.track} units={t.units} />
        </div>
      </div>
    </section>
  );
}
