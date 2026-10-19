import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { ImageError, processImage } from './image-processing';

const png = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 3, background: '#888' } })
    .png()
    .toBuffer();

describe('processImage', () => {
  it('том зургийг 2000px болгож WebP хэлбэрт оруулна', async () => {
    const result = await processImage(await png(3000, 1500));
    expect([result.width, result.height]).toEqual([2000, 1000]);
    expect((await sharp(result.data).metadata()).format).toBe('webp');
  });

  it('жижиг зургийг томруулахгүй', async () => {
    const result = await processImage(await png(400, 300));
    expect([result.width, result.height]).toEqual([400, 300]);
  });

  it('SVG болон зураг биш файлыг татгалзана', async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>');
    await expect(processImage(svg)).rejects.toThrow(ImageError);
    await expect(processImage(Buffer.from('hello'))).rejects.toThrow(ImageError);
  });
});
