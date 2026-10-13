import { useEffect, useState, useRef } from 'react';
import { fetchSplashEvents } from '../services/api';

function currentDay(splash) {
  if (!splash?.splash_from) return null;
  const start = new Date(splash.splash_from + 'T00:00:00');
  const now = new Date();
  const msPerDay = 86400000;
  const day = Math.floor((now - start) / msPerDay) + 1;
  const total = splash.total_days || 1;
  return { day, total };
}

export default function SplashOverlay() {
  const [splashes, setSplashes] = useState([]);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchSplashEvents()
      .then(list => {
        if (cancelled || !Array.isArray(list) || list.length === 0) return;
        setSplashes(list);
      })
      .catch(() => {});
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const splash = splashes[index];

  useEffect(() => {
    if (!splash || leaving) return;
    const durationMs = (splash.splash_duration || 10) * 1000;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (index < splashes.length - 1) {
        setTransitioning(true);
        setTimeout(() => {
          setIndex(i => i + 1);
          setTransitioning(false);
        }, 500);
      } else {
        setLeaving(true);
      }
    }, durationMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [splash, index, splashes.length, leaving]);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setSplashes([]), 800);
    return () => clearTimeout(t);
  }, [leaving]);

  if (!splash) return null;

  const dismiss = () => setLeaving(true);
  const counter = currentDay(splash);
  const durationSec = splash.splash_duration || 10;
  const fadeOut = (leaving || transitioning);

  return (
    <div
      className={`fixed inset-0 z-[999] bg-black flex flex-col transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      onClick={dismiss}
      role="dialog"
      aria-label={splash.title || 'Announcement'}
      aria-modal="true"
    >
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-white/25">
        <div
          key={splash.id}
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
          style={{
            animation: fadeOut ? 'none' : `splashProgress ${durationSec}s linear forwards`,
            animationPlayState: fadeOut ? 'paused' : 'running',
          }}
        />
      </div>

      {splash.image ? (
        <img
          key={splash.id}
          src={splash.image}
          alt={splash.title || 'Announcement'}
          className={`w-full h-full flex-1 object-contain transition-transform duration-[3000ms] ${fadeOut ? 'scale-105' : 'scale-100'}`}
        />
      ) : (
        <div className="w-full h-full flex-1 flex items-center justify-center bg-gradient-to-br from-primary to-primary/70">
          <p className="text-white text-2xl font-display font-bold px-6 text-center">{splash.title}</p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

      {counter && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="bg-black/70 backdrop-blur-md px-5 py-3 sm:px-8 sm:py-4 rounded-2xl border border-amber-300/30 text-center shadow-xl">
            <p className="text-white font-display font-bold text-2xl sm:text-4xl leading-tight">
              Day {counter.day} of {counter.total} {counter.total === 1 ? 'Day' : 'Days'}
            </p>
            <p className="text-amber-200/90 text-xs sm:text-sm mt-1 tracking-widest uppercase">{splash.title}</p>
          </div>
        </div>
      )}

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