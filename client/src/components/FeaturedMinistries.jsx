import { FaBaby, FaGuitar, FaUsers, FaHandsHelping, FaBook, FaPrayingHands } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FadeInSection from './FadeInSection';

const ministries = [
  {
    id: 1,
    title: "Children's Ministry",
    description: "Nurturing faith from an early age",
    icon: FaBaby,
    link: "/events"
  },
  {
    id: 2,
    title: "Young Adults (CHAMPIONS)",
    description: "Empowering the next generation",
    icon: FaUsers,
    link: "/events"
  },
  {
    id: 3,
    title: "Worship Ministry",
    description: "Leading people to God's presence",
    icon: FaGuitar,
    link: "/sermons"
  },
  {
    id: 4,
    title: "Outreach",
    description: "Serving our community",
    icon: FaHandsHelping,
    link: "/donations"
  },
  {
    id: 5,
    title: "Bible Study",
    description: "Growing together in God's Word",
    icon: FaBook,
    link: "/small-groups"
  },
  {
    id: 6,
    title: "Prayer Ministry",
    description: "Standing in faith together",
    icon: FaPrayingHands,
    link: "/prayer"
  }
];

const FeaturedMinistries = () => {
  return (
    <FadeInSection>
    <section className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4 font-display">Our Ministries</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover ways to get involved and grow in your faith through our various ministries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry) => {
            const Icon = ministry.icon;
            return (
              <Link
                key={ministry.id}
                to={ministry.link}
                className="card overflow-hidden group"
              >
                <div className="bg-primary p-6 text-white group-hover:bg-primary-dark transition-colors duration-300">
                  <Icon className="text-4xl mx-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2 font-display">
                    {ministry.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{ministry.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
    </FadeInSection>
  );
};

export default FeaturedMinistries;
