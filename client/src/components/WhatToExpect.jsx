import { FaCoffee, FaMusic, FaBible, FaPrayingHands, FaChild, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const colorClasses = {
  blue: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary' },
  purple: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary' },
  green: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary' },
  yellow: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary' },
  orange: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary' },
  red: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary' },
};

const expectations = [
  {
    id: 1,
    title: "Warm Welcome",
    description: "You'll be greeted by friendly faces ready to welcome you to our church family",
    icon: FaCoffee,
    color: "blue"
  },
  {
    id: 2,
    title: "Contemporary Worship",
    description: "Modern music that lifts your spirit and prepares your heart for the message",
    icon: FaMusic,
    color: "purple"
  },
  {
    id: 3,
    title: "Biblical Teaching",
    description: "Relevant, practical messages from God's Word that speak to everyday life",
    icon: FaBible,
    color: "green"
  },
  {
    id: 4,
    title: "Prayer Ministry",
    description: "Opportunity to receive prayer after every service",
    icon: FaPrayingHands,
    color: "yellow"
  },
  {
    id: 5,
    title: "Young Adults (CHAMPIONS)",
    description: "Safe, fun environments for young adults from 15 year old and any one young at heart ",
    icon: FaChild,
    color: "orange"
  },
  {
    id: 6,
    title: "Fellowship",
    description: "Connect with others over coffee and refreshments after the service",
    icon: FaUsers,
    color: "red"
  }
];

const WhatToExpect = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">What to Expect</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Planning your first visit? Here's what you can expect when you join us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expectations.map((item) => {
            const Icon = item.icon;
            const colors = colorClasses[item.color];
            return (
              <div 
                key={item.id} 
                className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 ${colors.border}`}
              >
                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-4`}>
                  <Icon className={`text-2xl ${colors.text}`} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/contact" 
            className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-opacity"
          >
            Plan Your Visit
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatToExpect;
