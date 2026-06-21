const API_URL = import.meta.env.VITE_API_URL || '/api';

export function getVideoInfo(url) {
  if (!url) return null;

  const yt = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  if (yt) return { platform: 'youtube', id: yt[1], embedUrl: `https://www.youtube.com/embed/${yt[1]}`, thumbnail: `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg` };

  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return { platform: 'facebook', id: null, embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`, thumbnail: null };
  }

  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { platform: 'vimeo', id: vm[1], embedUrl: `https://player.vimeo.com/video/${vm[1]}`, thumbnail: null };

  const tt = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (tt) return { platform: 'tiktok', id: tt[1], embedUrl: `https://www.tiktok.com/embed/v2/${tt[1]}`, thumbnail: null };

  if (url.includes('vt.tiktok.com')) {
    const match = url.match(/vt\.tiktok\.com\/([\w-]+)/);
    return { platform: 'tiktok', id: null, embedUrl: null, needsResolve: true, shortCode: match?.[1] || null, rawUrl: url, thumbnail: null };
  }

  const ig = url.match(/instagram\.com\/(?:p|reel)\/([^/?#]+)/);
  if (ig) return { platform: 'instagram', id: ig[1], embedUrl: `https://www.instagram.com/p/${ig[1]}/embed`, thumbnail: null };

  const dm = url.match(/dailymotion\.com\/video\/([^_?#]+)/);
  if (dm) return { platform: 'dailymotion', id: dm[1], embedUrl: `https://www.dailymotion.com/embed/video/${dm[1]}`, thumbnail: null };

  return { platform: 'generic', id: null, embedUrl: url, thumbnail: null };
}

export async function resolveTikTokUrl(url) {
  try {
    const res = await fetch(`${API_URL}/streams/resolve-tiktok?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (data.id) {
      return { id: data.id, embedUrl: `https://www.tiktok.com/embed/v2/${data.id}` };
    }
    if (data.videoUrl) {
      const match = data.videoUrl.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
      if (match) {
        return { id: match[1], embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}` };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function getVideoIcon(platform) {
  switch (platform) {
    case 'youtube': return { icon: 'FaYoutube', color: 'bg-red-600/90', label: 'YouTube' };
    case 'facebook': return { icon: 'FaFacebook', color: 'bg-blue-600/90', label: 'Facebook' };
    case 'tiktok': return { icon: 'FaTiktok', color: 'bg-black/80', label: 'TikTok' };
    case 'vimeo': return { icon: 'FaVimeoV', color: 'bg-blue-500/90', label: 'Vimeo' };
    case 'instagram': return { icon: 'FaInstagram', color: 'bg-pink-600/90', label: 'Instagram' };
    case 'dailymotion': return { icon: 'FaPlay', color: 'bg-gray-600/90', label: 'Dailymotion' };
    default: return { icon: 'FaPlay', color: 'bg-gray-600/90', label: 'Video' };
  }
}

export async function fetchVideoThumbnail(url) {
  const info = getVideoInfo(url);
  if (!info) return null;
  if (info.thumbnail) return info.thumbnail;
  if (info.platform === 'facebook') {
    try {
      const res = await fetch(`${API_URL}/streams/thumbnail?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      return data.thumbnail || null;
    } catch { return null; }
  }
  return null;
}
