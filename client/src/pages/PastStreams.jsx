import { useState, useEffect } from 'react';
import { fetchStreamArchive } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { FaPlay, FaClock, FaFacebook, FaYoutube } from 'react-icons/fa';

function getYoutubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return m ? m[1] : null;
}

export default function PastStreams() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchStreamArchive().then(setItems).catch(() => {});
  }, []);

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-accent">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Past Streams</h1>
            <p className="text-xl">Watch recorded services anytime</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Past Streams', link: '/past-streams' }]} />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center py-16">No past streams yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((s) => {
                const videoId = getYoutubeId(s.youtube_url);
                const isFacebook = s.youtube_url?.includes('facebook.com');
                return (
                  <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                    <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video bg-gray-900 group">
                      {videoId ? (
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                          {isFacebook ? <FaFacebook className="text-4xl text-blue-500" /> : <FaClock className="text-4xl" />}
                          <span className="text-xs">{isFacebook ? 'Facebook Video' : 'No preview'}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
                          <FaPlay className="text-white text-xl ml-1" />
                        </div>
                      </div>
                    </a>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 truncate">{s.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        {isFacebook ? <><FaFacebook className="text-blue-500" /> Facebook</> : <><FaYoutube className="text-red-500" /> YouTube</>}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(s.activated_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
