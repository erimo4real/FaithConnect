import { useEffect, useRef, useState } from 'react';

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

  const showOverlay = (isPaused || isEnded) && relatedVideos.length > 0;

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {showOverlay && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-20 p-4">
          <div className="w-full max-w-md max-h-full overflow-y-auto">
            <p className="text-white text-sm font-semibold mb-3">More videos</p>
            <div className="space-y-2">
              {relatedVideos.map((v, i) => (
                <button
                  key={v.id || i}
                  onClick={() => onSelectRelated?.(v)}
                  className="w-full flex gap-3 text-left rounded-lg overflow-hidden hover:bg-white/10 transition-colors group"
                >
                  <img
                    src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/default.jpg`}
                    alt=""
                    className="w-24 shrink-0 aspect-video object-cover rounded"
                    loading="lazy"
                  />
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
