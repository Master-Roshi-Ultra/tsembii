import sharp from 'sharp';

export const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
const MAX_SIDE = 2000;
const ACCEPTED = new Set(['jpeg', 'png', 'webp']);

export class ImageError extends Error {}

/**
 * Файлын нэр, MIME-д итгэхгүй — агуулгыг Sharp-аар уншиж шалгана.
 * EXIF-ийн эргэлтийг засаж, 2000px-ээс томыг багасгаад WebP болгоно (EXIF, GPS хасагдана).
 */
export async function processImage(input: Buffer) {
  if (input.byteLength > IMAGE_MAX_BYTES) throw new ImageError('Зураг 8 MB-аас том байна.');

  const meta = await sharp(input)
    .metadata()
    .catch(() => null);
  if (!meta?.format || !ACCEPTED.has(meta.format)) {
    throw new ImageError('Зөвхөн JPG, PNG, WebP зураг оруулна уу.');
  }

  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}
