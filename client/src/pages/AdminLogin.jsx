import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen w-full bg-white flex">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-8">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z" fill="#A3AED0" />
            </svg>
            <p className="text-sm text-gray-400">Back to Dashboard</p>
          </Link>

          <h4 className="mb-2 text-3xl md:text-4xl font-bold text-gray-800">Sign In</h4>
          <p className="mb-8 text-base text-gray-500">Enter your email and password to sign in!</p>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@simmmple.com"
                className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password*</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Keep me logged in</span>
              </label>
              <Link to="/admin/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-base font-medium text-white transition duration-200 hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-[45vw] xl:w-[44vw] bg-gradient-to-br from-primary to-blue-800 items-center justify-center lg:rounded-bl-[120px] xl:rounded-bl-[200px]">
        <div className="text-center text-white px-8">
          <img src="/churchlogo.png" alt="Bethel Church" className="mx-auto mb-6 h-12 w-auto" />
          <h2 className="mb-2 text-3xl font-bold">Bethel Church</h2>
          <p className="mx-auto max-w-sm text-lg text-white/70">
            Church management platform for sermons, events, and community.
          </p>
        </div>
      </div>
    </div>
  );
}
