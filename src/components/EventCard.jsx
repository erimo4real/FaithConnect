import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary mb-2">{event.title}</h3>
        <div className="space-y-1 mb-3">
          <p className="text-gray-600 text-sm flex items-center gap-2">
            <FaCalendarAlt className="text-secondary" />
            {formatDate(event.date)}
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-2">
            <FaClock className="text-secondary" />
            {event.time}
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-2">
            <FaMapMarkerAlt className="text-secondary" />
            {event.location}
          </p>
        </div>
        <p className="text-gray-600 text-sm">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
