import { useState } from 'react';
import { FaPrayingHands, FaHeart, FaHospital, FaMoneyBillWave, FaHandHoldingHeart, FaStarAndCrescent, FaEnvelope, FaCheckCircle, FaChurch, FaVideo, FaPhone, FaMailBulk } from 'react-icons/fa';

const PrayerRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    prayerType: 'personal',
    request: '',
    isConfidential: false,
    allowShare: true
  });
  const [submitted, setSubmitted] = useState(false);
  const [urgent, setUrgent] = useState(false);

  const prayerTypes = [
    { id: 'personal', label: 'Personal Prayer', icon: FaPrayingHands },
    { id: 'family', label: 'Family', icon: FaHeart },
    { id: 'health', label: 'Health & Healing', icon: FaHospital },
    { id: 'financial', label: 'Financial', icon: FaMoneyBillWave },
    { id: 'relationship', label: 'Relationship', icon: FaHandHoldingHeart },
    { id: 'spiritual', label: 'Spiritual Growth', icon: FaStarAndCrescent },
    { id: 'other', label: 'Other', icon: FaEnvelope }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      prayerType: 'personal',
      request: '',
      isConfidential: false,
      allowShare: true
    });
  };

  return (
    <div>
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Prayer Requests</h1>
          <p className="text-xl">We believe in the power of prayer</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Submit a Prayer Request</h2>
              <p className="text-gray-600 mb-6">
                Our prayer team is dedicated to lifting up the concerns of our church family. 
                Whether you need healing, guidance, or simply want to share your joys, we're here for you.
              </p>

              {submitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCheckCircle className="text-2xl" />
                    <p className="font-bold text-lg">Prayer Request Submitted!</p>
                  </div>
                  <p>Our prayer team will be praying for you. {urgent && "This request has been marked as urgent."}</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-green-800 underline font-semibold"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={urgent}
                      onChange={() => setUrgent(!urgent)}
                      className="w-5 h-5 text-red-600"
                    />
                    <label htmlFor="urgent" className="text-red-600 font-semibold">
                      Mark as Urgent
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {prayerTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, prayerType: type.id })}
                            className={`p-2 rounded-lg border-2 text-sm transition-colors flex flex-col items-center gap-1 ${
                              formData.prayerType === type.id
                                ? 'border-secondary bg-secondary/10'
                                : 'border-gray-200 hover:border-secondary'
                            }`}
                          >
                            <Icon className="text-xl" />
                            <span>{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Request *</label>
                    <textarea
                      name="request"
                      value={formData.request}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Share your prayer request with us..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isConfidential"
                        checked={formData.isConfidential}
                        onChange={handleChange}
                        id="confidential"
                        className="w-4 h-4"
                      />
                      <label htmlFor="confidential" className="text-gray-700">
                        Keep this confidential (only pastoral staff will see)
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="allowShare"
                        checked={formData.allowShare}
                        onChange={handleChange}
                        id="share"
                        className="w-4 h-4"
                      />
                      <label htmlFor="share" className="text-gray-700">
                        Allow sharing in church prayer bulletin
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    {urgent ? 'Submit Urgent Prayer Request' : 'Submit Prayer Request'}
                  </button>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Ways to Receive Prayer</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                    <FaChurch className="text-secondary" /> Sunday Service Prayer
                  </h3>
                  <p className="text-gray-600">Join us at the altar during the closing of each service for prayer ministry.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                    <FaVideo className="text-secondary" /> Online Prayer Meeting
                  </h3>
                  <p className="text-gray-600">Join our virtual prayer room every Wednesday at 6:30 PM.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                    <FaPhone className="text-secondary" /> Prayer Hotline
                  </h3>
                  <p className="text-gray-600">Call (555) 123-4567 to speak with a prayer team member.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                    <FaMailBulk className="text-secondary" /> Email Prayer Team
                  </h3>
                  <p className="text-gray-600">Email prayers@bethelchurch.org for ongoing prayer support.</p>
                </div>
              </div>

              <div className="mt-8 bg-primary text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Prayer Chain</h3>
                <p className="mb-4">For urgent prayer needs, our prayer chain activates immediately.</p>
                <a href="tel:5551234567" className="text-secondary font-bold hover:underline">
                  Call: (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrayerRequest;
