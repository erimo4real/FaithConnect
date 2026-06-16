import { useState, useEffect, useRef } from 'react';
import { fetchStreamArchive } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { FaPlay, FaFacebook, FaYoutube, FaChevronDown } from 'react-icons/fa';
import FadeInSection from '../components/FadeInSection';

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
  const scrollRef = useRef(null);

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

  const latest = items[0];
  const previous = items.slice(1);

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-accent">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-2">Past Streams</h1>
            <p className="text-xl">Watch recorded services anytime</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Past Streams', link: '/past-streams' }]} />

      {items.length === 0 ? (
        <section className="section-padding min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500 text-center">No past streams yet</p>
        </section>
      ) : (
        <>
          <section className="pt-8 pb-4 bg-gray-900">
            <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-4">
                <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">LATEST</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-display">{latest.title}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(latest.deactivated_at || latest.activated_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {playingId === latest.id ? (
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                  <iframe
                    src={latest.youtube_url?.includes('youtube.com') || latest.youtube_url?.includes('youtu.be')
                      ? `https://www.youtube.com/embed/${getYoutubeId(latest.youtube_url)}?autoplay=1&controls=1`
                      : `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(latest.youtube_url)}&show_text=false`
                    }
                    title={latest.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay"
                  />
                </div>
              ) : (
                <a
                  href={latest.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group cursor-pointer"
                  onClick={(e) => { e.preventDefault(); setPlayingId(latest.id); }}
                >
                  {(() => {
                    const videoId = getYoutubeId(latest.youtube_url);
                    const isFacebook = latest.youtube_url?.includes('facebook.com');
                    const fbThumb = thumbnails[latest.id];
                    return videoId ? (
                      <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={latest.title} className="w-full h-full object-cover" loading="eager" />
                    ) : fbThumb ? (
                      <img src={fbThumb} alt={latest.title} className="w-full h-full object-cover" loading="eager" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <FaFacebook className="text-6xl text-blue-500/50" />
                      </div>
                    );
                  })()}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <FaPlay className="text-white text-2xl ml-1" />
                    </div>
                  </div>
                </a>
              )}
            </div>
          </section>

          {previous.length > 0 && (
            <div ref={scrollRef} className="relative">
              <FadeInSection>
                <div className="flex flex-col items-center py-6 text-gray-400 animate-bounce">
                  <span className="text-sm font-medium mb-1">Previous streams</span>
                  <FaChevronDown className="text-xl" />
                </div>
              </FadeInSection>

              <FadeInSection>
                <section className="section-padding pt-0">
                  <div className="max-w-5xl mx-auto px-4 space-y-3">
                    {previous.map((s, index) => {
                      const videoId = getYoutubeId(s.youtube_url);
                      const isFacebook = s.youtube_url?.includes('facebook.com');
                      const fbThumb = thumbnails[s.id];
                      return (
                        <div key={s.id} className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                          <div className="w-40 md:w-52 shrink-0 relative">
                            {playingId === s.id ? (
                              <div className="aspect-video">
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
                              </div>
                            ) : (
                              <a
                                href={s.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block relative aspect-video bg-gray-900 group cursor-pointer h-full"
                                onClick={(e) => { e.preventDefault(); setPlayingId(s.id); }}
                              >
                                {videoId ? (
                                  <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                                ) : fbThumb ? (
                                  <img src={fbThumb} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                    <FaFacebook className="text-3xl text-blue-500/50" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <FaPlay className="text-white text-sm ml-0.5" />
                                  </div>
                                </div>
                              </a>
                            )}
                          </div>
                          <div className="flex-1 py-3 pr-4 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-400 font-mono">#{items.length - index - 1}</span>
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isFacebook ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                {isFacebook ? <FaFacebook /> : <FaYoutube />}
                                {isFacebook ? 'Facebook' : 'YouTube'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate text-sm md:text-base">{s.title}</h3>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(s.deactivated_at || s.activated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </FadeInSection>
            </div>
          )}
        </>
      )}
    </div>
  );
}
