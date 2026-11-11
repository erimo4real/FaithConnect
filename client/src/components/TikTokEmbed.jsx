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
 *  - Readiness is detected with a MutationObserver on the host: when embed.js
 *    inserts the player iframe, the widget did its job and the loading
 *    spinner is removed. (The player iframe never posts a postMessage we can
 *    rely on, so DOM observation is the source of truth; a height message
 *    from tiktok.com is still honored as extra confirmation.)
 *  - embed.js can take ~9s to fetch on a cold browser. If no player iframe
 *    appears within 12s the widget retries itself once, and only after that
 *    surfaces an in-page recovery bar.
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

// Re-running embed.js is what transforms blockquotes into players; a fresh
// <script> node (even served from cache) re-executes and re-scans the DOM.
function rescanTikTokScript() {
  const existing = document.querySelector('script[data-tt-embed]');
  if (existing) existing.remove();
  scriptPromise = null;
  return loadTikTokScript();
}

// Warm the TikTok player script while the visitor is still looking at the
// poster, so the first play click mounts the player almost instantly.
export function prefetchTikTokPlayer() {
  loadTikTokScript().catch(() => {});
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
  const [playerMounted, setPlayerMounted] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setPlayerMounted(false);
    setShowFallback(false);
    setAttempt((a) => a + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
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

    const markMounted = () => {
      if (cancelled) return;
      // The widget inserts its iframe at 0x0 (hidden) and only sizes it
      // once the player has actually loaded, ~10s later on a cold visitor.
      // "Mounted" therefore means a VISIBLE, sized iframe — otherwise we'd
      // drop the loading spinner while the user stares at a black box.
      const frame = host.querySelector('iframe');
      if (frame) {
        const rect = frame.getBoundingClientRect();
        if (rect.width > 50 && rect.height > 50) {
          setPlayerMounted(true);
          setShowFallback(false);
        }
      }
    };
    // Watch DOM structure AND style/class changes: embed.js sizes the
    // hidden iframe via inline styles, which childList-only observation
    // would miss. A short poll covers any remaining gaps.
    const observer = new MutationObserver(markMounted);
    observer.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    markMounted();
    const poll = setInterval(markMounted, 400);

    const onMessage = (e) => {
      if (!cancelled && isTikTokOrigin(e?.origin) && isReadySignal(e?.data)) {
        setPlayerMounted(true);
        setShowFallback(false);
      }
    };
    window.addEventListener('message', onMessage);

    rescanTikTokScript().catch(() => {
      if (!cancelled) setShowFallback(true);
    });

    // Watchdog. embed.js itself can take ~9s to fetch on a cold browser, and
    // the player another stretch to size its iframe; give it 15s, then retry
    // once. Only if the retry window also passes with nothing mounted offer
    // recovery.
    const visibleFrame = () => {
      const frame = host.querySelector('iframe');
      if (!frame) return null;
      const rect = frame.getBoundingClientRect();
      return rect.width > 50 && rect.height > 50 ? frame : null;
    };
    const first = setTimeout(() => {
      if (cancelled || visibleFrame()) return;
      if (attempt === 0) setAttempt(1);
    }, 15000);
    const second = setTimeout(() => {
      if (!cancelled && !visibleFrame()) setShowFallback(true);
    }, attempt > 0 ? 15000 : 30000);

    return () => {
      cancelled = true;
      clearTimeout(first);
      clearTimeout(second);
      clearInterval(poll);
      observer.disconnect();
      window.removeEventListener('message', onMessage);
      host.replaceChildren();
    };
  }, [videoId, citeUrl, title, attempt]);

  return (
    <div className="relative w-full h-full">
      <div ref={hostRef} className="tt-embed-host w-full h-full" />

      {!playerMounted && !showFallback && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none bg-black/60">
          <div className="flex items-center gap-2 text-white/80 text-sm bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Loading sermon video...
          </div>
          <span className="text-white/40 text-xs">This can take a few seconds</span>
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
