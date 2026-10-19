import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { IMAGE_KEY, uploadDir } from '@/lib/images';

/** Оруулсан зургийг Volume-оос уншиж өгнө. Нэр нь өөрчлөгддөггүй тул удаан cache-лэнэ. */
export async function GET(_: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!IMAGE_KEY.test(key)) return new Response('Олдсонгүй', { status: 404 });

  const file = await readFile(path.join(uploadDir(), key)).catch(() => null);
  if (!file) return new Response('Олдсонгүй', { status: 404 });

  return new Response(new Uint8Array(file), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
