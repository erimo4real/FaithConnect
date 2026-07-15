import cloudinary from '../config/cloudinary.js';
import logger from '../config/logger.js';

const folder = 'bethel-church';

function optimizeUrl(url, isVideo = false) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const transforms = isVideo ? 'vc_auto,q_auto,f_auto' : 'f_auto,q_auto';
  return url.replace('/upload/', `/upload/${transforms}/`);
}

export function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const ext = filename.split('.').pop().toLowerCase();
    const isVideo = /^(mp4|webm|mov|avi|mkv)$/i.test(ext);
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? 'video' : 'auto',
        public_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...(isVideo
          ? { transformation: [{ width: 1280, crop: 'limit', quality: 'auto' }] }
          : { transformation: [{ quality: 'auto', fetch_format: 'auto' }] }),
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({
          url: optimizeUrl(result.secure_url, isVideo),
          public_id: result.public_id,
          size: result.bytes,
          format: result.format,
          filename,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

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
