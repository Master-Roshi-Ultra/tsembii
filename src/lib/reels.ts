/** Reel-ийн эх сурвалж; зөвхөн эдгээр сайтын embed-ийг зөвшөөрнө (дурын iframe биш). */
export type ReelPlatform = 'facebook' | 'instagram';

export type ReelLink = { platform: ReelPlatform; url: string };

const FACEBOOK_HOSTS = ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'web.facebook.com'];
const INSTAGRAM_HOSTS = ['instagram.com', 'www.instagram.com'];

/**
 * Хэрэглэгчийн хуулсан Facebook/Instagram reel линкийг шалгаж, нэг хэвд оруулна.
 * Буруу эсвэл өөр сайтын линк бол `null`.
 */
export function parseReelUrl(input: string): ReelLink | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const host = url.hostname.toLowerCase();
  if (FACEBOOK_HOSTS.includes(host)) {
    const reel = url.pathname.match(/^\/reel\/(\d+)\/?$/);
    if (reel) return { platform: 'facebook', url: `https://www.facebook.com/reel/${reel[1]}` };
    const video = url.pathname.match(/^\/[\w.-]+\/videos\/(?:[\w.-]+\/)?(\d+)\/?$/);
    if (video) return { platform: 'facebook', url: `https://www.facebook.com/reel/${video[1]}` };
    const watch = url.pathname.match(/^\/watch\/?$/) && url.searchParams.get('v');
    if (watch && /^\d+$/.test(watch)) {
      return { platform: 'facebook', url: `https://www.facebook.com/reel/${watch}` };
    }
    return null;
  }
  if (INSTAGRAM_HOSTS.includes(host)) {
    const reel = url.pathname.match(/^\/(?:reels?|p)\/([\w-]+)\/?$/);
    if (reel) return { platform: 'instagram', url: `https://www.instagram.com/reel/${reel[1]}/` };
  }
  return null;
}

/** Хадгалсан (parseReelUrl-аар цэвэрлэсэн) линкээс iframe-ийн хаяг. */
export function reelEmbedUrl({ platform, url }: ReelLink): string {
  return platform === 'facebook'
    ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=320`
    : `${url}embed/`;
}
