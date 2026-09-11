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
      className={`fixed inset-0 z-[999] bg-black flex items-center justify-center transition-opacity duration-700 ${leaving ? 'opacity-0' : 'opacity-100'}`}
      onClick={dismiss}
      role="dialog"
      aria-label="Prayer and fasting announcement"
    >
      <img
        src="/fasting.jpeg"
        alt="Bethel Church Prayer and Fasting 40 Days"
        className={`w-full h-full object-cover transition-transform duration-[3000ms] ${leaving ? 'scale-105' : 'scale-100'}`}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 pointer-events-none">
        <div className="bg-black/60 backdrop-blur px-6 py-3 rounded-full border border-white/20 text-center">
          <p className="text-white font-display font-bold text-2xl leading-tight">Day {currentDay()} of 40</p>
          <p className="text-white/70 text-xs mt-0.5 tracking-wide uppercase">Prayer &amp; Fasting</p>
        </div>
      </div>
      <button
        onClick={dismiss}
        className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/90 text-black text-sm font-medium shadow-lg hover:bg-white transition-colors"
        aria-label="Skip announcement"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  );
}