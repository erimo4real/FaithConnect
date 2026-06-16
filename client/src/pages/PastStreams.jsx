import { useState, useEffect, useRef } from 'react';
import { fetchStreamArchive } from '../services/api';
import { FaPlay, FaFacebook, FaYoutube, FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa';

function getYoutubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return m ? m[1] : null;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function PastStreams() {
  const [items, setItems] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    fetchStreamArchive().then(async (data) => {
      setItems(data);
      const fbItems = data.filter(s => s.youtube_url?.includes('facebook.com'));
      if (fbItems.length === 0) return;
      const results = await Promise.allSettled(
        fbItems.map(s =>
          fetch(`${API_URL}/streams/thumbnail?url=${encodeURIComponent(s.youtube_url)}`)
            .then(r => r.json())
            .then(d => ({ id: s.id, url: d.thumbnail }))
        )
      );
      const map = {};
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.url) {
          map[r.value.id] = r.value.url;
        }
      }
      setThumbnails(map);
    }).catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500">No past streams yet</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-gray-900">
      {items.map((s, i) => {
        const isLatest = i === 0;
        const videoId = getYoutubeId(s.youtube_url);
        const isFacebook = s.youtube_url?.includes('facebook.com');
        const fbThumb = thumbnails[s.id];
        const isPlaying = playingId === s.id;

        return (
          <section
            key={s.id}
            className="relative w-full h-screen snap-start flex flex-col"
          >
            {isPlaying ? (
              <div className="absolute inset-0 bg-black">
                <iframe
                  src={videoId
                    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`
                    : `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(s.youtube_url)}&show_text=false`
                  }
                  title={s.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay"
                />
                <button
                  onClick={() => setPlayingId(null)}
                  className="absolute top-4 right-4 text-white/60 hover:text-white text-sm bg-black/40 px-3 py-1 rounded-full transition-colors z-10"
                >
                  Close
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPlayingId(s.id)}
                className="absolute inset-0 w-full h-full group cursor-pointer focus:outline-none"
              >
                {videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    loading={isLatest ? 'eager' : 'lazy'}
                  />
                ) : fbThumb ? (
                  <img
                    src={fbThumb}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <FaFacebook className="text-8xl text-blue-500/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <FaPlay className="text-white text-3xl ml-1.5" />
                  </div>
                </div>
              </button>
            )}

            <div className={`absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10 ${isPlaying ? 'hidden' : ''}`}>
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  {isLatest && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Latest</span>
                  )}
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${isFacebook ? 'bg-blue-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
                    {isFacebook ? <FaFacebook /> : <FaYoutube />}
                    {isFacebook ? 'Facebook' : 'YouTube'}
                  </span>
                  <span className="text-gray-400 text-xs font-mono">#{items.length - i}</span>
                </div>
                <h2 className="text-white text-xl md:text-3xl font-bold font-display mb-1">{s.title}</h2>
                <p className="text-gray-400 text-sm">
                  {new Date(s.deactivated_at || s.activated_at).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {isLatest && !isPlaying && (
              <div className="absolute bottom-28 md:bottom-36 left-1/2 -translate-x-1/2 animate-bounce z-10">
                <div className="flex flex-col items-center text-white/50">
                  <span className="text-xs mb-1">Scroll</span>
                  <FaChevronDown className="text-xl" />
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
