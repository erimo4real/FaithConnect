import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'worship', label: 'Worship' },
    { id: 'events', label: 'Events' },
    { id: 'youth', label: 'Youth' },
    { id: 'outreach', label: 'Outreach' },
    { id: 'videos', label: 'Videos' }
  ];

  const galleryItems = [
    {
      id: 1,
      category: 'worship',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      title: 'Sunday Worship',
      description: 'Morning service celebration'
    },
    {
      id: 2,
      category: 'events',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop',
      title: 'Easter Celebration',
      description: 'Easter Sunday service'
    },
    {
      id: 3,
      category: 'youth',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
      title: 'Youth Fellowship',
      description: 'Young believers gathering'
    },
    {
      id: 4,
      category: 'worship',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=600&fit=crop',
      title: 'Worship Team',
      description: 'Praise and worship team'
    },
    {
      id: 5,
      category: 'outreach',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      title: 'Community Outreach',
      description: 'Serving our community'
    },
    {
      id: 6,
      category: 'events',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      title: 'Christmas Service',
      description: 'Annual Christmas celebration'
    },
    {
      id: 7,
      category: 'youth',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop',
      title: 'Youth Camp',
      description: 'Summer youth camp activities'
    },
    {
      id: 8,
      category: 'worship',
      type: 'video',
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      title: 'Worship Highlights',
      description: 'Highlights from our worship services'
    },
    {
      id: 9,
      category: 'outreach',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
      title: 'Food Drive',
      description: 'Community food drive initiative'
    },
    {
      id: 10,
      category: 'events',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      title: 'Conference',
      description: 'Annual church conference'
    },
    {
      id: 11,
      category: 'videos',
      type: 'video',
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=600&fit=crop',
      title: 'Testimony Video',
      description: 'Member testimony分享'
    },
    {
      id: 12,
      category: 'youth',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
      title: 'Youth Worship',
      description: 'Youth group worship night'
    }
  ];

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

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  filter === cat.id
                    ? 'bg-secondary text-primary'
                    : 'bg-white text-gray-700 hover:bg-secondary hover:text-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                onClick={() => setLightboxImage(item)}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="relative">
                    <img
                      src={item.thumbnail}
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
        </div>
      </section>

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
              src={lightboxImage.src}
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

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Share Your Photos</h2>
          <p className="text-gray-600 mb-6">Have photos from our church events? Share them with us!</p>
          <a
            href="/contact"
            className="inline-block bg-secondary text-primary font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Submit Photos
          </a>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
