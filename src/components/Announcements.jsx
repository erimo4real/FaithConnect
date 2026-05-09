import { useState, useEffect } from 'react';
import { FaBullhorn, FaCalendarAlt, FaPrayingHands, FaHeart } from 'react-icons/fa';

const announcements = [
  { id: 1, text: "Easter Service - Join us this Sunday at 9AM & 11AM!", link: "/events" },
  { id: 2, text: "Youth Camp Registration Now Open - Sign up today!", link: "/events" },
  { id: 3, text: "Wednesday Prayer Meeting - 7PM in the Fellowship Hall", link: "/events" },
  { id: 4, text: "Monthly Giving Day - Every first Sunday", link: "/donations" }
];

const Announcements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-secondary text-primary py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <FaBullhorn className="text-lg" />
          <a
            href={announcements[currentIndex].link}
            className="font-semibold hover:underline"
          >
            {announcements[currentIndex].text}
          </a>
        </div>
        <div className="absolute right-4 flex gap-1">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-primary/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
