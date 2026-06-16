import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchStreamArchive } from '../services/api';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

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
  const [liked, setLiked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fc_liked') || '{}'); } catch { return {}; }
  });
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showHint, setShowHint] = useState(() => !localStorage.getItem('fc_past_hint'));
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const touchRef = useRef(null);
  const transitioning = useRef(false);

  useEffect(() => {
    if (showHint) {
      localStorage.setItem('fc_past_hint', '1');
      const t = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showHint]);

  useEffect(() => {
    localStorage.setItem('fc_liked', JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    fetchStreamArchive().then(async (data) => {
      setItems(data);
      setLoading(false);
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
      setLoading(false);
    }).catch(() => { setLoading(false); });
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

  if (loading) {
    return (
      <div className="h-screen h-dvh md:h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading streams...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-screen h-dvh md:h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500">No past streams yet</p>
      </div>
    );
  }

  const s = items[index];
  const videoId = getYoutubeId(s.youtube_url);
  const isFacebook = s.youtube_url?.includes('facebook.com');
  const fbThumb = thumbnails[s.id];
  const isPlaying = playingId === s.id;

  function renderThumb(item, thumbMap) {
    const vid = getYoutubeId(item.youtube_url);
    const fb = thumbMap[item.id];
    if (vid) {
      return <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt="" className="w-full h-full object-cover" loading="lazy" />;
    }
    if (fb) {
      return <img src={fb} alt="" className="w-full h-full object-cover" loading="lazy" />;
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img src={`https://picsum.photos/seed/${item.id}/200/150`} alt="" className="w-full h-full object-cover opacity-50" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-screen h-dvh md:h-screen overflow-hidden bg-black relative select-none">
      {isPlaying ? (
        <div className="fixed inset-0 bg-black z-50 md:hidden flex items-center justify-center">
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0` : `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(s.youtube_url)}&show_text=false`}
              title={s.title}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          </div>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
            <button onClick={() => setPlayingId(null)} className="text-white/70 bg-black/40 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowMore(true)} className="text-white/70 text-xs bg-black/60 min-h-[44px] px-4 rounded-full hover:bg-black/80 transition-colors">More videos</button>
              <button onClick={() => setPlayingId(null)} className="text-white/70 text-xs bg-black/60 min-h-[44px] px-4 rounded-full hover:bg-black/80 transition-colors">Close</button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`h-full flex flex-col items-center md:justify-center ${isPlaying ? 'hidden md:flex' : ''}`}>
        <div className="w-full md:max-w-5xl md:px-4 relative flex-1 md:flex-none md:h-auto">
          <div className="relative w-full h-full md:h-auto md:aspect-video md:rounded-2xl md:overflow-hidden md:shadow-2xl md:shadow-black/50 md:ring-1 md:ring-white/10 animate-fade-in" key={s.id}>
            <button onClick={() => setPlayingId(null)} className="absolute top-4 left-4 z-20 text-white/70 bg-black/40 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full md:hidden hover:bg-black/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            {showHint && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 animate-fade-in pointer-events-none">
                <svg className="w-6 h-6 text-white/50 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                <p className="text-white/40 text-xs">Swipe up/down</p>
              </div>
            )}
            {isPlaying ? (
              <div className="hidden md:block absolute inset-0 bg-black md:rounded-2xl overflow-hidden z-10">
                <iframe
                  src={videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1` : `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(s.youtube_url)}&show_text=false`}
                  title={s.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay"
                />
                <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
                  <button onClick={() => setShowMore(true)} className="text-white/70 text-xs bg-black/60 min-h-[44px] px-4 rounded-full hover:bg-black/80 transition-colors">More videos</button>
                  <button onClick={() => setPlayingId(null)} className="text-white/70 text-xs bg-black/60 min-h-[44px] px-4 rounded-full hover:bg-black/80 transition-colors">Close</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setPlayingId(s.id)} className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none group">
                {videoId ? (
                  <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="" className="w-full h-full object-cover object-center md:group-hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => { if (e.target.src.includes('maxresdefault')) e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
                  />
                ) : fbThumb ? (
                  <img src={fbThumb} alt="" className="w-full h-full object-cover object-center md:group-hover:scale-[1.02] transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <img src={`https://picsum.photos/seed/${s.id}/800/600`} alt="" className="w-full h-full object-cover opacity-50" />
                    <img src="/churchlogo.png" alt="" className="absolute w-20 h-20 object-contain opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 md:w-16 md:h-16 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 md:w-7 md:h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </button>
            )}

            <div className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 md:gap-5 z-10 ${isPlaying ? 'hidden md:flex' : ''}`}>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 md:w-11 md:h-11 rounded-full bg-primary ring-2 ring-white/40 flex items-center justify-center text-white text-sm font-bold shadow-lg">BC</div>
                <p className="text-white text-[13px] md:text-[11px] font-bold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] text-center">Bethel Church</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-white text-sm md:text-xs leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] max-w-[130px] font-medium">{s.title}</p>
                <p className="text-white/70 text-[11px] md:text-[10px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{new Date(s.deactivated_at || s.activated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] md:text-[8px] px-2 py-0.5 rounded mt-0.5 ${isFacebook ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                  {isFacebook ? <FaFacebook className="text-[10px]" /> : <FaYoutube className="text-[10px]" />}
                </span>
              </div>
              <button onClick={() => setLiked(p => ({ ...p, [s.id]: !p[s.id] }))} className="flex flex-col items-center gap-0.5 text-white">
                {liked[s.id] ? <HiHeart className="text-3xl md:text-2xl text-red-500 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" /> : <HiOutlineHeart className="text-3xl md:text-2xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />}
                <span className="text-xs md:text-[10px] font-light text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{liked[s.id] ? '1' : ''}</span>
              </button>
            </div>

            <div className={`absolute left-4 bottom-4 z-10 text-white/40 text-xs md:hidden ${isPlaying ? 'hidden' : ''}`}>{index + 1} / {items.length}</div>
          </div>

          <div className="hidden md:flex items-center justify-between mt-4 px-1">
            <p className="text-white/30 text-xs">{index + 1} of {items.length}</p>
            {index > 0 && <button onClick={goPrev} className="text-white/30 hover:text-white/60 text-xs transition-colors">&uarr; Previous</button>}
            {index < items.length - 1 && <button onClick={goNext} className="text-white/30 hover:text-white/60 text-xs transition-colors">Next &darr;</button>}
          </div>
        </div>
      </div>

      {showMore && (
        <div className="absolute inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMore(false)}></div>
          <div className="relative w-full md:max-w-sm bg-gray-900/95 backdrop-blur border-l border-white/10 h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-sm font-bold">More Videos</h3>
              <button onClick={() => setShowMore(false)} className="text-white/50 text-xs bg-white/10 px-2 py-1 rounded-full hover:bg-white/20 transition-colors">Close</button>
            </div>
            <div className="space-y-3">
              {items.map((v, i) => (
                <button key={v.id} onClick={() => { setIndex(i); setPlayingId(v.id); setShowMore(false); }}
                  className={`w-full flex gap-3 text-left rounded-xl overflow-hidden transition-colors group ${i === index ? 'ring-2 ring-primary' : 'hover:bg-white/5'}`}
                >
                  <div className="w-28 shrink-0 relative aspect-video bg-gray-800">
                    {renderThumb(v, thumbnails)}
                    {i === index && (
                      <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">Playing</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-1 pr-2">
                    <p className="text-white text-xs font-medium truncate">{v.title}</p>
                    <p className="text-white/40 text-[10px] mt-0.5">{new Date(v.deactivated_at || v.activated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
