import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path ? 'text-white' : 'text-white/70 hover:text-white'
    }`;

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/churchlogo.png" alt="Bethel Church" className="h-10 w-auto" />
            <span className="font-bold text-lg">Bethel Church</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/about" className={linkClass('/about')}>About</Link>
            <Link to="/gallery" className={linkClass('/gallery')}>Gallery</Link>
            <Link to="/events" className={linkClass('/events')}>Events</Link>
            <Link to="/live" className={linkClass('/live')}>Live</Link>
            <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
            {user && (
              <Link to="/admin" className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
