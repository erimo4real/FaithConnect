import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaTiktok, FaClock, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary via-purple to-blue dark:from-[#1e3a8a] dark:via-[#1e40af] dark:to-[#1d4ed8] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/churchlogo.png" alt="Bethel Church" className="h-10 w-auto" />
              <h3 className="text-xl font-bold font-display">Bethel Church</h3>
            </div>
            <p className="text-gray-200 leading-relaxed">
              A community of believers dedicated to sharing the love of Christ and making a difference in our world.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://www.facebook.com/share/1RUs1gcjAg/" className="hover:text-secondary transition-colors duration-200" aria-label="Facebook"><FaFacebook className="text-xl" /></a>
              <a href="https://www.tiktok.com/@bethelchurchng?_r=1&_t=ZS-964zfX4fwVI" className="hover:text-secondary transition-colors duration-200" aria-label="TikTok"><FaTiktok className="text-xl" /></a>
              <a href="https://www.instagram.com/bethelchurchng?igsh=ZDh2c254bGk4MW41" className="hover:text-secondary transition-colors duration-200" aria-label="Instagram"><FaInstagram className="text-xl" /></a>
              <a href="https://youtube.com/@bethelministriesinc.5454?si=JHnfss7D53IgVap2" className="hover:text-secondary transition-colors duration-200" aria-label="YouTube"><FaYoutube className="text-xl" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-secondary mb-4 font-display">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-secondary transition-colors duration-200">Home</Link></li>
              <li><Link to="/about" className="hover:text-secondary transition-colors duration-200">About</Link></li>
              <li><Link to="/sermons" className="hover:text-secondary transition-colors duration-200">Sermons</Link></li>
              <li><Link to="/podcast" className="hover:text-secondary transition-colors duration-200">Podcast</Link></li>
              <li><Link to="/events" className="hover:text-secondary transition-colors duration-200">Events</Link></li>
              <li><Link to="/live" className="hover:text-secondary transition-colors duration-200">Live</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-secondary mb-4 font-display">Service Times</h3>
            <ul className="space-y-2">
              <li>Sunday: 9:00</li>
              <li>Wednesday: 6:00 PM</li>
              <li>Young Adults: 3:00 PM - 5:00 PM</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-secondary mb-4 font-display">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-secondary mt-1 shrink-0" />
                <span>Bethel Church ilaje Bus Stop Ajah Lagos Lagos State Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-secondary shrink-0" /> +234 934 720 201
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-secondary shrink-0" /> bethelministriesinc01@gmail.com
              </li>
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
