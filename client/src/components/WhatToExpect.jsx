import { FaCoffee, FaMusic, FaBible, FaPrayingHands, FaChild, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FadeInSection from './FadeInSection';

const expectations = [
  {
    id: 1,
    title: "Warm Welcome",
    description: "You'll be greeted by friendly faces ready to welcome you to our church family",
    icon: FaCoffee,
  },
  {
    id: 2,
    title: "Contemporary Worship",
    description: "Modern music that lifts your spirit and prepares your heart for the message",
    icon: FaMusic,
  },
  {
    id: 3,
    title: "Biblical Teaching",
    description: "Relevant, practical messages from God's Word that speak to everyday life",
    icon: FaBible,
  },
  {
    id: 4,
    title: "Prayer Ministry",
    description: "Opportunity to receive prayer after every service",
    icon: FaPrayingHands,
  },
  {
    id: 5,
    title: "Young Adults (CHAMPIONS)",
    description: "Safe, fun environments for young adults from 15 year old and any one young at heart ",
    icon: FaChild,
  },
  {
    id: 6,
    title: "Fellowship",
    description: "Connect with others over coffee and refreshments after the service",
    icon: FaUsers,
  }
];

const WhatToExpect = () => {
  return (
    <FadeInSection>
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4 font-display">What to Expect</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Planning your first visit? Here's what you can expect when you join us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expectations.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="card p-6 border-t-4 border-primary"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="text-2xl text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 font-display">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/contact"
            className="btn btn-primary"
          >
            Plan Your Visit
          </Link>
        </div>
      </div>
    </section>
    </FadeInSection>
  );
};

export default WhatToExpect;
