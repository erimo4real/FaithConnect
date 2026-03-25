import { useState } from 'react';

const SermonCard = ({ sermon }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={sermon.thumbnail}
          alt={sermon.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {sermon.audioUrl && (
            <span className="bg-secondary text-primary text-xs font-bold px-2 py-1 rounded">
              AUDIO
            </span>
          )}
          {sermon.videoUrl && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              VIDEO
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary mb-1">{sermon.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{sermon.speaker}</p>
        <p className="text-gray-500 text-sm mb-4">{formatDate(sermon.date)}</p>

        {sermon.videoUrl && (
          <div className="mb-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
            >
              {isPlaying ? 'Close Video' : 'Watch Video'}
            </button>
            {isPlaying && (
              <div className="mt-2">
                <iframe
                  src={sermon.videoUrl}
                  title={sermon.title}
                  className="w-full h-48 rounded"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        {sermon.audioUrl && (
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-600 mb-2">🎧 Audio Sermon</p>
            <audio controls className="w-full">
              <source src={sermon.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {!sermon.audioUrl && !sermon.videoUrl && (
          <p className="text-gray-500 text-sm italic">Media coming soon</p>
        )}
      </div>
    </div>
  );
};

export default SermonCard;
