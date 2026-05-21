import cloudinary from '../config/cloudinary.js';
import logger from '../config/logger.js';

export function isCloudinaryUrl(url) {
  return url && typeof url === 'string' && url.includes('res.cloudinary.com');
}

export function extractPublicId(url) {
  if (!isCloudinaryUrl(url)) return null;
  const match = url.match(/\/v\d+\/(.+)\.([a-zA-Z0-9]+)$/);
  if (match) return match[1];
  const match2 = url.match(/\/v\d+\/(.+)$/);
  return match2 ? match2[1] : null;
}

export async function deleteCloudinaryImage(url) {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  const ext = publicId.split('.').pop();
  const isVideo = /^(mp4|webm|mov|avi|mkv)$/i.test(ext);
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: isVideo ? 'video' : 'image' });
  } catch (err) {
    logger.warn({ err, publicId }, 'Failed to delete Cloudinary image');
  }
}
