import { FaBaby, FaGuitar, FaUsers, FaHandsHelping, FaBook, FaPrayingHands } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ministries = [
  {
    id: 1,
    title: "Children's Ministry",
    description: "Nurturing faith from an early age",
    icon: FaBaby,
    color: "bg-blue-500",
    link: "/events"
  },
  {
    id: 2,
    title: "Youth Ministry",
    description: "Empowering the next generation",
    icon: FaUsers,
    color: "bg-green-500",
    link: "/events"
  },
  {
    id: 3,
    title: "Worship Ministry",
    description: "Leading people to God's presence",
    icon: FaGuitar,
    color: "bg-purple-500",
    link: "/sermons"
  },
  {
    id: 4,
    title: "Outreach",
    description: "Serving our community",
    icon: FaHandsHelping,
    color: "bg-orange-500",
    link: "/donations"
  },
  {
    id: 5,
    title: "Bible Study",
    description: "Growing together in God's Word",
    icon: FaBook,
    color: "bg-red-500",
    link: "/small-groups"
  },
  {
    id: 6,
    title: "Prayer Ministry",
    description: "Standing in faith together",
    icon: FaPrayingHands,
    color: "bg-teal-500",
    link: "/prayer"
  }
];

const FeaturedMinistries = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Ministries</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className={`${ministry.color} p-6 text-white`}>
                  <Icon className="text-4xl mx-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {ministry.title}
                  </h3>
                  <p className="text-gray-600">{ministry.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMinistries;
