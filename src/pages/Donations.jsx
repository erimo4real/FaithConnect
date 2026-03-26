import { useState } from 'react';
import { FaHeart, FaBible, FaChurch, FaHandsHelping, FaGraduationCap, FaEnvelope, FaGlobe, FaUsers, FaPhone } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';

const Donations = () => {
  const [donationAmount, setDonationAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleAmountClick = (amount) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setDonationAmount(null);
  };

  const handleDonationTypeChange = (type) => {
    setDonationType(type);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = customAmount || donationAmount;
    alert(`Thank you for your generous donation of $${amount}! This is a demo - no payment was processed.`);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setDonationAmount(50);
    setCustomAmount('');
  };

  const donationTypes = [
    { id: 'one-time', label: 'One Time', description: 'Single donation' },
    { id: 'weekly', label: 'Weekly', description: 'Every week' },
    { id: 'monthly', label: 'Monthly', description: 'Every month' },
    { id: 'yearly', label: 'Yearly', description: 'Every year' }
  ];

  const donationCauses = [
    {
      id: 'general',
      title: 'General Fund',
      description: 'Support our ongoing ministry operations',
      icon: FaChurch
    },
    {
      id: 'missions',
      title: 'Missions & Outreach',
      description: 'Spread the Gospel locally and globally',
      icon: FaGlobe
    },
    {
      id: 'youth',
      title: 'Youth Ministry',
      description: 'Invest in the next generation',
      icon: FaUsers
    },
    {
      id: 'building',
      title: 'Building Fund',
      description: 'Help us expand our facilities',
      icon: FaHandsHelping
    },
    {
      id: 'charity',
      title: 'Community Charity',
      description: 'Help those in need in our community',
      icon: FaHeart
    },
    {
      id: 'education',
      title: 'Christian Education',
      description: 'Support Sunday school and Bible studies',
      icon: FaGraduationCap
    }
  ];

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-red to-orange">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Give & Support</h1>
            <p className="text-xl">Your generosity makes a difference</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Donations', link: '/donations' }]} />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Choose Your Donation</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Donation Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {donationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleDonationTypeChange(type.id)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        donationType === type.id
                          ? 'border-secondary bg-secondary/10'
                          : 'border-gray-200 hover:border-secondary'
                      }`}
                    >
                      <div className="font-semibold text-primary">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[25, 50, 100, 250, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountClick(amount)}
                      className={`py-3 rounded-lg border-2 font-semibold transition-colors ${
                        donationAmount === amount && !customAmount
                          ? 'border-secondary bg-secondary text-primary'
                          : 'border-gray-200 hover:border-secondary'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-primary mb-4">Donation Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="text-xl font-bold text-primary">${customAmount || donationAmount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold text-primary capitalize">{donationType}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-secondary">${customAmount || donationAmount}</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-500 text-sm">
                <p>🔒 Secure donation powered by encryption</p>
                <p>Tax deductible receipt will be emailed</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Your Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dedication Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="In memory of... or To the glory of God..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-secondary text-primary font-bold py-4 rounded-lg hover:bg-yellow-400 transition-colors text-lg"
                >
                  Donate ${customAmount || donationAmount}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-4">Choose Your Cause</h2>
          <p className="text-gray-600 text-center mb-12">Select where you want your donation to go</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donationCauses.map((cause) => (
              <div key={cause.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{cause.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{cause.title}</h3>
                <p className="text-gray-600">{cause.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Other Ways to Give</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-6">
              <div className="text-4xl mb-4 text-secondary"><FaEnvelope /></div>
              <h3 className="text-xl font-bold text-primary mb-2">Bank Transfer</h3>
              <p className="text-gray-600">Account: BETHEL CHURCH<br />Routing: XXXXXXXXX</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4 text-secondary"><FaEnvelope /></div>
              <h3 className="text-xl font-bold text-primary mb-2">Mail a Check</h3>
              <p className="text-gray-600">123 Church Street<br />City, State 12345</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4 text-secondary"><FaPhone /></div>
              <h3 className="text-xl font-bold text-primary mb-2">Text to Give</h3>
              <p className="text-gray-600">Text GIVE to (555) 123-4567</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donations;
