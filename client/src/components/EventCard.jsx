import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

import { optimizeCloudinaryUrl } from '../utils/cloudinary';
const imgSrc = (src) => optimizeCloudinaryUrl(src, { width: 600 });

const EventCard = ({ event }) => {
  const [showPreview, setShowPreview] = useState(false);
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <div className="card overflow-hidden cursor-pointer hover:-translate-y-1" onClick={() => setShowPreview(true)}>
        <img
          src={imgSrc(event.image)}
          alt={event.title}
          className="w-full aspect-video object-cover"
          loading="lazy"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-primary mb-2 font-display">{event.title}</h3>
          <div className="space-y-1 mb-3">
            {event.date ? (
              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                <FaCalendarAlt className="text-secondary shrink-0" />
                {formatDate(event.date)}
              </p>
            ) : event.days ? (
              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                <FaCalendarAlt className="text-secondary shrink-0" />
                {event.days}
              </p>
            ) : null}
            {event.time && (
              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                <FaClock className="text-secondary shrink-0" />
                {event.time}
              </p>
            )}
            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
              <FaMapMarkerAlt className="text-secondary shrink-0" />
              {event.location}
            </p>
          </div>
          {event.description && <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold leading-relaxed line-clamp-3">{event.description}</p>}
        </div>
      </div>
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in" onClick={() => setShowPreview(false)}>
          <div className="relative max-w-4xl max-h-[90vh] mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPreview(false)} className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-gray-800 z-10" aria-label="Close preview"><FaTimes /></button>
            <img src={optimizeCloudinaryUrl(event.image, { width: 1200 })} alt={event.title} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl animate-scale-in" />
            <p className="text-white text-sm text-center mt-3">{event.title}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;
