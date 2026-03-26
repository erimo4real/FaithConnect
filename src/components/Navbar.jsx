import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Events', path: '/events' },
    { name: 'Live', path: '/live' },
  ];

  const connectLinks = [
    { name: 'Prayer Request', path: '/prayer' },
    { name: 'Small Groups', path: '/small-groups' },
    { name: 'Staff Directory', path: '/staff-directory' },
  ];

  const moreLinks = [
    { name: 'Donations', path: '/donations' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Podcast', path: '/podcast' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Our Team', path: '/team' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-primary to-purple text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/churchlogo.jpeg" alt="Bethel Church" className="h-12 w-auto" />
          </Link>

          <div className="hidden md:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`hover:text-secondary transition-colors ${
                  isActive(link.path) ? 'text-secondary font-semibold' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center hover:text-secondary transition-colors ${
                  connectLinks.some(link => isActive(link.path)) ? 'text-secondary font-semibold' : ''
                }`}
              >
                Connect
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {connectLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-yellow-400 hover:text-gray-900"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center hover:text-secondary transition-colors ${
                  moreLinks.some(link => isActive(link.path)) ? 'text-secondary font-semibold' : ''
                }`}
              >
                More
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-yellow-400 hover:text-gray-900"
                      onClick={() => setMoreDropdownOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block py-2 hover:text-secondary ${
                  isActive(link.path) ? 'text-secondary font-semibold' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-600 mt-2 pt-2">
              <p className="text-gray-400 text-sm py-1">Connect:</p>
              {connectLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block py-2 hover:text-secondary ${
                    isActive(link.path) ? 'text-secondary font-semibold' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-600 mt-2 pt-2">
              <p className="text-gray-400 text-sm py-1">More:</p>
              {moreLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block py-2 hover:text-secondary ${
                    isActive(link.path) ? 'text-secondary font-semibold' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
