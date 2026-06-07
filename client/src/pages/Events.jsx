import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchEvents } from '../services/api';
import FadeInSection from '../components/FadeInSection';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Events</h1>
            <p className="text-xl">Join us for upcoming activities</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Events', link: '/events' }]} />

      <FadeInSection>
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? <p className="text-gray-400 dark:text-gray-500 col-span-3 text-center py-8">Loading...</p> : events.length === 0 ? <p className="text-gray-400 dark:text-gray-500 col-span-3 text-center py-8">No events yet.</p> : events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
};

export default Events;
