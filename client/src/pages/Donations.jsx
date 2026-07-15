import { useState } from 'react';
import { FaHeart, FaChurch, FaHandsHelping, FaGraduationCap, FaEnvelope, FaGlobe, FaUsers, FaPhone } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';
import FadeInSection from '../components/FadeInSection';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Donations = () => {
  const [donationAmount, setDonationAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [customAmountError, setCustomAmountError] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [donationCause, setDonationCause] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleAmountClick = (amount) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setDonationAmount(null);
    if (val && parseInt(val) < 100) {
      setCustomAmountError('Minimum donation is ₦100');
    } else {
      setCustomAmountError('');
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    const amount = customAmount || donationAmount;

    try {
      const res = await fetch(`${API_URL}/donations/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: parseFloat(amount),
          type: donationType,
          cause: donationCause,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const donationTypes = [
    { id: 'one-time', label: 'Offering', description: 'Single donation' },
    { id: 'tithe', label: 'Tithe', description: 'Monthly recurring' },
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
      id: 'young-adults',
      title: 'Young Adults Ministry',
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
      <div className="relative h-64 bg-gradient-to-r from-primary dark:from-[#1e3a8a] to-primary/80">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Give & Support</h1>
            <p className="text-xl">Your generosity makes a difference</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Donations', link: '/donations' }]} />

      <FadeInSection>
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-8 max-w-2xl mx-auto">
            <h3 className="font-bold text-primary mb-3 text-center">How It Works</h3>
            <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-3 items-center">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-xs font-bold">1</span>
                <span>Fill in your details and click <strong>Donate</strong></span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-xs font-bold">2</span>
                <span>You'll be redirected to <strong>Paystack</strong> to enter your card details securely</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-xs font-bold">3</span>
                <span>After payment, you'll be redirected back and a <strong>receipt</strong> will be emailed to you</span>
              </li>
            </ol>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Choose Your Donation</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Donation Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {donationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleDonationTypeChange(type.id)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        donationType === type.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold text-primary">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Amount</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountClick(amount)}
                      className={`py-3 rounded-lg border-2 font-semibold transition-colors ${
                        donationAmount === amount && !customAmount
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      ₦{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    min="100"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {customAmountError && (
                    <p className="text-red-500 text-xs mt-1">{customAmountError}</p>
                  )}
                </div>
              </div>

              {donationType !== 'one-time' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4 text-sm text-blue-700 dark:text-blue-300">
                  You can cancel your recurring donation at any time. A cancellation link will be included in your receipt email.
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-primary mb-4">Donation Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="text-xl font-bold text-primary">₦{(customAmount || donationAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-semibold text-primary capitalize">{donationType}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Cause:</span>
                  <span className="font-semibold text-primary">{donationCauses.find(c => c.id === donationCause)?.title || donationCause}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">₦{(customAmount || donationAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-500 text-sm">
                <p>Secured by Paystack</p>
                <p>Tax deductible receipt will be emailed</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Your Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dedication Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="In memory of... or To the glory of God..."
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                  ></textarea>
                </div>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors text-lg disabled:opacity-50"
                >
                  {sending ? 'Processing...' : `Donate ₦${(customAmount || donationAmount).toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      <FadeInSection>
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary font-display text-center mb-4">Choose Your Cause</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12">Select where you want your donation to go</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donationCauses.map((cause) => (
              <div
                key={cause.id}
                onClick={() => setDonationCause(cause.id)}
                className={`card p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                  donationCause === cause.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="text-4xl mb-3">{cause.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{cause.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{cause.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>
    </div>
  );
};

export default Donations;
