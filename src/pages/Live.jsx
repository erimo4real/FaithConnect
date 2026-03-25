import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { FaBroadcastTower, FaCalendarAlt, FaClock, FaBell } from 'react-icons/fa';

const Live = () => {
  const [isLive, setIsLive] = useState(false);

  const upcomingStreams = [
    { day: 'Sunday', time: '9:00 AM', service: 'Morning Worship' },
    { day: 'Sunday', time: '11:00 AM', service: 'Evening Worship' },
    { day: 'Wednesday', time: '7:00 PM', service: 'Bible Study' },
  ];

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
              {isLive ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Live Stream"
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop" 
                    alt="Stream placeholder"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative text-center text-white">
                    <FaBroadcastTower className="text-6xl mx-auto mb-4 text-gray-500" />
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
                    {isLive ? 'Sunday Worship Service' : 'Next Stream'}
                  </h2>
                  <p className="text-gray-400">
                    {isLive ? 'Live now' : 'Sunday at 9:00 AM & 11:00 AM EST'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsLive(!isLive)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      isLive
                        ? 'bg-gray-600 text-white hover:bg-gray-500'
                        : 'bg-secondary text-primary hover:bg-yellow-400'
                    }`}
                  >
                    {isLive ? 'Go Offline' : 'Simulate Live'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="text-secondary text-xl" />
                </div>
                <h3 className="text-lg font-bold text-primary">Stream Schedule</h3>
              </div>
              <div className="space-y-3">
                {upcomingStreams.map((stream, index) => (
                  <div key={index} className="flex justify-between text-gray-600">
                    <span>{stream.day} - {stream.service}</span>
                    <span className="font-semibold">{stream.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <FaBell className="text-secondary text-xl" />
                </div>
                <h3 className="text-lg font-bold text-primary">Get Notified</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Subscribe to get notified when we go live.
              </p>
              <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accent transition-colors">
                Enable Notifications
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <FaClock className="text-secondary text-xl" />
                </div>
                <h3 className="text-lg font-bold text-primary">Past Streams</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Missed a service? Watch our archive anytime.
              </p>
              <a href="/sermons" className="text-secondary font-semibold hover:underline">
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
