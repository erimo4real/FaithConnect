import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SermonCard from '../components/SermonCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { FaMicrophone, FaVideo, FaFilter, FaFacebook, FaYoutube } from 'react-icons/fa';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { fetchSermons } from '../services/api';
import FadeInSection from '../components/FadeInSection';

function getYoutubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return m ? m[1] : null;
}

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [liked, setLiked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fc_sermon_liked') || '{}'); } catch { return {}; }
  });
  const containerRef = useRef(null);
  const touchRef = useRef(null);
  const transitioning = useRef(false);

  useEffect(() => {
    localStorage.setItem('fc_sermon_liked', JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    fetchSermons()
      .then(data => setSermons(data.map(s => ({ ...s, audioUrl: s.audio_url, videoUrl: s.video_url }))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const speakers = ['all', ...new Set(sermons.map(s => s.speaker))];
  const years = ['all', ...new Set(sermons.map(s => s.date?.substring(0, 4)))];

  const filteredSermons = sermons.filter(sermon => {
    if (speakerFilter !== 'all' && sermon.speaker !== speakerFilter) return false;
    if (yearFilter !== 'all' && !sermon.date?.startsWith(yearFilter)) return false;
    return true;
  });

  const videoSermons = filteredSermons.filter(s => s.videoUrl);

  const goNext = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    setPlayingIndex(i => Math.min(i + 1, videoSermons.length - 1));
    setTimeout(() => { transitioning.current = false; }, 400);
  }, [videoSermons.length]);

  const goPrev = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    setPlayingIndex(i => Math.max(i - 1, 0));
    setTimeout(() => { transitioning.current = false; }, 400);
  }, []);

  useEffect(() => {
    if (playingIndex === null) return;
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
  }, [goNext, goPrev, playingIndex]);

  useEffect(() => {
    if (playingIndex === null) return;
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
  }, [goNext, goPrev, playingIndex]);

  useEffect(() => {
    if (playingIndex === null) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, playingIndex]);

  const vs = playingIndex !== null ? videoSermons[playingIndex] : null;
  const videoId = vs ? getYoutubeId(vs.videoUrl) : null;
  const isFacebook = vs?.videoUrl?.includes('facebook.com');

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Sermons</h1>
            <p className="text-xl">Watch or listen to our past messages</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Sermons', link: '/sermons' }]} />

      <FadeInSection>
        <section className="section-padding bg-gray-50 dark:bg-gray-900 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FaFilter /> Filters
                </button>
                <p className="text-gray-600 dark:text-gray-400">
                  {loading ? 'Loading...' : `Showing ${filteredSermons.length} sermons`}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={speakerFilter}
                  onChange={(e) => setSpeakerFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100"
                >
                  {speakers.map(speaker => (
                    <option key={speaker} value={speaker}>
                      {speaker === 'all' ? 'All Speakers' : speaker}
                    </option>
                  ))}
                </select>

                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Media Type:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMediaFilter('all')}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      mediaFilter === 'all' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setMediaFilter('audio')}
                    className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                      mediaFilter === 'audio' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FaMicrophone /> Audio
                  </button>
                  <button
                    onClick={() => setMediaFilter('video')}
                    className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                      mediaFilter === 'video' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FaVideo /> Video
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-gray-400 dark:text-gray-500">Loading sermons...</p>
              </div>
            ) : filteredSermons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSermons.map((sermon, i) => (
                  <div key={sermon.id} className="relative">
                    <SermonCard sermon={sermon} />
                    {sermon.videoUrl && (
                      <button
                        onClick={() => {
                          const idx = videoSermons.findIndex(s => s.id === sermon.id);
                          if (idx !== -1) setPlayingIndex(idx);
                        }}
                        className="absolute top-2 left-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full hover:bg-black/80 transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        Fullscreen
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No sermons match your filters.</p>
                <button
                  onClick={() => { setSpeakerFilter('all'); setYearFilter('all'); setMediaFilter('all'); }}
                  className="mt-4 text-primary font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-display font-bold text-primary mb-4">Subscribe to Our Podcast</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get our sermons delivered to your favorite podcast app</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/podcast" className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
                <FaMicrophone /> Listen on Podcast
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {playingIndex !== null && vs && (
        <div ref={containerRef} className="fixed inset-0 z-50 bg-black">
          <div className="fixed inset-0 bg-black z-50 md:hidden flex items-center justify-center">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0` : `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(vs.videoUrl)}&show_text=false`}
                title={vs.title}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen"
              />
            </div>
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
              <button onClick={() => setPlayingIndex(null)} className="text-white/70 bg-black/40 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/60 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div className="flex items-center gap-2">
                <p className="text-white/50 text-xs">{playingIndex + 1} / {videoSermons.length}</p>
                <button onClick={() => setPlayingIndex(null)} className="text-white/70 text-xs bg-black/60 min-h-[44px] px-4 rounded-full hover:bg-black/80 transition-colors">Close</button>
              </div>
            </div>
          </div>

          <div className="hidden md:flex h-full items-center justify-center">
            <div className="relative w-full max-w-5xl px-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
                <iframe
                  src={videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0` : `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(vs.videoUrl)}&show_text=false`}
                  title={vs.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen"
                />
                <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
                  <button onClick={() => setPlayingIndex(null)} className="text-white/70 text-xs bg-black/60 min-h-[44px] px-4 rounded-full hover:bg-black/80 transition-colors">Close</button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 px-1">
                <p className="text-white/30 text-xs">{playingIndex + 1} of {videoSermons.length}</p>
                <div className="flex items-center gap-4">
                  <p className="text-white text-sm font-medium">{vs.title}</p>
                  <p className="text-white/50 text-xs">{vs.speaker}</p>
                  {playingIndex > 0 && <button onClick={goPrev} className="text-white/30 hover:text-white/60 text-xs transition-colors">&uarr; Previous</button>}
                  {playingIndex < videoSermons.length - 1 && <button onClick={goNext} className="text-white/30 hover:text-white/60 text-xs transition-colors">Next &darr;</button>}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setLiked(p => ({ ...p, [vs.id]: !p[vs.id] }))} className="flex flex-col items-center gap-0.5 text-white">
                    {liked[vs.id] ? <HiHeart className="text-2xl text-red-500" /> : <HiOutlineHeart className="text-2xl text-white/70" />}
                    <span className="text-[10px] font-light text-white/50">{liked[vs.id] ? '1' : ''}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sermons;
