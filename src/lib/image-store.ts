import 'server-only';
import { randomBytes } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { db } from './db';
import { FormError } from './form';
import { ImageError, processImage } from './image-processing';
import { uploadDir } from './images';

/** Маягтын файлыг (сонгоогүй бол null) боловсруулж хадгалаад Image бичлэгийн id-г буцаана. */
export async function saveImage(file: FormDataEntryValue | null): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  const processed = await processImage(Buffer.from(await file.arrayBuffer())).catch((err) => {
    throw err instanceof ImageError ? new FormError(err.message) : err;
  });

  // Санамсаргүй, өөрчлөгддөггүй нэр — cache-д найдвартай, таахад хэцүү.
  const key = `${randomBytes(16).toString('hex')}.webp`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), key), processed.data);

  const image = await db.image.create({
    data: { key, width: processed.width, height: processed.height, bytes: processed.data.length },
    select: { id: true },
  });
  return image.id;
}

/** Өөр бичлэгт ашиглагдаагүй бол зургийг файлтай нь устгана. */
export async function deleteImageIfUnused(id: string | null | undefined) {
  if (!id) return;
  const image = await db.image.findUnique({
    where: { id },
    select: {
      key: true,
      _count: { select: { services: true, worksBefore: true, worksAfter: true, settings: true } },
    },
  });
  if (!image || Object.values(image._count).some((n) => n > 0)) return;

  await db.image.delete({ where: { id } });
  // Файл аль хэдийн байхгүй байж болно — бичлэг устсан нь хангалттай.
  await unlink(path.join(uploadDir(), image.key)).catch(() => undefined);
}
