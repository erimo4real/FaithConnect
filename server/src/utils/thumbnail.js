import { uploadToCloudinary } from './cloudinary.js';
import logger from '../config/logger.js';

function getVideoInfo(url) {
  if (!url) return null;

  const yt = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|live\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  if (yt) return { platform: 'youtube', id: yt[1], thumbnail: `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg` };

  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { platform: 'vimeo', id: vm[1], oembed: `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vm[1]}` };

  const tt = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (tt) return { platform: 'tiktok', id: tt[1], oembed: `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@video/video/${tt[1]}` };

  if (url.includes('vt.tiktok.com')) return { platform: 'tiktok', needsResolve: true };

  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return { platform: 'facebook', oembed: `https://www.facebook.com/plugins/video/oembed.json?url=${encodeURIComponent(url)}` };
  }

  const ig = url.match(/instagram\.com\/(?:p|reel)\/([^/?#]+)/);
  if (ig) return { platform: 'instagram', id: ig[1], oembed: `https://api.instagram.com/oembed?url=https://www.instagram.com/p/${ig[1]}/` };

  return null;
}

async function resolveTikTokLongUrl(shortUrl) {
  try {
    const resp = await fetch(shortUrl, { redirect: 'follow', method: 'HEAD' });
    const finalUrl = resp.url || shortUrl;
    const match = finalUrl.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
    if (match) return { id: match[1], url: `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@video/video/${match[1]}` };
  } catch {}
  return null;
}

async function fetchOembedThumbnail(oembedUrl) {
  try {
    const resp = await fetch(oembedUrl);
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.thumbnail_url || data.thumbnail || null;
  } catch {
    return null;
  }
}

async function downloadImage(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const buffer = Buffer.from(await resp.arrayBuffer());
    const contentType = resp.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.split('/').pop() || 'jpg';
    return { buffer, ext };
  } catch {
    return null;
  }
}

export async function fetchAndUploadThumbnail(videoUrl) {
  if (!videoUrl) return null;

  const info = getVideoInfo(videoUrl);
  if (!info) return null;

  let thumbnailUrl = null;

  if (info.platform === 'youtube') {
    thumbnailUrl = info.thumbnail;
  } else if (info.needsResolve) {
    const resolved = await resolveTikTokLongUrl(videoUrl);
    if (resolved) {
      thumbnailUrl = await fetchOembedThumbnail(resolved.url);
    }
  } else if (info.oembed) {
    thumbnailUrl = await fetchOembedThumbnail(info.oembed);
  }

  if (!thumbnailUrl) return null;

  const img = await downloadImage(thumbnailUrl);
  if (!img) return null;

  try {
    const result = await uploadToCloudinary(img.buffer, `thumbnail.${img.ext}`);
    return result.url;
  } catch (err) {
    logger.error({ err, videoUrl }, 'Failed to upload thumbnail to Cloudinary');
    return null;
  }
}

export async function batchFetchThumbnails(videoUrls) {
  const results = [];
  for (const url of videoUrls) {
    const thumbnail = await fetchAndUploadThumbnail(url);
    results.push({ videoUrl: url, thumbnail });
  }
  return results;
}
