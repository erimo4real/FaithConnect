import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Renders a sermon video from TikTok using TikTok's official embed widget
 * (embed.js), so the video plays INSIDE bethelchurchng.com — visitors are
 * never sent to tiktok.com.
 *
 * How it works:
 *  - TikTok's embed.js scans the page for <blockquote class="tiktok-embed">
 *    nodes and replaces each with a player iframe.
 *  - Re-inserting a fresh <script> node re-runs that scan, which is how the
 *    player is re-created for every sermon without reloading the page.
 *  - The player signals readiness by posting its rendered height to the host
 *    page. If no signal arrives within the watchdog window we keep the embed
 *    mounted but surface an in-page recovery bar (TikTok rate-limits embed
 *    data calls per visitor, especially after rapid sermon switching).
 */

let scriptPromise = null;

function loadTikTokScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    script.dataset.ttEmbed = '1';
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Could not load the TikTok player'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

function rescanTikTokScript() {
  const existing = document.querySelector('script[data-tt-embed]');
  if (existing) existing.remove();
  scriptPromise = null;
  return loadTikTokScript();
}

function isReadySignal(data) {
  let parsed = data;
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed); } catch { return false; }
  }
  return !!parsed && typeof parsed === 'object' && typeof parsed.height === 'number';
}

function isTikTokOrigin(origin) {
  try {
    return /(^|\.)tiktok\.com$/.test(new URL(origin).hostname);
  } catch {
    return false;
  }
}

// Only https TikTok URLs may become anchor hrefs — anything else in the
// sermon record falls back to the canonical video URL.
function safeTikTokLink(citeUrl, videoId) {
  const fallback = `https://www.tiktok.com/@bethelchurchng/video/${videoId}`;
  return typeof citeUrl === 'string' && /^https:\/\//i.test(citeUrl) ? citeUrl : fallback;
}

export default function TikTokEmbed({ videoId, citeUrl, title }) {
  const hostRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setReady(false);
    setShowFallback(false);
    setAttempt((a) => a + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let gotSignal = false;
    const host = hostRef.current;
    if (!host || !videoId) return undefined;

    const link = safeTikTokLink(citeUrl, videoId);

    // Build the blockquote imperatively — embed.js replaces it with the player.
    host.replaceChildren();
    const bq = document.createElement('blockquote');
    bq.className = 'tiktok-embed';
    bq.setAttribute('cite', link);
    bq.setAttribute('data-video-id', videoId);
    bq.style.maxWidth = '100%';
    bq.style.minWidth = '220px';
    bq.style.margin = '0';
    const section = document.createElement('section');
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = title || 'Watch this sermon on TikTok';
    section.appendChild(anchor);
    bq.appendChild(section);
    host.appendChild(bq);

    const onMessage = (e) => {
      if (!cancelled && isTikTokOrigin(e?.origin) && isReadySignal(e?.data)) {
        gotSignal = true;
        setReady(true);
        setShowFallback(false);
      }
    };
    window.addEventListener('message', onMessage);

    (attempt > 0 ? rescanTikTokScript() : loadTikTokScript()).catch(() => {
      if (!cancelled) setShowFallback(true);
    });

    // Watchdog: TikTok throttles player data per visitor. If the player never
    // signals readiness, keep it mounted but offer recovery options.
    const timer = setTimeout(() => {
      if (!cancelled && !gotSignal) setShowFallback(true);
    }, 9000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      host.replaceChildren();
    };
  }, [videoId, citeUrl, title, attempt]);

  return (
    <div className="relative w-full h-full">
      <div ref={hostRef} className="tt-embed-host w-full h-full" />

      {!ready && !showFallback && (
        <div className="absolute inset-0 flex items-start justify-center pt-16 pointer-events-none">
          <div className="flex items-center gap-2 text-white/70 text-sm bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Loading video...
          </div>
        </div>
      )}

      {showFallback && (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-black/85 backdrop-blur border-t border-white/10 px-4 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <span className="text-white/70">Video taking long to load?</span>
          <button
            type="button"
            onClick={retry}
            className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors min-h-[36px]"
          >
            Try again
          </button>
          <a
            href={safeTikTokLink(citeUrl, videoId)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium hover:bg-accent transition-colors min-h-[36px] inline-flex items-center"
          >
            Watch on TikTok ↗
          </a>
        </div>
      )}
    </div>
  );
}
