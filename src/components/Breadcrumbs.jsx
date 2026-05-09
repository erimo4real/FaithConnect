import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Breadcrumbs = ({ items }) => {
  return (
    <div className="bg-gray-100 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary flex items-center gap-1">
            <FaHome /> Home
          </Link>
          {items.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              {item.link ? (
                <Link to={item.link} className="text-gray-500 hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary font-semibold">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
