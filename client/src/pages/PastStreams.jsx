import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchStreamArchive } from '../services/api';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import { HiHeart, HiOutlineHeart, HiArrowUp } from 'react-icons/hi';

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
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const touchRef = useRef(null);
  const transitioning = useRef(false);

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

  const goNext = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    setIndex(i => Math.min(i + 1, items.length - 1));
    setTimeout(() => { transitioning.current = false; }, 400);
  }, [items.length]);

  const goPrev = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    setIndex(i => Math.max(i - 1, 0));
    setTimeout(() => { transitioning.current = false; }, 400);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (transitioning.current) { e.preventDefault(); return; }
      e.preventDefault();
      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [goNext, goPrev]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e) => { touchRef.current = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (!touchRef.current) return;
      const dy = touchRef.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 30) return;
      if (dy > 0) goNext();
      else goPrev();
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [goNext, goPrev]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  if (items.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500">No past streams yet</p>
      </div>
    );
  }

  const s = items[index];
  const videoId = getYoutubeId(s.youtube_url);
  const isFacebook = s.youtube_url?.includes('facebook.com');
  const fbThumb = thumbnails[s.id];
  const isPlaying = playingId === s.id;

  return (
    <div ref={containerRef} className="h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900 relative select-none">
      <div className="h-full flex flex-col items-center justify-center px-4 md:px-8">
        <div
          className="w-full max-w-5xl relative transition-transform duration-300 ease-out"
          style={{ transform: `translateY(0)` }}
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
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
                  className="absolute top-4 right-4 text-white/70 text-xs bg-black/60 px-3 py-1.5 rounded-full z-30 hover:bg-black/80 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPlayingId(s.id)}
                className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none group"
              >
                {videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => { if (e.target.src.includes('maxresdefault')) e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
                  />
                ) : fbThumb ? (
                  <img
                    src={fbThumb}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <img src={`https://picsum.photos/seed/${s.id}/800/600`} alt="" className="w-full h-full object-cover opacity-50" />
                    <img src="/churchlogo.png" alt="" className="absolute w-20 h-20 object-contain opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </button>
            )}

            <div className={`absolute right-3 bottom-4 flex flex-col items-center gap-4 z-10 ${isPlaying ? 'hidden' : ''}`}>
              <div className="flex flex-col items-center gap-0.5">
                <button
                  onClick={() => setLiked(p => ({ ...p, [s.id]: !p[s.id] }))}
                  className="flex flex-col items-center gap-0.5 text-white"
                >
                  {liked[s.id] ? (
                    <HiHeart className="text-2xl text-red-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  ) : (
                    <HiOutlineHeart className="text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  )}
                  <span className="text-[10px] font-light text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{liked[s.id] ? '1' : ''}</span>
                </button>
              </div>
              <a
                href={s.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-0.5 text-white"
              >
                <HiArrowUp className="text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                <span className="text-[10px] font-light text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Share</span>
              </a>
            </div>

            <div className={`absolute left-4 bottom-4 right-16 z-10 ${isPlaying ? 'hidden' : ''}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/90 ring-2 ring-white/30 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg">
                  BC
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Bethel Church</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-white/70 text-[11px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{s.title}</p>
                    <span className="text-white/40 text-[10px]">•</span>
                    <p className="text-white/50 text-[10px]">
                      {new Date(s.deactivated_at || s.activated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <span className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded ${isFacebook ? 'bg-blue-600/70 text-white' : 'bg-red-600/70 text-white'}`}>
                      {isFacebook ? <FaFacebook className="text-[8px]" /> : <FaYoutube className="text-[8px]" />}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-white/30 text-xs">
              {index + 1} of {items.length}
            </p>
            {index > 0 && (
              <button onClick={goPrev} className="text-white/30 hover:text-white/60 text-xs transition-colors">
                ↑ Previous
              </button>
            )}
            {index < items.length - 1 && (
              <button onClick={goNext} className="text-white/30 hover:text-white/60 text-xs transition-colors">
                Next ↓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
