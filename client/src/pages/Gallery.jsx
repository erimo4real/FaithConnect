import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchGallery } from '../services/api';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import FadeInSection from '../components/FadeInSection';

const imgSrc = (src) => optimizeCloudinaryUrl(src, { width: 500 });

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery().then(data => {
      setGalleryItems(data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'worship', label: 'Worship' },
    { id: 'events', label: 'Events' },
    { id: 'young-adults', label: 'Young Adults' },
    { id: 'outreach', label: 'Outreach' },
  ];

  const uniqueCategories = [...new Set(galleryItems.map(i => i.category))];
  const allCategories = uniqueCategories.length > 0
    ? [{ id: 'all', label: 'All' }, ...uniqueCategories.map(c => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ') }))]
    : categories;

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-accent">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Gallery</h1>
            <p className="text-xl">Capturing moments of worship and ministry</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Gallery', link: '/gallery' }]} />

      <FadeInSection>
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                     filter === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-primary hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4">
            {loading ? <p className="text-gray-400 dark:text-gray-300 text-center py-8">Loading...</p> : filteredItems.length === 0 ? <p className="text-gray-400 dark:text-gray-300 text-center py-8">No images found.</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                  onClick={() => setLightboxImage(item)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={imgSrc(item.src)}
                      alt={item.title}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="relative">
                      <img
                        src={imgSrc(item.thumbnail)}
                        alt={item.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-5xl">▶️</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg">{item.title}</h3>
                      <p className="text-gray-300 text-sm">{item.description}</p>
                    </div>
                  </div>
                  {item.type === 'video' && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      VIDEO
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        </section>
      </FadeInSection>

      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-secondary"
            onClick={() => setLightboxImage(null)}
          >
            ×
          </button>
          {lightboxImage.type === 'image' ? (
            <img
              src={optimizeCloudinaryUrl(lightboxImage.src, { width: 1200 })}
              alt={lightboxImage.title}
              className="max-w-full max-h-full rounded-lg"
            />
          ) : (
            <iframe
              src={lightboxImage.src}
              className="w-full max-w-4xl aspect-video rounded-lg"
              frameBorder="0"
              allowFullScreen
            />
          )}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <h3 className="text-white font-bold text-xl">{lightboxImage.title}</h3>
            <p className="text-gray-300">{lightboxImage.description}</p>
          </div>
        </div>
      )}

      <FadeInSection>
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-display text-primary mb-4">Follow Us on Social Media</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Tag us in your photos using <span className="font-semibold text-primary">#BethelChurch</span> for a chance to be featured on this page!</p>
            <div className="flex justify-center gap-4">
              <a href="https://www.facebook.com/share/1RUs1gcjAg/" target="_blank" rel="noopener noreferrer" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors">Facebook</a>
              <a href="https://www.instagram.com/bethelchurchng?igsh=ZDh2c254bGk4MW41" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity">Instagram</a>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
};

export default Gallery;
