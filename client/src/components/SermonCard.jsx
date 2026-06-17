import { useState } from 'react';

const SermonCard = ({ sermon }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        {imgErr || !sermon.thumbnail ? (
          <div className="w-full aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
        ) : (
          <img
            src={sermon.thumbnail}
            alt={sermon.title}
            className="w-full aspect-video object-cover"
            onError={() => setImgErr(true)}
          />
        )}
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
                  src={sermon.videoUrl?.includes('youtube') ? sermon.videoUrl.replace('watch?v=', 'embed/') : sermon.videoUrl}
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
