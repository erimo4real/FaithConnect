import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchSermons } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import FadeInSection from '../components/FadeInSection';
import { FaMicrophone, FaHeadphones, FaPlay, FaPause, FaTimes } from 'react-icons/fa';

const WaveVisualizer = ({ analyser, barCount = 32, height = 96, mini = false }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const cacheRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const ctx = canvas.getContext('2d');
    if (!cacheRef.current) cacheRef.current = new Uint8Array(bufferLength);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const hasSignal = dataArray.some(v => v > 10);
      if (hasSignal) cacheRef.current.set(dataArray);

      const frame = hasSignal ? dataArray : cacheRef.current;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bars = barCount;
      const gap = mini ? 1 : 2;
      const barW = (w - gap * (bars - 1)) / bars;

      for (let i = 0; i < bars; i++) {
        const idx = Math.floor((i / bars) * bufferLength);
        const val = frame[idx] / 255;
        const barH = val * h;
        const x = i * (barW + gap);
        const y = h - barH;

        ctx.fillStyle = mini
          ? `rgba(255,255,255,${0.3 + val * 0.7})`
          : `hsla(${210 + val * 30}, 70%, 55%, ${0.4 + val * 0.6})`;
        ctx.fillRect(x, y, barW, Math.max(barH, mini ? 1 : 2));
      }
    };
    draw();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [analyser, barCount, height, mini]);

  return (
    <canvas
      ref={canvasRef}
      width={mini ? 120 : 240}
      height={height}
      className={`rounded-lg flex-shrink-0 ${mini ? 'w-12 h-10 sm:w-[60px] sm:h-12' : 'w-24 sm:w-28 md:w-32 h-[72px] sm:h-20 md:h-24'}`}
    />
  );
};

const SmallVisualizer = () => (
  <span className="inline-flex items-end gap-[2px] h-4 ml-2">
    {[1,2,3,4].map(i => (
      <span key={i} className="w-[3px] bg-white rounded-full animate-visualizer" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </span>
);

const Podcast = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [analyser, setAnalyser] = useState(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    fetchSermons()
      .then(data => {
        const audioSermons = data
          .filter(s => s.audio_url || s.audioUrl)
          .map((s, i) => ({
            ...s,
            audioUrl: s.audio_url || s.audioUrl,
            episodeNumber: i + 1
          }));
        setEpisodes(audioSermons);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const initAudioCtx = () => {
    if (audioCtxRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = ctx.createMediaElementSource(audio);
      const a = ctx.createAnalyser();
      a.fftSize = 64;
      src.connect(a);
      a.connect(ctx.destination);
      audioCtxRef.current = ctx;
      sourceRef.current = src;
      setAnalyser(a);
    } catch (e) {
      console.warn('AudioContext:', e);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playingEpisode?.audioUrl) return;

    const url = playingEpisode.audioUrl;

    if (audio.getAttribute('data-src') !== url) {
      audio.src = url;
      audio.setAttribute('data-src', url);
    }

    audio.play().catch(() => {});

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlayingId(null);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, [playingId]);

  const togglePlay = (id) => {
    const audio = audioRef.current;
    if (playingId === id) {
      audio?.pause();
      setPlayingId(null);
    } else {
      initAudioCtx();
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setPlayingId(id);
    }
  };

  const closePlayer = () => {
    audioRef.current?.pause();
    setPlayingId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const playingEpisode = episodes.find(e => e.id === playingId);

  return (
    <div className="pb-20">
      <div className="relative h-[clamp(180px,35vw,256px)] bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="font-display font-bold mb-2 text-[clamp(1.75rem,5vw,3rem)]">Podcast</h1>
            <p className="text-[clamp(0.85rem,2.5vw,1.25rem)]">BETHEL CHURCH Podcast &mdash; Sermons &amp; Teaching</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Podcast', link: '/podcast' }]} />

      <FadeInSection>
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="font-bold font-display text-primary mb-4 sm:mb-6 text-[clamp(1.2rem,3vw,1.5rem)]">Latest Episodes</h2>
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-16">
                    <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-gray-400">Loading episodes...</p>
                  </div>
                ) : episodes.length === 0 ? (
                  <p className="text-gray-400 text-center py-16">No audio sermons available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {episodes.map((episode) => (
                      <div key={episode.id} className={`card p-3 sm:p-4 flex gap-3 sm:gap-4 transition-shadow ${playingId === episode.id ? 'ring-2 ring-primary/30 shadow-lg' : 'hover:shadow-lg'}`}>
                        {playingId === episode.id ? (
                          <WaveVisualizer analyser={analyser} barCount={24} height={96} />
                        ) : (
                          <img
                            src={episode.thumbnail || '/churchlogo.png'}
                            alt={episode.title}
                            className="w-24 sm:w-28 md:w-32 h-[72px] sm:h-20 md:h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] sm:text-xs bg-secondary/20 text-primary px-2 py-1 rounded font-medium">
                              Ep. {episode.episodeNumber}
                            </span>
                          </div>
                          <h3 className="font-bold text-primary truncate text-sm sm:text-base">{episode.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {episode.speaker} &bull; {formatDate(episode.date)}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-4 mt-2 flex-wrap">
                            <button
                              onClick={() => togglePlay(episode.id)}
                              className="bg-primary text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5 min-h-[44px]"
                            >
                              {playingId === episode.id ? <FaPause className="text-xs" /> : <FaHeadphones className="text-xs" />}
                              {playingId === episode.id ? <><span className="hidden sm:inline">Now Playing</span><span className="sm:hidden">Playing</span><SmallVisualizer /></> : 'Play'}
                            </button>
                            <span className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                              <FaMicrophone className="text-[10px]" /> Audio
                            </span>
                          </div>
                          {playingId === episode.id && episode.audioUrl && (
                            <div className="mt-2 sm:mt-3">
                              <div className="bg-primary/5 rounded-lg p-2 sm:p-3">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <button onClick={() => togglePlay(episode.id)} className="text-primary hover:text-primary/80 transition-colors p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center">
                                    {playingId === episode.id ? <FaPause className="sm:text-base" /> : <FaPlay className="sm:text-base" />}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <div className="h-1 sm:h-1.5 bg-primary/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: duration ? `${(currentTime / duration) * 100}%` : 0 }} />
                                    </div>
                                    <div className="flex justify-between text-[9px] sm:text-[10px] text-primary/60 mt-0.5">
                                      <span>{formatTime(currentTime)}</span>
                                      <span>{formatTime(duration)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="card p-4 sm:p-6 sticky top-4">
                  <h3 className="font-bold text-primary mb-2 text-[clamp(1.1rem,2.5vw,1.25rem)]">About the Podcast</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                    BETHEL CHURCH Podcast features weekly sermons and teaching from our pastoral team. 
                    Subscribe to stay encouraged and grow in your faith.
                  </p>
                  <Link to="/sermons" className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-primary hover:text-primary/80 font-semibold transition-colors min-h-[44px]">
                    <FaPlay className="text-[10px]" /> Watch Video Sermons
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <audio ref={audioRef} className="hidden" />

      {playingEpisode && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface dark:bg-gray-900 border-t border-border shadow-2xl animate-slide-up">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-4">
            <WaveVisualizer analyser={analyser} barCount={16} height={48} mini />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-primary truncate">{playingEpisode.title}</p>
              <p className="text-[10px] sm:text-xs text-muted truncate">{playingEpisode.speaker}</p>
              <div className="h-1 bg-primary/10 rounded-full mt-1 overflow-hidden max-w-md">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: duration ? `${(currentTime / duration) * 100}%` : 0 }} />
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <span className="text-[10px] sm:text-xs text-muted hidden sm:block">{formatTime(currentTime)} / {formatTime(duration)}</span>
              <button onClick={() => togglePlay(playingEpisode.id)} className="text-primary hover:text-primary/80 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                {playingId === playingEpisode.id ? <FaPause size={16} className="sm:text-base" /> : <FaPlay size={16} className="sm:text-base" />}
              </button>
              <button onClick={closePlayer} className="text-muted hover:text-primary transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <FaTimes size={12} className="sm:text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Podcast;