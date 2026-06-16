import { useState, useEffect, useRef } from 'react';
import { fetchStreamArchive } from '../services/api';
import { FaPlay, FaFacebook, FaYoutube, FaHeart, FaShare, FaExternalLinkAlt } from 'react-icons/fa';

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
  const [liked, setLiked] = useState({});
  const containerRef = useRef(null);

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
      <div className="h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500">No past streams yet</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth">
      {items.map((s, i) => {
        const videoId = getYoutubeId(s.youtube_url);
        const isFacebook = s.youtube_url?.includes('facebook.com');
        const fbThumb = thumbnails[s.id];
        const isPlaying = playingId === s.id;

        return (
          <div key={s.id} className="relative w-full h-screen snap-start overflow-hidden bg-black">
            {isPlaying ? (
              <div className="absolute inset-0 bg-black z-20">
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
                  className="absolute top-12 right-4 text-white/70 text-xs bg-black/60 px-3 py-1.5 rounded-full z-30"
                >
                  Close
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPlayingId(s.id)}
                className="absolute inset-0 w-full h-full group cursor-pointer focus:outline-none z-10"
              >
                {videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                ) : fbThumb ? (
                  <img
                    src={fbThumb}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <FaFacebook className="text-8xl text-blue-500/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
              </button>
            )}

            <div className={`absolute bottom-6 left-4 right-20 z-10 ${isPlaying ? 'hidden' : ''}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                  BC
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">Bethel Church</p>
                  <p className="text-gray-400 text-[11px]">
                    {new Date(s.deactivated_at || s.activated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <h2 className="text-white text-base md:text-lg font-bold leading-tight mb-1">{s.title}</h2>
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded ${isFacebook ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                {isFacebook ? <FaFacebook /> : <FaYoutube />}
                {isFacebook ? 'Facebook' : 'YouTube'}
              </span>
            </div>

            <div className={`absolute bottom-6 right-3 flex flex-col items-center gap-4 z-10 ${isPlaying ? 'hidden' : ''}`}>
              <button
                onClick={() => setLiked(p => ({ ...p, [s.id]: !p[s.id] }))}
                className="flex flex-col items-center gap-0.5 text-white"
              >
                <FaHeart className={`text-2xl transition-colors ${liked[s.id] ? 'text-red-500' : 'text-white/70'}`} />
                <span className="text-[10px]">{liked[s.id] ? '1' : ''}</span>
              </button>
              <a
                href={s.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white"
              >
                <FaExternalLinkAlt className="text-xl" />
                <span className="text-[10px]">Open</span>
              </a>
            </div>

            {i === 0 && !isPlaying && (
              <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                <div className="flex flex-col items-center text-white/30">
                  <span className="text-[10px] uppercase tracking-widest mb-0.5">Scroll</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
