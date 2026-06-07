import { sermons } from '../data/sermons';
import FadeInSection from '../components/FadeInSection';

const Podcast = () => {
  const podcastEpisodes = sermons.map((sermon, index) => ({
    ...sermon,
    duration: `${Math.floor(Math.random() * 30) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    episodeNumber: index + 1
  }));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <FadeInSection>
        <section className="bg-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Podcast</h1>
            <p className="text-xl">BETHEL CHURCH Podcast - Sermons & Teaching</p>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold font-display text-primary mb-6">Latest Episodes</h2>
                <div className="space-y-4">
                  {podcastEpisodes.map((episode) => (
                    <div key={episode.id} className="card p-4 flex gap-4 hover:shadow-lg transition-shadow">
                      <img
                        src={episode.thumbnail}
                        alt={episode.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-secondary/20 text-primary px-2 py-1 rounded">
                            Episode {episode.episodeNumber}
                          </span>
                          {episode.audioUrl && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">🎧 Audio</span>}
                          {episode.videoUrl && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">📺 Video</span>}
                        </div>
                        <h3 className="font-bold text-primary">{episode.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{episode.speaker} • {formatDate(episode.date)}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="text-secondary font-semibold text-sm hover:underline">▶️ Play</button>
                          <span className="text-gray-400 text-sm">⏱️ {episode.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="card p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-primary mb-4">Subscribe</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Never miss an episode!</p>
                  
                  <div className="space-y-3">
                    <a href="#" className="block bg-gray-800 text-white text-center py-3 rounded-lg hover:bg-gray-700">
                      🎧 Apple Podcasts
                    </a>
                    <a href="#" className="block bg-primary text-white text-center py-3 rounded-lg hover:bg-primary/90">
                      🎵 Spotify
                    </a>
                    <a href="#" className="block bg-primary text-white text-center py-3 rounded-lg hover:bg-primary/90">
                      📻 Google Podcasts
                    </a>
                    <a href="#" className="block bg-primary text-white text-center py-3 rounded-lg hover:bg-primary/90">
                      🔴 YouTube
                    </a>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-bold text-primary mb-2">RSS Feed</h4>
                    <input
                      type="text"
                      value="https://bethelchurch.org/feed/podcast"
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border rounded text-sm"
                    />
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-bold text-primary mb-2">🎙️ About the Podcast</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
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
