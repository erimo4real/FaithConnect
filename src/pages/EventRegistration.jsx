import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { events } from '../data/events';

const EventRegistration = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendees: 1,
    notes: ''
  });
  const [registered, setRegistered] = useState(false);

  const upcomingEvents = events.map(e => ({
    ...e,
    spots: Math.floor(Math.random() * 20) + 5,
    totalSpots: 30
  }));

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setRegistered(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistered(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Event Registration</h1>
          <p className="text-xl">Sign up for upcoming church events</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <p className="flex items-center gap-2"><FaCalendarAlt className="text-secondary" /> {formatDate(event.date)}</p>
                    <p className="flex items-center gap-2"><FaClock className="text-secondary" /> {event.time}</p>
                    <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-secondary" /> {event.location}</p>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-green-600">
                      {event.spots} spots left
                    </span>
                    <button
                      onClick={() => handleRegister(event)}
                      className="bg-secondary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">Register for</h2>
                <p className="text-lg font-semibold text-secondary">{selectedEvent.title}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-primary text-2xl"
              >
                ×
              </button>
            </div>

            {registered ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 mb-2">Registration Complete!</h3>
                <p className="text-gray-600 mb-4">
                  You have registered for {selectedEvent.title}.<br />
                  A confirmation email has been sent to {formData.email}.
                </p>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-primary text-white px-6 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Attendees *</label>
                  <select
                    value={formData.attendees}
                    onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements or Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    placeholder="Any dietary restrictions, accessibility needs, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Complete Registration
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistration;
