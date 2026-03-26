import { sermons } from '../data/sermons';

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
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Podcast</h1>
          <p className="text-xl">BETHEL CHURCH Podcast - Sermons & Teaching</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-primary mb-6">Latest Episodes</h2>
              <div className="space-y-4">
                {podcastEpisodes.map((episode) => (
                  <div key={episode.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow">
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
                        {episode.audioUrl && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🎧 Audio</span>}
                        {episode.videoUrl && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">📺 Video</span>}
                      </div>
                      <h3 className="font-bold text-primary">{episode.title}</h3>
                      <p className="text-sm text-gray-600">{episode.speaker} • {formatDate(episode.date)}</p>
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
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold text-primary mb-4">Subscribe</h3>
                <p className="text-gray-600 mb-4">Never miss an episode!</p>
                
                <div className="space-y-3">
                  <a href="#" className="block bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800">
                    🎧 Apple Podcasts
                  </a>
                  <a href="#" className="block bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700">
                    🎵 Spotify
                  </a>
                  <a href="#" className="block bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700">
                    📻 Google Podcasts
                  </a>
                  <a href="#" className="block bg-orange-600 text-white text-center py-3 rounded-lg hover:bg-orange-700">
                    🔴 YouTube
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-bold text-primary mb-2">RSS Feed</h4>
                  <input
                    type="text"
                    value="https://bethelchurch.org/feed/podcast"
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border rounded text-sm"
                  />
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-bold text-primary mb-2">🎙️ About the Podcast</h4>
                  <p className="text-gray-600 text-sm">
                    BETHEL CHURCH Podcast features weekly sermons and teaching from our pastoral team. 
                    Subscribe to stay encouraged and grow in your faith.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Podcast;
