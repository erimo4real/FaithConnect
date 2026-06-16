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
    <div ref={containerRef} className="h-screen overflow-hidden bg-black relative select-none">
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(0)` }}
      >
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
            className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none z-10"
          >
            {videoId ? (
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { if (e.target.src.includes('maxresdefault')) e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
              />
            ) : fbThumb ? (
              <img
                src={fbThumb}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <FaFacebook className="text-8xl text-blue-500/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent"></div>
          </button>
        )}

        <div className={`absolute right-3 bottom-32 flex flex-col items-center gap-5 z-10 ${isPlaying ? 'hidden' : ''}`}>
          <div className="w-12 h-12 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
            BC
          </div>

          <div className="flex flex-col items-center gap-0.5 text-right">
            <p className="text-white text-sm font-bold leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Bethel Church</p>
            <p className="text-white/80 text-xs leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] text-right">{s.title}</p>
            <div className="flex flex-col items-center gap-1 mt-1">
              <p className="text-white/60 text-[10px]">
                {new Date(s.deactivated_at || s.activated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded ${isFacebook ? 'bg-blue-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
                {isFacebook ? <FaFacebook className="text-[9px]" /> : <FaYoutube className="text-[9px]" />}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => setLiked(p => ({ ...p, [s.id]: !p[s.id] }))}
              className="flex flex-col items-center gap-0.5 text-white"
            >
              {liked[s.id] ? (
                <HiHeart className="text-3xl text-red-500" />
              ) : (
                <HiOutlineHeart className="text-3xl text-white" />
              )}
              <span className="text-[10px] font-light text-white/80">{liked[s.id] ? '1' : ''}</span>
            </button>
          </div>
          <a
            href={s.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 text-white"
          >
            <HiArrowUp className="text-3xl text-white" />
            <span className="text-[10px] font-light text-white/80">Share</span>
          </a>
        </div>

        {index > 0 && !isPlaying && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
