import { useEffect, useRef, useState, useCallback } from 'react';

let apiReady = null;
function ensureAPI() {
  if (!apiReady) {
    apiReady = new Promise((resolve) => {
      if (window.YT?.Player) { resolve(); return; }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
  }
  return apiReady;
}

const states = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 };

export default function YouTubePlayer({ videoId, relatedVideos = [], onSelectRelated }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [playerState, setPlayerState] = useState(states.UNSTARTED);
  const isPaused = playerState === states.PAUSED;
  const isEnded = playerState === states.ENDED;
  const showOverlay = (isPaused || isEnded) && relatedVideos.length > 0;

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    let player = null;
    ensureAPI().then(() => {
      if (!containerRef.current) return;
      player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e) => setPlayerState(e.data),
        },
      });
      playerRef.current = player;
    });
    return () => {
      player?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  const handleResume = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isEnded) player.seekTo(0);
    player.playVideo();
  }, [isEnded]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ display: showOverlay ? 'none' : 'block' }}
      />
      {showOverlay && (
        <div className="absolute inset-0 bg-black flex flex-col z-20">
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <button
              onClick={handleResume}
              className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-2xl hover:bg-white/25 transition-colors group"
              aria-label={isEnded ? 'Play again' : 'Resume'}
            >
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <p className="text-white/60 text-xs mt-4">{isEnded ? 'Video ended' : 'Paused'}</p>
          </div>
          <div className="px-3 pb-3">
            <p className="text-white text-[11px] font-semibold mb-2 px-1">More videos</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {relatedVideos.map((v, i) => (
                <button
                  key={v.id || i}
                  onClick={() => onSelectRelated?.(v)}
                  className="flex-shrink-0 w-28 rounded-lg overflow-hidden hover:ring-2 hover:ring-white/40 transition-all group text-left relative"
                >
                  {v.thumbnail || v.videoId ? (
                    <img
                      src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                      alt=""
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <span className="text-white/40 text-lg font-bold">{v.title?.charAt(0)?.toUpperCase() || '?'}</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-1.5 pt-4 pb-1">
                    <p className="text-white text-[10px] font-medium leading-tight truncate">{v.title}</p>
                    {v.subtitle && <p className="text-white/60 text-[8px] mt-0.5">{v.subtitle}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
