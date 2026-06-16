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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-2xl">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </button>
            )}

            <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 z-10 max-w-[120px] ${isPlaying ? 'hidden' : ''}`}>
              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  BC
                </div>
                <span className="text-[9px] text-white/80 font-medium leading-tight text-center">Bethel<br/>Church</span>
              </div>

              <div className="flex flex-col items-center gap-0.5 text-center">
                <h2 className="text-white text-xs md:text-sm font-bold leading-tight">{s.title}</h2>
                <p className="text-gray-400 text-[10px]">
                  {new Date(s.deactivated_at || s.activated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded mt-0.5 ${isFacebook ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                  {isFacebook ? <FaFacebook /> : <FaYoutube />}
                </span>
              </div>

              <button
                onClick={() => setLiked(p => ({ ...p, [s.id]: !p[s.id] }))}
                className="flex flex-col items-center gap-1 text-white group"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <FaHeart className={`text-xl transition-colors ${liked[s.id] ? 'text-red-500' : 'text-white'}`} />
                </div>
                <span className="text-[10px] text-white/70">{liked[s.id] ? '1' : ''}</span>
              </button>

              <a
                href={s.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 text-white group"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <FaExternalLinkAlt className="text-lg text-white" />
                </div>
                <span className="text-[10px] text-white/70">Open</span>
              </a>
            </div>

            <div className={`absolute left-4 bottom-6 right-20 z-10 ${isPlaying ? 'hidden' : ''}`}></div>

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
