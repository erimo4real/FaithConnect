import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/admin/login" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-8">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z" fill="#A3AED0" />
            </svg>
            <p className="text-sm text-gray-400">Back to Login</p>
          </Link>

          <h4 className="mb-2 text-3xl md:text-4xl font-bold text-gray-800">Forgot Password</h4>
          <p className="mb-8 text-base text-gray-500">Enter your email and we'll send a reset link</p>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          {sent && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              If that email exists, a reset link has been sent.
            </div>
          )}

          {!sent && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="mail@simmmple.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary py-3 text-base font-medium text-white transition duration-200 hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center">
            <Link to="/admin/login" className="text-sm font-medium text-primary hover:text-primary/80">Back to Login</Link>
          </p>

          <p className="mt-8 text-center text-sm text-gray-400">©2026 Bethel Church. All Rights Reserved.</p>
        </div>
      </div>

      <div className="hidden md:flex w-[45vw] bg-gradient-to-br from-primary via-accent to-primary items-center justify-center lg:rounded-bl-[120px] xl:rounded-bl-[200px]">
        <div className="text-center text-white px-8">
          <img src="/churchlogo.png" alt="Bethel Church" className="h-12 w-auto mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Bethel Church</h2>
          <p className="text-white/80">Church Management Dashboard</p>
        </div>
      </div>
    </div>
  );
}
