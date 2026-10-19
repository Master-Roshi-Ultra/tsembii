import { imageUrl } from '@/lib/images';
import type { PublicImage } from '@/lib/public-data';
import styles from './Picture.module.css';

/** Админы оруулсан зураг; ороогүй бол эвдрэлгүй зөөлөн дэвсгэр (placeholder). */
export function Picture({
  image,
  alt,
  placeholder,
  priority = false,
}: {
  image: PublicImage;
  alt: string;
  /** Зураггүй үед дунд нь харагдах товч тэмдэг (жишээ нь нэрийн эхний үсэг) */
  placeholder?: string;
  priority?: boolean;
}) {
  if (!image) {
    return (
      <span className={styles.placeholder} aria-hidden="true">
        {placeholder}
      </span>
    );
  }
  return (
    <img
      className={styles.image}
      src={imageUrl(image.key)}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
}
