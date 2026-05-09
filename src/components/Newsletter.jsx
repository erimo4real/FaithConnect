import { useState } from 'react';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-16 bg-gradient-to-r from-purple via-blue to-green text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <FaEnvelope className="text-5xl text-yellow mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
        <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter to receive updates on upcoming events, sermons, and church news
        </p>
        
        {subscribed ? (
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg inline-block">
            <p className="font-bold">Thank you for subscribing!</p>
            <p className="text-sm">You'll receive our next newsletter soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow to-orange text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Subscribe <FaPaperPlane />
              </button>
            </div>
          </form>
        )}
        
        <p className="text-gray-200 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
