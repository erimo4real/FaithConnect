import { useState, useEffect, useRef } from 'react';
import { fetchStreamArchive } from '../services/api';
import { FaPlay, FaFacebook, FaYoutube } from 'react-icons/fa';
import { HiHeart, HiOutlineHeart, HiArrowUp } from 'react-icons/hi';

function getYoutubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return m ? m[1] : null;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function PastStreams() {
  const [items, setItems] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [playingId, setPlayingId] = useState(null);
  const [liked, setLiked] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    fetchStreamArchive().then(async (data) => {
      setItems(data);
      const fbItems = data.filter(s => s.youtube_url?.includes('facebook.com'));
      if (fbItems.length === 0) return;
      const results = await Promise.allSettled(
        fbItems.map(s =>
          fetch(`${API_URL}/streams/thumbnail?url=${encodeURIComponent(s.youtube_url)}`)
            .then(r => r.json())
            .then(d => ({ id: s.id, url: d.thumbnail }))
        )
      );
      const map = {};
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.url) {
          map[r.value.id] = r.value.url;
        }
      }
      setThumbnails(map);
    }).catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500">No past streams yet</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth">
      {items.map((s, i) => {
        const videoId = getYoutubeId(s.youtube_url);
        const isFacebook = s.youtube_url?.includes('facebook.com');
        const fbThumb = thumbnails[s.id];
        const isPlaying = playingId === s.id;

        return (
          <div key={s.id} className="relative w-full h-screen snap-start overflow-hidden bg-black">
            {isPlaying ? (
              <div className="absolute inset-0 bg-black z-20">
                <iframe
                  src={videoId
                    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`
                    : `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(s.youtube_url)}&show_text=false`
                  }
                  title={s.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay"
                />
                <button
                  onClick={() => setPlayingId(null)}
                  className="absolute top-12 right-4 text-white/70 text-xs bg-black/60 px-3 py-1.5 rounded-full z-30"
                >
                  Close
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPlayingId(s.id)}
                className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none z-10"
              >
                {videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    onError={(e) => { if (e.target.src.includes('maxresdefault')) e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
                  />
                ) : fbThumb ? (
                  <img
                    src={fbThumb}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <FaFacebook className="text-8xl text-blue-500/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent"></div>
              </button>
            )}

            <div className={`absolute right-3 bottom-32 flex flex-col items-center gap-5 z-10 ${isPlaying ? 'hidden' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                BC
              </div>

              <div className="flex flex-col items-center gap-0.5 text-right">
                <p className="text-white text-sm font-bold leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Bethel Church</p>
                <p className="text-white/80 text-xs leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] text-right">{s.title}</p>
                <div className="flex flex-col items-center gap-1 mt-1">
                  <p className="text-white/60 text-[10px]">
                    {new Date(s.deactivated_at || s.activated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded ${isFacebook ? 'bg-blue-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
                    {isFacebook ? <FaFacebook className="text-[9px]" /> : <FaYoutube className="text-[9px]" />}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <button
                  onClick={() => setLiked(p => ({ ...p, [s.id]: !p[s.id] }))}
                  className="flex flex-col items-center gap-0.5 text-white"
                >
                  {liked[s.id] ? (
                    <HiHeart className="text-3xl text-red-500" />
                  ) : (
                    <HiOutlineHeart className="text-3xl text-white" />
                  )}
                  <span className="text-[10px] font-light text-white/80">{liked[s.id] ? '1' : ''}</span>
                </button>
              </div>
              <a
                href={s.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-0.5 text-white"
              >
                <HiArrowUp className="text-3xl text-white" />
                <span className="text-[10px] font-light text-white/80">Share</span>
              </a>
            </div>

            <div className={`absolute left-4 bottom-16 right-16 z-10 ${isPlaying ? 'hidden' : ''}`}></div>
          </div>
        );
      })}
    </div>
  );
}
