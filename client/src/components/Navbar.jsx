import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path ? 'text-white' : 'text-white/70 hover:text-white'
    }`;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/events', label: 'Events' },
    { to: '/live', label: 'Live' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/churchlogo.png" alt="Bethel Church" className="h-10 w-auto" />
            <span className="font-bold text-lg">Bethel Church</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={linkClass(l.to)}>{l.label}</Link>
            ))}
            {user && (
              <Link to="/admin" className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Admin
              </Link>
            )}
          </div>

          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors">
            <HiOutlineMenu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-primary shadow-2xl">
            <div className="flex items-center justify-between px-4 h-16 border-b border-white/20">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            <div className="px-4 py-4 space-y-1">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === l.to ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors mt-2 border-t border-white/20 pt-4"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
