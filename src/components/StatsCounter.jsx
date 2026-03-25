import { useState, useEffect } from 'react';
import { FaChurch, FaUsers, FaBible, FaHeart } from 'react-icons/fa';

const StatsCounter = () => {
  const [counters, setCounters] = useState({ members: 0, sermons: 0, groups: 0, years: 0 });

  const stats = [
    { key: 'members', target: 500, label: 'Members', icon: FaUsers },
    { key: 'sermons', target: 1200, label: 'Sermons', icon: FaBible },
    { key: 'groups', target: 25, label: 'Small Groups', icon: FaChurch },
    { key: 'years', target: 25, label: 'Years of Ministry', icon: FaHeart },
  ];

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        members: Math.floor(500 * progress),
        sermons: Math.floor(1200 * progress),
        groups: Math.floor(25 * progress),
        years: Math.floor(25 * progress),
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setCounters({ members: 500, sermons: 1200, groups: 25, years: 25 });
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <Icon className="text-4xl text-secondary mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {counters[stat.key]}+
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
