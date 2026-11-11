const API_URL = import.meta.env.VITE_API_URL || '/api';

export function normalizeFacebookUrl(url) {
  if (!url || !url.includes('facebook.com')) return url;
  let clean = url.replace(/^https?:\/\/web\.facebook\.com/, 'https://www.facebook.com');
  const match = clean.match(/[?&]v=(\d+)/);
  if (match) return `https://www.facebook.com/watch/?v=${match[1]}`;
  return clean;
}

export function getVideoInfo(url) {
  if (!url) return null;

  const yt = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|live\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  if (yt) return { platform: 'youtube', id: yt[1], embedUrl: `https://www.youtube.com/embed/${yt[1]}`, thumbnail: `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg` };

  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    const cleanUrl = normalizeFacebookUrl(url);
    return { platform: 'facebook', id: null, embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(cleanUrl)}&show_text=false`, thumbnail: null };
  }

  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { platform: 'vimeo', id: vm[1], embedUrl: `https://player.vimeo.com/video/${vm[1]}`, thumbnail: null };

  // TikTok's raw embed/v2 endpoint frequently fails (blank/429), so the sermons
  // page mounts the OFFICIAL embed.js widget (see TikTokEmbed.jsx) instead of a
  // raw iframe. embedUrl below is the player/v1 URL TikTok's own widget uses.
  const tt = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (tt) return { platform: 'tiktok', id: tt[1], embedUrl: `https://www.tiktok.com/player/v1/${tt[1]}`, thumbnail: null };

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

function resolveTikTokOembed(url) {
  return new Promise((resolve) => {
    const cb = '_tto_' + Date.now();
    window[cb] = (d) => { delete window[cb]; sh(); const id = d?.thumbnail_url?.match(/\/video\/(\d+)/)?.[1] || d?.author_url?.match(/\/video\/(\d+)/)?.[1]; resolve(id ? { id, embedUrl: `https://www.tiktok.com/player/v1/${id}` } : null); };
    const sh = () => { try { document.head.removeChild(s); } catch {} };
    const s = document.createElement('script');
    s.src = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}&callback=${cb}`;
    s.onerror = () => { delete window[cb]; sh(); resolve(null); };
    document.head.appendChild(s);
  });
}

export async function resolveTikTokUrl(url) {
  // The resolve API can briefly 503 while the backend dyno wakes up. Retry
  // with backoff so a cold start doesn't look like a dead video.
  const delays = [0, 3000, 10000];
  for (const delay of delays) {
    if (delay) await new Promise(r => setTimeout(r, delay));
    try {
      const res = await fetch(`${API_URL}/streams/resolve-tiktok?url=${encodeURIComponent(url)}`);
      if (!res.ok) continue; // cold start / transient gateway error -> retry
      const data = await res.json();
      if (data.id) {
        return { id: data.id, embedUrl: `https://www.tiktok.com/player/v1/${data.id}` };
      }
      if (data.videoUrl) {
        const match = data.videoUrl.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
        if (match) {
          return { id: match[1], embedUrl: `https://www.tiktok.com/player/v1/${match[1]}` };
        }
      }
      // 200 but unresolvable — the server-side lookup may have transiently
      // failed, so let the retry loop try again before giving up.
    } catch {}
  }
  return resolveTikTokOembed(url);
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
