import { useEffect, useState } from 'react';

const FAST_START = new Date('2026-09-09T00:00:00');
const FAST_END = new Date('2026-10-19T00:00:00');
const TOTAL_DAYS = 40;
const SHOW_MS = 10000;

function inFastWindow() {
  const now = new Date();
  return now >= FAST_START && now < FAST_END;
}

function currentDay() {
  const now = new Date();
  const day = Math.floor((now - FAST_START) / 86400000) + 1;
  return Math.max(1, Math.min(day, TOTAL_DAYS));
}

export default function SplashOverlay() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!inFastWindow()) return;
    setVisible(true);
    const t = setTimeout(() => setLeaving(true), SHOW_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(t);
  }, [leaving]);

  if (!visible) return null;

  const dismiss = () => setLeaving(true);

  return (
    <div
      className={`fixed inset-0 z-[999] bg-black flex flex-col transition-opacity duration-700 ${leaving ? 'opacity-0' : 'opacity-100'}`}
      onClick={dismiss}
      role="dialog"
      aria-label="Prayer and fasting announcement"
      aria-modal="true"
    >
      {/* countdown progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-white/25">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
          style={{
            animation: leaving ? 'none' : 'splashProgress 10s linear forwards',
            animationPlayState: leaving ? 'paused' : 'running',
          }}
        />
      </div>

      <img
        src="/fasting.jpeg"
        alt="Bethel Church Prayer and Fasting 40 Days"
        className={`w-full h-full flex-1 object-contain transition-transform duration-[3000ms] ${leaving ? 'scale-105' : 'scale-100'}`}
      />

      {/* readability gradient behind the badge */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

      {/* day badge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="bg-black/70 backdrop-blur-md px-5 py-3 sm:px-8 sm:py-4 rounded-2xl border border-amber-300/30 text-center shadow-xl">
          <p className="text-white font-display font-bold text-2xl sm:text-4xl leading-tight">Day {currentDay()} of 40 Days</p>
          <p className="text-amber-200/90 text-xs sm:text-sm mt-1 tracking-widest uppercase">Prayer &amp; Fasting</p>
        </div>
      </div>

      {/* skip / tap hint */}
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/90 text-black text-sm font-medium shadow-lg hover:bg-white active:scale-95 transition-all"
        aria-label="Skip announcement"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <p className="pointer-events-none absolute top-16 right-3 sm:top-20 sm:right-4 text-right text-[11px] text-white/60">
        tap anywhere to skip
      </p>

      <style>{`@keyframes splashProgress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}