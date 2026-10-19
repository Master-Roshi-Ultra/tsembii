import { getDictionary } from '@/i18n';
import type { PublicReel } from '@/lib/public-data';
import { reelEmbedUrl } from '@/lib/reels';
import styles from './home.module.css';
import { Section } from './Section';

/** Facebook/Instagram reel-үүд. Reel байхгүй бол хэсгийг огт харуулахгүй. */
export async function Reels({ reels }: { reels: PublicReel[] }) {
  if (!reels.length) return null;
  const t = await getDictionary();
  return (
    <Section id="reels" title={t.reels.title} lead={t.reels.lead}>
      <ul className={styles.reelList}>
        {reels.map((reel, i) => (
          <li key={reel.id} className={styles.reel}>
            <iframe
              src={reelEmbedUrl(reel)}
              title={`${t.reels.frame} ${i + 1}`}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
