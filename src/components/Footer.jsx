import { Link } from 'react-router-dom';
import { FaChurch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary via-purple to-blue text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/churchlogo.png" alt="Bethel Church" className="h-10 w-auto" />
              <h3 className="text-xl font-bold">BETHEL CHURCH</h3>
            </div>
            <p className="text-gray-200">
              A community of believers dedicated to sharing the love of Christ and making a difference in our world.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-yellow"><FaFacebook className="text-xl" /></a>
              <a href="#" className="hover:text-yellow"><FaTwitter className="text-xl" /></a>
              <a href="#" className="hover:text-yellow"><FaInstagram className="text-xl" /></a>
              <a href="#" className="hover:text-yellow"><FaYoutube className="text-xl" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-yellow">Home</Link></li>
              <li><Link to="/about" className="hover:text-yellow">About</Link></li>
              <li><Link to="/sermons" className="hover:text-yellow">Sermons</Link></li>
              <li><Link to="/events" className="hover:text-yellow">Events</Link></li>
              <li><Link to="/contact" className="hover:text-yellow">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow mb-4">Service Times</h3>
            <ul className="space-y-2 text-gray-200">
              <li className="flex items-center gap-2"><FaClock className="text-yellow" /> Sunday: 9:00 AM & 11:00 AM</li>
              <li className="flex items-center gap-2"><FaClock className="text-yellow" /> Wednesday: 7:00 PM</li>
              <li className="flex items-center gap-2"><FaClock className="text-yellow" /> Saturday Youth: 6:30 PM</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-200">
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-yellow" /> 123 Church Street, City, State 12345</li>
              <li className="flex items-center gap-2"><FaPhone className="text-yellow" /> (555) 123-4567</li>
              <li className="flex items-center gap-2"><FaEnvelope className="text-yellow" /> info@bethelchurch.org</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-200">
          <p>&copy; {new Date().getFullYear()} BETHEL CHURCH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
