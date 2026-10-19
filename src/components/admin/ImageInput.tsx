import { CheckboxField } from '@/components/ui/Field';
import { imageUrl } from '@/lib/images';
import styles from './ImageInput.module.css';

type CurrentImage = { key: string } | null;

/**
 * Зураг сонгох талбар. Одоогийн зургийг харуулж, `removable` бол «Зураг устгах» сонголттой.
 * Сервер талд `saveImage(formData.get(name))`-ээр уншина.
 */
export function ImageInput({
  name = 'image',
  id,
  label = 'Зураг',
  current = null,
  required = false,
  removable = false,
}: {
  name?: string;
  id: string;
  label?: string;
  current?: CurrentImage;
  required?: boolean;
  removable?: boolean;
}) {
  return (
    <div className={`field ${styles.imageInput}`}>
      <label htmlFor={id}>{label}</label>
      {current && <img src={imageUrl(current.key)} alt="" className={styles.preview} />}
      <input
        id={id}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required={required && !current}
        className="input"
      />
      <span className="muted">JPG, PNG, WebP — 8 MB хүртэл.</span>
      {current && removable && <CheckboxField name={`${name}Remove`} label="Зураг устгах" />}
    </div>
  );
}
