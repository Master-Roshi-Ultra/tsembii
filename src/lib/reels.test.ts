import { describe, expect, it } from 'vitest';
import { parseReelUrl, reelEmbedUrl } from './reels';

describe('parseReelUrl', () => {
  it('Facebook reel, video, watch линкийг нэг хэвд оруулна', () => {
    const fb = { platform: 'facebook', url: 'https://www.facebook.com/reel/123456' };
    expect(parseReelUrl('https://www.facebook.com/reel/123456/?mibextid=abc')).toEqual(fb);
    expect(parseReelUrl(' https://m.facebook.com/reel/123456 ')).toEqual(fb);
    expect(parseReelUrl('https://www.facebook.com/forexideamongolia/videos/123456/')).toEqual(fb);
    expect(parseReelUrl('https://www.facebook.com/watch/?v=123456')).toEqual(fb);
  });

  it('Instagram reel ба post линкийг хүлээн авна', () => {
    const ig = { platform: 'instagram', url: 'https://www.instagram.com/reel/C1a-B_2/' };
    expect(parseReelUrl('https://www.instagram.com/reel/C1a-B_2/?igsh=xyz')).toEqual(ig);
    expect(parseReelUrl('https://instagram.com/reels/C1a-B_2')).toEqual(ig);
    expect(parseReelUrl('https://www.instagram.com/p/C1a-B_2/')).toEqual(ig);
  });

  it('өөр сайт, буруу зам, javascript: линкийг татгалзана', () => {
    for (const bad of [
      '',
      'not a url',
      'javascript:alert(1)',
      'https://evil.com/reel/123',
      'https://facebook.com.evil.com/reel/123',
      'https://www.facebook.com/forexideamongolia',
      'https://www.instagram.com/forexideamongolia/',
    ]) {
      expect(parseReelUrl(bad)).toBeNull();
    }
  });
});

describe('reelEmbedUrl', () => {
  it('платформын embed хаягийг үүсгэнэ', () => {
    expect(
      reelEmbedUrl({ platform: 'facebook', url: 'https://www.facebook.com/reel/1' }),
    ).toContain('plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1');
    expect(
      reelEmbedUrl({ platform: 'instagram', url: 'https://www.instagram.com/reel/abc/' }),
    ).toBe('https://www.instagram.com/reel/abc/embed/');
  });
});
