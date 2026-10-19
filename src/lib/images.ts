import path from 'node:path';

/** Зургийн файл: <UPLOAD_DIR>/<key>. key нь санамсаргүй нэр + .webp */
export const IMAGE_KEY = /^[a-z0-9]{16,64}\.webp$/;

export const uploadDir = () =>
  path.resolve(/* turbopackIgnore: true */ process.env.UPLOAD_DIR || './uploads');

export const imageUrl = (key: string) => `/images/${key}`;
