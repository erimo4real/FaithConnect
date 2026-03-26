import { Link } from 'react-router-dom';
import { FaChurch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaChurch className="text-3xl text-secondary" />
              <h3 className="text-xl font-bold">BETHEL CHURCH</h3>
            </div>
            <p className="text-gray-300">
              A community of believers dedicated to sharing the love of Christ and making a difference in our world.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-secondary"><FaFacebook className="text-xl" /></a>
              <a href="#" className="hover:text-secondary"><FaTwitter className="text-xl" /></a>
              <a href="#" className="hover:text-secondary"><FaInstagram className="text-xl" /></a>
              <a href="#" className="hover:text-secondary"><FaYoutube className="text-xl" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-secondary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-secondary">Home</Link></li>
              <li><Link to="/about" className="hover:text-secondary">About</Link></li>
              <li><Link to="/sermons" className="hover:text-secondary">Sermons</Link></li>
              <li><Link to="/events" className="hover:text-secondary">Events</Link></li>
              <li><Link to="/contact" className="hover:text-secondary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-secondary mb-4">Service Times</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2"><FaClock className="text-secondary" /> Sunday: 9:00 AM & 11:00 AM</li>
              <li className="flex items-center gap-2"><FaClock className="text-secondary" /> Wednesday: 7:00 PM</li>
              <li className="flex items-center gap-2"><FaClock className="text-secondary" /> Saturday Youth: 6:30 PM</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-secondary mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-secondary" /> 123 Church Street, City, State 12345</li>
              <li className="flex items-center gap-2"><FaPhone className="text-secondary" /> (555) 123-4567</li>
              <li className="flex items-center gap-2"><FaEnvelope className="text-secondary" /> info@bethelchurch.org</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BETHEL CHURCH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
