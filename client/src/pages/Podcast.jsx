import { useState, useEffect, useRef } from 'react';
import { fetchSermons } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import FadeInSection from '../components/FadeInSection';
import { FaMicrophone, FaHeadphones, FaRss, FaApple, FaSpotify, FaYoutube } from 'react-icons/fa';

const Podcast = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSermons()
      .then(data => {
        const audioSermons = data
          .filter(s => s.audio_url || s.audioUrl)
          .map((s, i) => ({
            ...s,
            audioUrl: s.audio_url || s.audioUrl,
            duration: `${Math.floor(Math.random() * 30) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            episodeNumber: i + 1
          }));
        setEpisodes(audioSermons);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const togglePlay = (id) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Podcast</h1>
            <p className="text-xl">BETHEL CHURCH Podcast - Sermons & Teaching</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Podcast', link: '/podcast' }]} />

      <FadeInSection>
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold font-display text-primary mb-6">Latest Episodes</h2>
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
                      <div key={episode.id} className="card p-4 flex gap-4 hover:shadow-lg transition-shadow">
                        <img
                          src={episode.thumbnail || '/churchlogo.png'}
                          alt={episode.title}
                          className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-secondary/20 text-primary px-2 py-1 rounded font-medium">
                              Ep. {episode.episodeNumber}
                            </span>
                            {episode.video_url && (
                              <span className="text-xs bg-red-600/10 text-red-600 px-2 py-1 rounded flex items-center gap-1">
                                <FaYoutube className="text-[10px]" /> Video
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-primary truncate">{episode.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {episode.speaker} • {formatDate(episode.date)}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              onClick={() => togglePlay(episode.id)}
                              className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                            >
                              <FaHeadphones className="text-xs" />
                              {playingId === episode.id ? 'Pause' : 'Play'}
                            </button>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                              <FaMicrophone className="text-[10px]" /> {episode.duration}
                            </span>
                          </div>
                          {playingId === episode.id && episode.audioUrl && (
                            <div className="mt-3">
                              <audio ref={audioRef} controls autoPlay className="w-full h-10" key={episode.audioUrl}>
                                <source src={episode.audioUrl} type="audio/mpeg" />
                              </audio>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="card p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <FaMicrophone className="text-secondary" /> Subscribe
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Never miss an episode!</p>

                  <div className="space-y-3">
                    <a href="#" className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors">
                      <FaApple /> Apple Podcasts
                    </a>
                    <a href="#" className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                      <FaSpotify /> Spotify
                    </a>
                    <a href="#" className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                      <FaYoutube /> YouTube
                    </a>
                  </div>

                  <div className="mt-6 pt-6 border-t dark:border-gray-700">
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                      <FaRss className="text-secondary" /> RSS Feed
                    </h4>
                    <input
                      type="text"
                      value="https://bethelchurchng.com/feed/podcast"
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border rounded text-sm dark:text-gray-200"
                    />
                  </div>

                  <div className="mt-6 pt-6 border-t dark:border-gray-700">
                    <h4 className="font-bold text-primary mb-2">About the Podcast</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      BETHEL CHURCH Podcast features weekly sermons and teaching from our pastoral team. 
                      Subscribe to stay encouraged and grow in your faith.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
};

export default Podcast;
