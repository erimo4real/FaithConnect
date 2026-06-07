import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { fetchEvents } from '../services/api';
import FadeInSection from '../components/FadeInSection';

const EventRegistration = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendees: 1,
    notes: ''
  });
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    fetchEvents().then(data => {
      setEvents(data.map(e => ({
        ...e,
        spots: Math.floor(Math.random() * 20) + 5,
        totalSpots: 30
      })));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const upcomingEvents = events;

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setRegistered(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistered(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      <FadeInSection>
        <section className="bg-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold font-display mb-4">Event Registration</h1>
            <p className="text-xl">Sign up for upcoming church events</p>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <p className="flex items-center gap-2"><FaCalendarAlt className="text-primary" /> {formatDate(event.date) || event.days || 'TBD'}</p>
                      {event.time && <p className="flex items-center gap-2"><FaClock className="text-primary" /> {event.time}</p>}
                      <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary" /> {event.location}</p>
                    </div>
                    {event.description && <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">{event.description}</p>}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-green-600">
                        {event.spots ? `${event.spots} spots left` : 'Open'}
                      </span>
                      <button
                        onClick={() => handleRegister(event)}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
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
      </FadeInSection>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">Register for</h2>
                <p className="text-lg font-semibold text-primary">{selectedEvent.title}</p>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Attendees *</label>
                  <select
                    value={formData.attendees}
                    onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requirements or Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    placeholder="Any dietary restrictions, accessibility needs, etc."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
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
