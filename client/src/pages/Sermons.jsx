import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchSermons } from '../services/api';
import { FaYoutube, FaFacebook, FaVimeoV, FaInstagram } from 'react-icons/fa';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { getVideoInfo, getVideoIcon, fetchVideoThumbnail, resolveTikTokUrl } from '../utils/videoUtils';
import YouTubePlayer from '../components/YouTubePlayer';

const platformIcons = { FaYoutube, FaFacebook, FaVimeoV, FaInstagram };

const TikTokIcon = ({ className }) => (
  <svg className={className || 'w-[11px] h-[11px]'} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

export default function Sermons() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [liked, setLiked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fc_sermon_liked') || '{}'); } catch { return {}; }
  });
  const [index, setIndex] = useState(0);
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [thumbnails, setThumbnails] = useState({});
  const [resolvedTikTok, setResolvedTikTok] = useState({});
  const [paused, setPaused] = useState(false);
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const touchRef = useRef(null);
  const transitioning = useRef(false);

  useEffect(() => {
    if (playingId) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }, [playingId]);

  useEffect(() => {
    localStorage.setItem('fc_sermon_liked', JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    fetchSermons().then(data => {
      const videos = data.filter(s => s.video_url).map(s => ({ ...s, videoUrl: s.video_url }));
      setItems(videos);
      setLoading(false);
      videos.forEach(s => {
        if (s.videoUrl && !getVideoInfo(s.videoUrl)?.thumbnail) {
          fetchVideoThumbnail(s.videoUrl).then(t => {
            if (t) setThumbnails(p => ({ ...p, [s.id]: t }));
          });
        }
      });
    }).catch(() => setLoading(false));
  }, []);

  // Resolve TikTok short URLs
  useEffect(() => {
    const s = items[index];
    if (!s?.videoUrl) return;
    const info = getVideoInfo(s.videoUrl);
    if (info?.needsResolve && !resolvedTikTok[s.id]) {
      resolveTikTokUrl(s.videoUrl).then(result => {
        if (result) setResolvedTikTok(p => ({ ...p, [s.id]: result }));
      });
    }
  }, [items, index]);

  const speakers = ['all', ...new Set(items.map(s => s.speaker))];
  const years = ['all', ...new Set(items.map(s => s.date?.substring(0, 4)))];

  const filtered = items.filter(s => {
    if (speakerFilter !== 'all' && s.speaker !== speakerFilter) return false;
    if (yearFilter !== 'all' && !s.date?.startsWith(yearFilter)) return false;
    return true;
  });

  useEffect(() => {
    if (index >= filtered.length && filtered.length > 0) setIndex(0);
  }, [filtered.length]);

  const goNext = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    setIndex(i => Math.min(i + 1, filtered.length - 1));
    setTimeout(() => { transitioning.current = false; }, 400);
  }, [filtered.length]);

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
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading sermons...</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{items.length === 0 ? 'No video sermons yet' : 'No sermons match your filters'}</p>
        {items.length > 0 && (
          <button onClick={() => { setSpeakerFilter('all'); setYearFilter('all'); }} className="text-primary text-xs underline hover:text-white transition-colors">
            Clear filters
          </button>
        )}
      </div>
    );
  }

  const s = filtered[index];
  const videoInfo = getVideoInfo(s.videoUrl);
  const isPlaying = playingId === s.id;

  const embedUrl = videoInfo?.embedUrl || resolvedTikTok[s.id]?.embedUrl;
  const isFacebook = s.videoUrl?.includes('facebook.com');
  const platformBadge = getVideoIcon(videoInfo?.platform);
  const BadgeIcon = platformIcons[platformBadge.icon] || null;
  const thumbUrl = thumbnails[s.id] || videoInfo?.thumbnail;

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-black select-none">
      <a href="/" className="hidden md:flex absolute top-4 left-4 z-30 text-white/40 hover:text-white text-xs bg-black/40 min-h-[44px] px-3 rounded-full items-center gap-1.5 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        Home
      </a>

      {isPlaying && isMobile && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
              <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {embedUrl ? (
              videoInfo.platform === 'youtube' ? (
                <div className="relative w-full h-full">
                  <YouTubePlayer
                    videoId={videoInfo.id}
                  />
                </div>
              ) : (
                <div className="relative w-full max-w-[300px]" style={{ height: '540px' }}>
                  <iframe src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`} title={s.title} className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay; fullscreen" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation" />
                  <button onClick={() => setPaused(true)} className="absolute top-2 right-2 z-30 text-white/80 bg-black/50 backdrop-blur min-h-[36px] px-2.5 rounded-lg text-xs font-medium hover:bg-black/70 transition-colors flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2"/></svg>
                    Pause
                  </button>
                  {paused && (
                    <div className="absolute inset-0 bg-black z-20 flex flex-col items-center justify-center" style={{ height: '540px' }}>
                      <button onClick={() => setPaused(false)} className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-2xl hover:bg-white/25 transition-colors" aria-label="Resume">
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                      <p className="text-white/60 text-xs mt-4">Paused</p>
                    </div>
                  )}
                </div>
              )
              ) : videoInfo?.needsResolve ? (
                <div className="flex items-center gap-2 text-white/40 text-sm">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Loading video...
              </div>
            ) : (
              <p className="text-white/40 text-sm">Video unavailable for embedding</p>
            )}
          </div>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
            <button onClick={() => setPlayingId(null)} className="text-white/70 bg-black/40 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => setPlayingId(null)} className="text-white/70 text-xs bg-black/60 min-h-[44px] px-4 rounded-full hover:bg-black/80 transition-colors">Close</button>
          </div>
        </div>
      )}

      <div className={`h-full flex flex-col items-center md:justify-center ${isPlaying ? 'hidden md:flex' : ''}`}>
        <div className="w-full md:max-w-5xl md:px-4 relative flex-1 md:flex-none md:h-auto">
          <div className={`relative w-full h-full md:h-auto md:rounded-2xl md:overflow-hidden md:shadow-2xl md:shadow-black/50 md:ring-1 md:ring-white/10 animate-fade-in ${isPlaying ? 'md:min-h-[50vh]' : 'md:aspect-video'}`} key={s.id}>
            <button onClick={() => setPlayingId(null)} className="absolute top-4 left-4 z-20 text-white/70 bg-black/40 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full md:hidden hover:bg-black/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>

            {isPlaying && !isMobile ? (
              <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative flex items-center justify-center">
                {embedUrl ? (
                  videoInfo.platform === 'youtube' ? (
                    <div className="relative w-full h-full">
                      <YouTubePlayer
                        videoId={videoInfo.id}
                  />
                </div>
                  ) : (
                    <div className="relative w-full max-w-[300px]" style={{ height: '540px' }}>
                      <iframe src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`} title={s.title} className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation" />
                      <button onClick={() => setPaused(true)} className="absolute top-2 right-2 z-30 text-white/80 bg-black/50 backdrop-blur min-h-[36px] px-2.5 rounded-lg text-xs font-medium hover:bg-black/70 transition-colors flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2"/></svg>
                        Pause
                      </button>
                      {paused && (
                        <div className="absolute inset-0 bg-black z-20 flex flex-col items-center justify-center" style={{ height: '540px' }}>
                          <button onClick={() => setPaused(false)} className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-2xl hover:bg-white/25 transition-colors" aria-label="Resume">
                            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </button>
                          <p className="text-white/60 text-xs mt-4">Paused</p>
                        </div>
                      )}
                    </div>
                  )
                ) : videoInfo?.needsResolve ? (
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Loading video...
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">Video unavailable for embedding</p>
                )}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
                  <button onClick={() => setPlayingId(null)} className="text-white/70 text-xs bg-black/60 min-h-[44px] px-4 rounded-full hover:bg-black/80 transition-colors">Close</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setPlayingId(s.id)} className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none group">
                {thumbUrl ? (
                  <img src={thumbUrl} alt="" loading="lazy" className="w-full h-full object-contain md:group-hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <img src="/churchlogo.png" alt="" className="w-20 h-20 object-contain opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 md:w-16 md:h-16 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 md:w-7 md:h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </button>
            )}

            <div className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 z-10 ${isPlaying ? 'hidden' : ''}`}>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent ring-2 ring-white/30 flex items-center justify-center text-white text-base md:text-sm font-bold shadow-2xl shadow-black/30">BC</div>
                <p className="text-white/90 text-sm md:text-xs font-semibold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-center max-w-[100px]">{s.speaker || 'Bethel Church'}</p>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <p className="text-white font-medium text-sm md:text-sm leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-[130px]">{s.title}</p>
                <p className="text-white/60 text-[11px] md:text-[10px] font-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">{s.date ? new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</p>
                <span className={`inline-flex items-center gap-1.5 text-[10px] md:text-[9px] px-2.5 py-1 rounded-full mt-1 text-white font-medium shadow-lg ${platformBadge.color}`}>
                  {BadgeIcon ? <BadgeIcon className="text-[11px]" /> : <TikTokIcon />} {platformBadge.label}
                </span>
                {s.description && <p className="text-white/80 text-[11px] md:text-[10px] leading-snug mt-2 max-w-[130px] line-clamp-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">{s.description}</p>}
              </div>
              <button onClick={() => setLiked(p => ({ ...p, [s.id]: !p[s.id] }))} className="flex flex-col items-center gap-1 text-white group">
                {liked[s.id] ? <HiHeart className="text-3xl md:text-[28px] text-red-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform group-active:scale-125" /> : <HiOutlineHeart className="text-3xl md:text-[28px] text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110 group-active:scale-125" />}
                <span className="text-[11px] md:text-[10px] font-medium text-white/70 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">{liked[s.id] ? '1' : ''}</span>
              </button>
            </div>

            <div className={`absolute bottom-4 right-3 z-10 flex flex-col gap-1.5 ${isPlaying ? 'hidden' : ''}`}>
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur border border-white/10 rounded-lg px-2.5 py-1.5">
                <svg className="w-3 h-3 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm4 6a1 1 0 011-1h8a1 1 0 010 2H8a1 1 0 01-1-1zm2 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z"/></svg>
                <select value={speakerFilter} onChange={e => { setSpeakerFilter(e.target.value); setIndex(0); }}
                  className="text-[11px] bg-transparent text-white/80 border-none outline-none appearance-none cursor-pointer pr-3">
                  {speakers.map(sp => <option key={sp} value={sp} className="text-black">{sp === 'all' ? 'All Speakers' : sp}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur border border-white/10 rounded-lg px-2.5 py-1.5">
                <svg className="w-3 h-3 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setIndex(0); }}
                  className="text-[11px] bg-transparent text-white/80 border-none outline-none appearance-none cursor-pointer pr-3">
                  {years.map(y => <option key={y} value={y} className="text-black">{y === 'all' ? 'All Years' : y}</option>)}
                </select>
              </div>
            </div>

            <div className={`absolute left-4 bottom-4 z-10 text-white/40 text-xs md:hidden ${isPlaying ? 'hidden' : ''}`}>{index + 1} / {filtered.length}</div>
          </div>

          <div className="hidden md:flex items-center justify-between mt-4 px-1">
            <p className="text-white/30 text-xs">{index + 1} of {filtered.length}</p>
            <div className="flex items-center gap-4">
              <a href="/podcast" className="text-white/30 hover:text-white/60 text-xs transition-colors flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8"/></svg>
                Podcast
              </a>
              {index > 0 && <button onClick={goPrev} className="text-white/30 hover:text-white/60 text-xs transition-colors">&uarr; Previous</button>}
              {index < filtered.length - 1 && <button onClick={goNext} className="text-white/30 hover:text-white/60 text-xs transition-colors">Next &darr;</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}