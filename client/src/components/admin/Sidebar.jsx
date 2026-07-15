import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { logoutAdmin } from '../../services/api';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';
import {
  HiOutlineViewGrid,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlinePhotograph,
  HiOutlineVideoCamera,
  HiOutlineHeart,
  HiOutlineMail,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineInbox,
  HiOutlineFolder,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineX,
} from 'react-icons/hi';

const enableDonations = import.meta.env.VITE_ENABLE_DONATIONS === 'true';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineViewGrid },
  { to: '/admin/sermons', label: 'Sermons', icon: HiOutlineBookOpen },
  { to: '/admin/events', label: 'Events', icon: HiOutlineCalendar },
  { to: '/admin/blog', label: 'Blog', icon: HiOutlinePencil },
  { to: '/admin/gallery', label: 'Gallery', icon: HiOutlinePhotograph },
  { to: '/admin/streams', label: 'Streams', icon: HiOutlineVideoCamera },
  { to: '/admin/prayer', label: 'Prayer', icon: HiOutlineHeart },
  { to: '/admin/contact', label: 'Contact', icon: HiOutlineMail },
  { to: '/admin/verses', label: 'Verses', icon: HiOutlineBookOpen },
  ...(enableDonations ? [{ to: '/admin/donations', label: 'Donations', icon: HiOutlineCurrencyDollar }] : []),
  { to: '/admin/orders', label: 'Orders', icon: HiOutlineShoppingCart },
  { to: '/admin/subscribers', label: 'Subscribers', icon: HiOutlineInbox },
  { to: '/admin/media', label: 'Media', icon: HiOutlineFolder },
  { to: '/admin/users', label: 'Users', icon: HiOutlineUsers },
  { to: '/admin/profile', label: 'Profile', icon: HiOutlineUser },
];

const editorLinks = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineViewGrid },
  { to: '/admin/sermons', label: 'Sermons', icon: HiOutlineBookOpen },
  { to: '/admin/verses', label: 'Verses', icon: HiOutlineBookOpen },
  { to: '/admin/events', label: 'Events', icon: HiOutlineCalendar },
  { to: '/admin/blog', label: 'Blog', icon: HiOutlinePencil },
  { to: '/admin/gallery', label: 'Gallery', icon: HiOutlinePhotograph },
  { to: '/admin/media', label: 'Media', icon: HiOutlineFolder },
  { to: '/admin/profile', label: 'Profile', icon: HiOutlineUser },
];

export default function Sidebar({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const links = user?.role === 'admin' ? adminLinks : editorLinks;

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
    }
    dispatch(logout());
    navigate('/admin/login');
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100 dark:border-gray-800">
        <img src="/churchlogo.png" alt="Bethel Church" className="h-10 w-auto" />
        <span className="font-bold text-gray-800 dark:text-gray-100">Bethel Church</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
              }`
            }
          >
            <l.icon className="w-5 h-5" />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3 mb-3 px-2">
          {user?.avatar_url ? (
            <img src={optimizeCloudinaryUrl(user.avatar_url, { width: 40 })} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <HiOutlineUser className="w-5 h-5" />
            </div>
          )}
          <div className="text-sm">
            <div className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[140px]">{user?.name || 'Admin'}</div>
            <div className="text-gray-400 dark:text-gray-500 text-xs capitalize">{user?.role || 'admin'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative w-64 bg-white dark:bg-gray-900 h-full shadow-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
