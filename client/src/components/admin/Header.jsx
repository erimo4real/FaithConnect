import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineUser } from 'react-icons/hi';

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const segments = pathname.replace('/admin', '').split('/').filter(Boolean);
  const page = segments[segments.length - 1] || 'dashboard';
  const title = page.charAt(0).toUpperCase() + page.slice(1);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
            {segments.length > 0 ? segments.join(' / ') : 'dashboard'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || 'Admin'}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{user?.role || 'admin'}</p>
        </div>
        {user?.avatar_url ? (
          <img src={optimizeCloudinaryUrl(user.avatar_url, { width: 40 })} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-primary">
            <HiOutlineUser className="w-5 h-5" />
          </div>
        )}
      </div>
    </header>
  );
}
