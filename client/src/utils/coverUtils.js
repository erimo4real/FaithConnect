import { uploadFile } from '../services/api';

// Sermon cover ("thumbnail") resolution — runs in the ADMIN'S BROWSER at save
// time.
//
// Why the browser: TikTok's oEmbed stopped returning thumbnail_url, and the
// public metadata service that still does (tikwm) blocks datacenter IPs, so
// the hosted server can never fetch a cover. Ordinary networks work fine, so
// the admin panel resolves the cover and uploads it through the normal
// Cloudinary upload endpoint. Covers stay fully automatic — nobody has to
// handle image files.

const TIKWM_ENDPOINT = 'https://www.tikwm.com/api/';
const MAX_COVER_BYTES = 10 * 1024 * 1024;
// Only these types pass the server's upload allowlist; anything else would
// fail the upload, so treat it as "no cover".
const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

// tikwm is a third party — only trust cover URLs on TikTok's own CDN so it can
// never point us at an arbitrary host.
function isTikTokCdnUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && /(^|\.)tiktokcdn(-us)?\.com$/.test(url.hostname);
  } catch {
    return false;
  }
}

function youtubeThumbnail(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|live\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
}

async function fetchTikTokCoverUrl(videoUrl) {
  const res = await fetch(`${TIKWM_ENDPOINT}?url=${encodeURIComponent(videoUrl)}`);
  if (!res.ok) return null;
  const data = await res.json();
  const cover = data?.data?.cover || data?.data?.origin_cover || null;
  return cover && isTikTokCdnUrl(cover) ? cover : null;
}

// Resolve a cover for a video URL and store it on Cloudinary.
// Returns a public image URL, or null when nothing could be resolved
// (deleted video, unsupported platform, network/CORS failure). Never throws —
// saving a sermon must never be blocked by a missing cover.
export async function resolveCoverImage(videoUrl) {
  if (!videoUrl) return null;
  try {
    // YouTube covers are stable public images — use them as-is (no upload).
    if (/youtube\.com|youtu\.be/i.test(videoUrl)) return youtubeThumbnail(videoUrl);
    if (!/tiktok\.com/i.test(videoUrl)) return null;

    const coverUrl = await fetchTikTokCoverUrl(videoUrl);
    if (!coverUrl) return null;

    // Download then re-upload: TikTok CDN URLs are signed and expire, so the
    // stored cover has to be a permanent Cloudinary copy.
    const imageRes = await fetch(coverUrl);
    if (!imageRes.ok) return null;
    const contentType = (imageRes.headers.get('content-type') || '')
      .split(';')[0]
      .trim()
      .toLowerCase();
    const ext = ALLOWED_IMAGE_TYPES[contentType];
    if (!ext) return null;
    if (Number(imageRes.headers.get('content-length') || 0) > MAX_COVER_BYTES) return null;

    const blob = await imageRes.blob();
    if (!blob.size || blob.size > MAX_COVER_BYTES) return null;

    const uploaded = await uploadFile(new File([blob], `sermon-cover.${ext}`, { type: contentType }));
    return uploaded?.url || null;
  } catch {
    return null;
  }
}
