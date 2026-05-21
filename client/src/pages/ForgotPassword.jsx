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
    <div className="relative min-h-screen w-full bg-white">
      <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:min-h-screen xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
        <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
          <Link to="/admin/login" className="mt-0 w-max lg:pt-10">
            <div className="flex h-fit w-fit items-center hover:cursor-pointer">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z" fill="#A3AED0" />
              </svg>
              <p className="ml-3 text-sm text-gray-600">Back to Login</p>
            </div>
          </Link>

            <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                <h4 className="mb-2.5 text-4xl font-bold text-[#1e293b]">Forgot Password</h4>
                <p className="mb-9 ml-1 text-base text-gray-500">Enter your email and we'll send a reset link</p>

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
                    <div className="mb-3">
                      <label className="ml-1.5 text-sm font-medium text-[#1e293b]">Email*</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none"
                        placeholder="mail@simmmple.com"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="linear mt-2 w-full rounded-xl bg-primary py-[12px] text-base font-medium text-white transition duration-200 hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                )}

                <div className="mt-4 text-center">
                  <Link to="/admin/login" className="text-sm font-medium text-primary hover:text-primary/80">Back to Login</Link>
                </div>
              </div>
        </div>

        <p className="pb-4 text-center text-sm text-gray-400">©2026 Bethel Church. All Rights Reserved.</p>
      </div>

      <div className="absolute right-0 top-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-accent to-primary lg:rounded-bl-[120px] xl:rounded-bl-[200px]">
          <div className="relative z-10 p-12 text-center">
            <img src="/churchlogo.png" alt="Bethel Church" className="h-10 w-auto mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Bethel Church</h2>
            <p className="text-white/80">Church Management Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
