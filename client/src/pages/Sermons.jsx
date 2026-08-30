import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchSermons, fetchEvents } from '../services/api';
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

const navLinks = [
  { to: '/', label: 'Home', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
  { to: '/about', label: 'About', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  { to: '/sermons', label: 'Sermons', active: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> },
  { to: '/live', label: 'Live', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> },
  { to: '/events', label: 'Events', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
  { to: '/contact', label: 'Contact', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
];
const enableDonations = import.meta.env.VITE_ENABLE_DONATIONS === 'true';
const giveLink = { to: '/donations', label: 'Give', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> };
if (enableDonations) {
  const beforeContact = navLinks.findIndex(l => l.to === '/contact');
  navLinks.splice(beforeContact, 0, giveLink);
}
// Since navLinks is now mutated only when enabled, keep the rendering maps below unchanged.

export default function Sermons() {
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [liked, setLiked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fc_sermon_liked') || '{}'); } catch { return {}; }
  });
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [thumbnails, setThumbnails] = useState({});
  const [resolvedTikTok, setResolvedTikTok] = useState({});
  const [paused, setPaused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('fc_sermon_liked', JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    fetchSermons().then(data => {
      const videos = data.filter(s => s.video_url).map(s => ({ ...s, videoUrl: s.video_url }));
      setItems(videos);
      if (videos.length > 0) setSelectedId(videos[0].id);
      setLoading(false);
      videos.forEach(s => {
        if (s.videoUrl && !getVideoInfo(s.videoUrl)?.thumbnail) {
          fetchVideoThumbnail(s.videoUrl).then(t => {
            if (t) setThumbnails(p => ({ ...p, [s.id]: t }));
          });
        }
      });
    }).catch(() => setLoading(false));
    fetchEvents().then(setEvents).catch(() => {});
  }, []);

  // Resolve TikTok short URLs for selected video
  useEffect(() => {
    const s = items.find(i => i.id === selectedId);
    if (!s?.videoUrl) return;
    const info = getVideoInfo(s.videoUrl);
    if (info?.needsResolve && !resolvedTikTok[s.id]) {
      resolveTikTokUrl(s.videoUrl).then(result => {
        if (result) setResolvedTikTok(p => ({ ...p, [s.id]: result }));
      });
    }
  }, [items, selectedId]);

  const speakers = ['all', ...new Set(items.map(s => s.speaker))];
  const years = ['all', ...new Set(items.map(s => s.date?.substring(0, 4)))];

  const filtered = items.filter(s => {
    if (speakerFilter !== 'all' && s.speaker !== speakerFilter) return false;
    if (yearFilter !== 'all' && !s.date?.startsWith(yearFilter)) return false;
    return true;
  });

  useEffect(() => {
    if (selectedId && !filtered.some(s => s.id === selectedId)) {
      setSelectedId(filtered[0]?.id || null);
    }
  }, [filtered]);

  const selectedIndex = filtered.findIndex(s => s.id === selectedId);
  const s = filtered[selectedIndex >= 0 ? selectedIndex : 0];
  const isPlaying = !!s?.id && selectedId === s.id;

  const goPrev = useCallback(() => {
    setSelectedId(filtered[Math.max(selectedIndex - 1, 0)]?.id);
  }, [filtered, selectedIndex]);

  const goNext = useCallback(() => {
    setSelectedId(filtered[Math.min(selectedIndex + 1, filtered.length - 1)]?.id);
  }, [filtered, selectedIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading sermons...</p>
      </div>
    );
  }

  if (filtered.length === 0 || !s) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{items.length === 0 ? 'No video sermons yet' : 'No sermons match your filters'}</p>
        {items.length > 0 && (
          <button onClick={() => { setSpeakerFilter('all'); setYearFilter('all'); }} className="text-primary text-xs underline hover:text-white transition-colors">
            Clear filters
          </button>
        )}
      </div>
    );
  }

  const videoInfo = getVideoInfo(s.videoUrl);
  const embedUrl = videoInfo?.embedUrl || resolvedTikTok[s.id]?.embedUrl;
  const platformBadge = getVideoIcon(videoInfo?.platform);
  const BadgeIcon = platformIcons[platformBadge.icon] || null;
  const thumbUrl = thumbnails[s.id] || videoInfo?.thumbnail;

  const sidebar = (other = items, cls = '', onSelect) => other.filter(x => x.id !== s.id).slice(0, 8).map(item => {
    const it = getVideoInfo(item.videoUrl);
    const itThumb = thumbnails[item.id] || it?.thumbnail;
    const itBadge = getVideoIcon(it?.platform);
    const ItIcon = platformIcons[itBadge.icon] || TikTokIcon;
    return (
      <button
        key={item.id}
        onClick={() => onSelect(item.id)}
        className={`group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/5 min-h-[56px] ${cls}`}
      >
        <div className="relative w-20 h-12 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {itThumb ? (
            <img src={itThumb} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><img src="/churchlogo.png" alt="" className="w-6 h-6 object-contain opacity-40" /></div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/30">
            <svg className="w-4 h-4 text-white/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-white/90">{item.title}</p>
          <p className="truncate text-[10px] text-white/40 mt-0.5 flex items-center gap-1">
            <ItIcon className="w-3 h-3 text-white/30" /> {item.speaker || 'Bethel Church'}
          </p>
        </div>
      </button>
    );
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <img src="/churchlogo.png" alt="Bethel Church" className="h-8 w-auto" />
            <span className="font-bold font-display text-sm">Bethel Church</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="px-3 py-3 space-y-1 border-t border-white/10">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium min-h-[48px] transition-colors ${l.active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                {l.icon} {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR — brand + navigation */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-white/10 bg-[#0d0d0d]">
          <Link to="/" className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
            <img src="/churchlogo.png" alt="Bethel Church" className="h-9 w-auto" />
            <span className="font-bold font-display">Bethel Church</span>
          </Link>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${l.active ? 'bg-primary/20 text-primary' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                {l.icon} {l.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-white/10">
            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Filters</div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-2">
                <svg className="w-3.5 h-3.5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <select value={speakerFilter} onChange={e => { setSpeakerFilter(e.target.value); }} className="w-full bg-transparent text-white/80 text-xs border-none outline-none appearance-none cursor-pointer">
                  {speakers.map(sp => <option key={sp} value={sp} className="text-black">{sp === 'all' ? 'All Speakers' : sp}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-2">
                <svg className="w-3.5 h-3.5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); }} className="w-full bg-transparent text-white/80 text-xs border-none outline-none appearance-none cursor-pointer">
                  {years.map(y => <option key={y} value={y} className="text-black">{y === 'all' ? 'All Years' : y}</option>)}
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT — featured player + details */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/60 ring-1 ring-white/10">
              {videoInfo && embedUrl ? (
                videoInfo.platform === 'youtube' ? (
                  <div className="relative w-full h-full">
                    <YouTubePlayer videoId={videoInfo.id} />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <iframe src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`} title={s.title} className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay; fullscreen" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation" />
                    <button onClick={() => setPaused(true)} className="absolute top-2 right-2 z-30 text-white/80 bg-black/50 backdrop-blur min-h-[36px] px-2.5 rounded-lg text-xs font-medium hover:bg-black/70 transition-colors flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2"/></svg>
                      Pause
                    </button>
                    {paused && (
                      <div className="absolute inset-0 bg-black z-20 flex flex-col items-center justify-center">
                        <button onClick={() => setPaused(false)} className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-2xl hover:bg-white/25 transition-colors" aria-label="Resume">
                          <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                        <p className="text-white/60 text-xs mt-4">Paused</p>
                      </div>
                    )}
                  </div>
                )
              ) : videoInfo?.needsResolve ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Loading video...
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white/40 text-sm">Video unavailable for embedding</p>
                </div>
              )}

              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full text-white font-medium shadow-lg ${platformBadge.color}`}>
                  {BadgeIcon ? <BadgeIcon className="text-sm" /> : <TikTokIcon />} {platformBadge.label}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <button onClick={goPrev} disabled={selectedIndex <= 0} className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/20 text-white transition-colors ${selectedIndex <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/25'}`} aria-label="Previous sermon">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={goNext} disabled={selectedIndex >= filtered.length - 1} className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/20 text-white transition-colors ${selectedIndex >= filtered.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/25'}`} aria-label="Next sermon">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            {/* details below player */}
            <div className="mt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent ring-2 ring-white/20 flex items-center justify-center text-white text-sm font-bold">BC</div>
                  <div>
                    <h1 className="text-lg md:text-xl font-display font-semibold leading-tight">{s.title}</h1>
                    <p className="text-sm text-white/50 mt-0.5">
                      {s.speaker || 'Bethel Church'} · {s.date ? new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => setLiked(p => ({ ...p, [selectedId]: !p[selectedId] }))} className="flex flex-col items-center gap-1 text-white group shrink-0 min-w-[48px]">
                  {liked[selectedId] ? <HiHeart className="text-3xl text-red-500 transition-transform group-active:scale-125" /> : <HiOutlineHeart className="text-3xl text-white/80 transition-transform group-hover:scale-110 group-active:scale-125" />}
                  <span className="text-xs font-medium text-white/50">{liked[selectedId] ? 'Liked' : ''}</span>
                </button>
              </div>

              {s.description && (
                <p className="mt-4 text-sm text-white/70 leading-relaxed whitespace-pre-line">{s.description}</p>
              )}

              <div className="mt-4 flex items-center gap-2 text-white/30 text-xs">
                <a href="/podcast" className="hover:text-white/60 transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8"/></svg>
                  Podcast
                </a>
                <span className="text-white/20">·</span>
                <span>{selectedIndex + 1} of {filtered.length}</span>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR — recommended + latest */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 border-l border-white/10 bg-[#0d0d0d]">
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/90">Recommended</h2>
              <span className="text-[10px] text-white/30">{filtered.length} sermons</span>
            </div>
            <div className="px-2 space-y-1">
              {filtered.slice(0, 8).map(item => (
                <div key={item.id} className={selectedId === item.id ? 'rounded-xl bg-white/5 ring-1 ring-primary/40' : ''}>
                  {item.id === s.id
                    ? <div className="flex w-full items-center gap-3 rounded-xl p-2">
                        <div className="w-20 h-12 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-primary">Now Playing</p>
                          <p className="truncate text-[10px] text-white/40 mt-0.5">{s.title}</p>
                        </div>
                      </div>
                    : sidebar([item], '', (id) => setSelectedId(id))}
                </div>
              ))}
            </div>

            {events.length > 0 && (
              <>
                <div className="px-4 mt-6 mb-2"><h2 className="text-sm font-semibold text-white/90">Upcoming Events</h2></div>
                <div className="px-2 space-y-1">
                  {events.slice(0, 4).map(ev => (
                    <Link key={ev.id} to="/events" className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition-colors min-h-[52px]">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                        <span className="text-[8px] uppercase text-white/40 font-semibold">{ev.date ? new Date(ev.date).toLocaleDateString(undefined, { month: 'short' }) : ''}</span>
                        <span className="text-sm font-bold text-white/90">{ev.date ? new Date(ev.date).getDate() : ''}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white/90">{ev.title}</p>
                        <p className="truncate text-[10px] text-white/40">{ev.location || ev.time || 'Bethel Church'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="px-5 py-4 border-t border-white/10">
            <Link to="/live" className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Watch Live Services</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
