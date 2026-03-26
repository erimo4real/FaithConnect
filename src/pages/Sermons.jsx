import { useState } from 'react';
import SermonCard from '../components/SermonCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { FaMicrophone, FaVideo, FaFilter } from 'react-icons/fa';
import { sermons } from '../data/sermons';

const Sermons = () => {
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const speakers = ['all', ...new Set(sermons.map(s => s.speaker))];
  const years = ['all', ...new Set(sermons.map(s => s.date.substring(0, 4)))];

  const filteredSermons = sermons.filter(sermon => {
    if (speakerFilter !== 'all' && sermon.speaker !== speakerFilter) return false;
    if (yearFilter !== 'all' && !sermon.date.startsWith(yearFilter)) return false;
    return true;
  });

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-purple to-blue">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Sermons</h1>
            <p className="text-xl">Watch or listen to our past messages</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Sermons', link: '/sermons' }]} />

      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <FaFilter /> Filters
              </button>
              <p className="text-gray-600">
                Showing <span className="font-bold text-primary">{filteredSermons.length}</span> sermons
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={speakerFilter}
                onChange={(e) => setSpeakerFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white"
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
              <p className="text-sm text-gray-500 mb-2">Media Type:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMediaFilter('all')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    mediaFilter === 'all' ? 'bg-secondary text-primary' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setMediaFilter('audio')}
                  className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                    mediaFilter === 'audio' ? 'bg-secondary text-primary' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaMicrophone /> Audio
                </button>
                <button
                  onClick={() => setMediaFilter('video')}
                  className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                    mediaFilter === 'video' ? 'bg-secondary text-primary' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaVideo /> Video
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {filteredSermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No sermons match your filters.</p>
              <button
                onClick={() => { setSpeakerFilter('all'); setYearFilter('all'); setMediaFilter('all'); }}
                className="mt-4 text-secondary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Subscribe to Our Podcast</h2>
          <p className="text-gray-600 mb-6">Get our sermons delivered to your favorite podcast app</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <FaMicrophone /> Apple Podcasts
            </a>
            <a href="#" className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
              Spotify
            </a>
            <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <FaVideo /> Google Podcasts
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sermons;
