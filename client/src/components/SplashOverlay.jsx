import { useEffect, useState } from 'react';

const FAST_START = new Date('2026-09-09T00:00:00');
const FAST_END = new Date('2026-10-19T00:00:00');
const SHOW_MS = 10000;

function inFastWindow() {
  const now = new Date();
  return now >= FAST_START && now < FAST_END;
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
        className="w-full h-full object-contain"
      />
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