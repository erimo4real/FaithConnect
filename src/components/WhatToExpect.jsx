import { FaCoffee, FaMusic, FaBible, FaPrayingHands, FaChild, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const expectations = [
  {
    id: 1,
    title: "Warm Welcome",
    description: "You'll be greeted by friendly faces ready to welcome you to our church family",
    icon: FaCoffee
  },
  {
    id: 2,
    title: "Contemporary Worship",
    description: "Modern music that lifts your spirit and prepares your heart for the message",
    icon: FaMusic
  },
  {
    id: 3,
    title: "Biblical Teaching",
    description: "Relevant, practical messages from God's Word that speak to everyday life",
    icon: FaBible
  },
  {
    id: 4,
    title: "Prayer Ministry",
    description: "Opportunity to receive prayer after every service",
    icon: FaPrayingHands
  },
  {
    id: 5,
    title: "Kids Ministry",
    description: "Safe, fun environments for children from birth through 5th grade",
    icon: FaChild
  },
  {
    id: 6,
    title: "Fellowship",
    description: "Connect with others over coffee and refreshments after the service",
    icon: FaUsers
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
            return (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="text-2xl text-secondary" />
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
            className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-accent transition-colors"
          >
            Plan Your Visit
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatToExpect;
