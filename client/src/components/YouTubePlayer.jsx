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
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="flex flex-col items-center w-full max-w-lg max-h-full p-6">
            <button
              onClick={handleResume}
              className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-2xl hover:bg-white/25 transition-colors mb-5 group"
              aria-label={isEnded ? 'Play again' : 'Resume'}
            >
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <p className="text-white/60 text-xs mb-5">{isEnded ? 'Video ended' : 'Paused'}</p>
            <p className="text-white text-sm font-semibold mb-3">More videos</p>
            <div className="w-full max-h-[50vh] overflow-y-auto space-y-2">
              {relatedVideos.map((v, i) => (
                <button
                  key={v.id || i}
                  onClick={() => onSelectRelated?.(v)}
                  className="w-full flex gap-3 text-left rounded-lg overflow-hidden hover:bg-white/10 transition-colors group"
                >
                  {v.thumbnail || v.videoId ? (
                    <img
                      src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/default.jpg`}
                      alt=""
                      className="w-24 shrink-0 aspect-video object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-24 shrink-0 aspect-video rounded bg-gray-800 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 py-1 pr-2">
                    <p className="text-white text-xs font-medium truncate">{v.title}</p>
                    {v.subtitle && <p className="text-white/50 text-[10px] mt-0.5">{v.subtitle}</p>}
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
