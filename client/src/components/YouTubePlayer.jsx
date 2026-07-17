import { useEffect, useRef, useCallback } from 'react';

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

export default function YouTubePlayer({ videoId }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    let player = null;
    overlayRef.current?.classList.add('hidden');
    ensureAPI().then(() => {
      if (!containerRef.current) return;
      player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e) => {
            const paused = e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED;
            if (containerRef.current) {
              containerRef.current.style.display = paused ? 'none' : 'block';
            }
            if (overlayRef.current) {
              overlayRef.current.classList.toggle('hidden', !paused);
            }
          },
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
    player.playVideo();
    if (overlayRef.current) overlayRef.current.classList.add('hidden');
    if (containerRef.current) containerRef.current.style.display = 'block';
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <div ref={overlayRef} className="absolute inset-0 bg-black flex flex-col z-20 hidden">
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <button
            onClick={handleResume}
            className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center shadow-2xl hover:bg-white/25 transition-colors"
            aria-label="Resume"
          >
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <p className="text-white/60 text-xs mt-4">Paused</p>
        </div>
      </div>
    </div>
  );
}
