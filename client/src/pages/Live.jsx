import { useState, useEffect } from 'react';
import { fetchCurrentStream, fetchUpcomingStreams, fetchStreamArchive } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { FaBroadcastTower, FaCalendarAlt, FaClock } from 'react-icons/fa';

function getEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const m = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return `https://www.youtube.com/embed/${m ? m[1] : url}?autoplay=1`;
  }
  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=1`;
  }
  return url;
}

function combineSchedule(stream) {
  if (!stream?.scheduled_date) return null;
  const d = new Date(stream.scheduled_date);
  if (stream.scheduled_time) {
    const [h, m] = stream.scheduled_time.split(':');
    d.setHours(parseInt(h), parseInt(m), 0, 0);
  }
  return d;
}

const Live = () => {
  const [stream, setStream] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [archive, setArchive] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  useEffect(() => {
    let stopped = false;
    const poll = async () => { try { const s = await fetchCurrentStream(); if (!stopped) setStream(s); } catch {} };
    poll();
    const id = setInterval(poll, 5000);
    fetchUpcomingStreams().then(setUpcoming).catch(() => {}).finally(() => setLoadingUpcoming(false));
    fetchStreamArchive().then(setArchive).catch(() => {});
    return () => { stopped = true; clearInterval(id); };
  }, []);

  useEffect(() => {
    const scheduled = combineSchedule(stream);
    if (!scheduled || stream?.is_live) { setTimeLeft(null); return; }
    const TEN_MIN = 10 * 60 * 1000;
    const calc = () => { const d = scheduled - Date.now(); setTimeLeft(d > 0 && d <= TEN_MIN ? d : 0); };
    calc(); const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [stream?.scheduled_date, stream?.scheduled_time, stream?.is_live]);

  const isLive = stream?.is_live;
  const streamUrl = stream?.youtube_url || '';
  const days = timeLeft ? Math.floor(timeLeft / 86400000) : 0;
  const hours = timeLeft ? Math.floor((timeLeft % 86400000) / 3600000) : 0;
  const mins = timeLeft ? Math.floor((timeLeft % 3600000) / 60000) : 0;
  const secs = timeLeft ? Math.floor((timeLeft % 60000) / 1000) : 0;

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-accent">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Live Stream</h1>
            <p className="text-xl">Watch our services live</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Live Stream', link: '/live' }]} />

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <div className="relative">
              {isLive && streamUrl ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={getEmbedUrl(streamUrl)}
                    title="Live Stream"
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : timeLeft !== null && timeLeft > 0 ? (
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-gray-900"></div>
                  <img src="/churchlogo.png" alt="" className="absolute inset-0 w-full h-full object-contain opacity-5" />
                  <div className="relative text-center text-white px-4">
                    <img src="/churchlogo.png" alt="Bethel Church" className="h-16 mx-auto mb-4" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-1">{stream?.title || 'Next Stream'}</h2>
                    <p className="text-gray-400 mb-8">{combineSchedule(stream)?.toLocaleDateString()} at {combineSchedule(stream)?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                    <div className="flex items-center justify-center gap-4 md:gap-8">
                      {[{ v: days, l: 'Days' }, { v: hours, l: 'Hours' }, { v: mins, l: 'Minutes' }, { v: secs, l: 'Seconds' }].map(({ v, l }) => (
                        <div key={l} className="text-center">
                          <div className="text-4xl md:text-6xl font-bold bg-white/10 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[80px] md:min-w-[100px]">{String(v).padStart(2, '0')}</div>
                          <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">{l}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mt-8">Stream will start automatically</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <img 
                    src="/churchlogo.png" 
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain opacity-10"
                  />
                  <div className="relative text-center text-white">
                    <img src="/churchlogo.png" alt="Bethel Church" className="h-20 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Stream Offline</h2>
                    <p className="text-gray-400">We're not live right now</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4">
                {isLive ? (
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                  </span>
              ) : timeLeft !== null && timeLeft > 0 ? (
                  <span className="bg-primary text-white px-4 py-2 rounded-full font-bold">
                    UPCOMING
                  </span>
                ) : (
                  <span className="bg-gray-600 text-white px-4 py-2 rounded-full font-bold">
                    OFFLINE
                  </span>
                )}
              </div>
            </div>
            <div className="p-6 bg-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {stream?.title || (isLive ? 'Live Stream' : 'Next Stream')}
                  </h2>
                  <p className="text-gray-400">
                    {isLive ? 'Live now' : (timeLeft !== null && timeLeft > 0 ? `Starting in ${days}d ${hours}h ${mins}m ${secs}s` : 'Offline')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex-1 max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="text-secondary text-xl" />
                </div>
                <h3 className="text-lg font-bold text-primary">Stream Schedule</h3>
              </div>
              <div className="space-y-3">
                {loadingUpcoming ? (
                  <p className="text-gray-400 text-sm text-center py-4">Loading schedule...</p>
                ) : upcoming.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No upcoming streams scheduled</p>
                ) : (
                  upcoming.map((s) => (
                    <div key={s.id} className="flex justify-between text-gray-600">
                      <span>{new Date(s.scheduled_date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} - {s.title}</span>
                      <span className="font-semibold">{s.scheduled_time?.slice(0, 5)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex-1 max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <FaClock className="text-secondary text-xl" />
                </div>
                <h3 className="text-lg font-bold text-primary">Past Streams</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Missed a service? Watch our archive anytime.
              </p>
              <a href="/past-streams" className="text-secondary font-semibold hover:underline">
                View Archive →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Live;
