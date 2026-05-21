import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

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
    <div className="relative float-right h-full min-h-screen w-full !bg-white">
      <main className="mx-auto min-h-screen">
        <div className="relative flex">
          <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
            <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
              <Link to="/" className="mt-0 w-max lg:pt-10">
                <div className="mx-auto flex h-fit w-fit items-center hover:cursor-pointer">
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z" fill="#A3AED0" />
                  </svg>
                  <p className="ml-3 text-sm text-gray-400">Back to Dashboard</p>
                </div>
              </Link>

              <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                <h4 className="mb-2.5 text-4xl font-bold text-[#1e293b]">Sign In</h4>
                <p className="mb-9 ml-1 text-base text-gray-500">Enter your email and password to sign in!</p>

                {error && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="ml-1.5 text-sm font-medium text-[#1e293b]">Email*</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mail@simmmple.com"
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="ml-1.5 text-sm font-medium text-[#1e293b]">Password*</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none"
                      required
                    />
                  </div>

                  <div className="mb-4 flex items-center justify-between px-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s] checked:border-none checked:bg-primary checked:text-white hover:cursor-pointer"
                      />
                      <p className="ml-2 text-sm font-medium text-[#1e293b]">Keep me logged In</p>
                    </div>
                    <Link to="/admin/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="linear mt-2 w-full rounded-xl bg-primary py-[12px] text-base font-medium text-white transition duration-200 hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              </div>

              <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] xl:w-[44vw]">
                <div className="absolute flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-blue-800 lg:rounded-bl-[120px] xl:rounded-bl-[200px]">
                  <div className="text-center text-white">
                    <img src="/churchlogo.png" alt="Bethel Church" className="mx-auto mb-6 h-10 w-auto" />
                    <h2 className="mb-2 text-3xl font-bold">Bethel Church</h2>
                    <p className="mx-auto max-w-sm text-lg text-white/70">
                      Church management platform for sermons, events, and community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
