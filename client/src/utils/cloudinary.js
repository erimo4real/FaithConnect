export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const isVideo = url.includes('/video/');
  const { width, height, crop = 'fill', quality, format } = options;
  const parts = [];
  if (format) parts.push(`f_${format}`);
  if (quality) parts.push(`q_${quality}`);
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop && !isVideo) parts.push(`c_${crop}`);
  if (!format && !quality) {
    if (isVideo) parts.push('vc_auto', 'q_auto');
    else parts.push('f_auto', 'q_auto');
  }
  return parts.length ? url.replace('/upload/', `/upload/${parts.join(',')}/`) : url;
}
