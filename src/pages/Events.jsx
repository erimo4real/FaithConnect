import EventCard from '../components/EventCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { events } from '../data/events';

const Events = () => {
  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-orange to-yellow">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Events</h1>
            <p className="text-xl">Join us for upcoming activities</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Events', link: '/events' }]} />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
