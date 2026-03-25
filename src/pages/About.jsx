import { FaHeart, FaBible, FaUsers, FaGlobe, FaPlay, FaArrowRight } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';

const About = () => {
  const leadership = [
    {
      name: "Pastor John Smith",
      role: "Senior Pastor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Pastor John has been serving at FaithConnect for over 20 years. He is passionate about teaching God's Word and building community.",
      email: "pastorjohn@faithconnect.org"
    },
    {
      name: "Pastor Sarah Johnson",
      role: "Associate Pastor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Pastor Sarah leads our women's ministry and youth programs. She has a heart for discipling the next generation.",
      email: "pastorsarah@faithconnect.org"
    },
    {
      name: "Pastor Michael Brown",
      role: "Youth Pastor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "Pastor Michael oversees our youth ministry. He loves helping young people discover their identity in Christ.",
      email: "pastormichael@faithconnect.org"
    },
    {
      name: "Lisa Martinez",
      role: "Worship Leader",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Lisa leads our worship team and has a gift for creating meaningful worship experiences.",
      email: "lisa@faithconnect.org"
    }
  ];

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-accent">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">About FaithConnect</h1>
            <p className="text-xl">A community of faith, hope, and love</p>
          </div>
        </div>
      </div>
      
      <Breadcrumbs items={[{ label: 'About' }]} />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At FaithConnect, our mission is to connect people to God and to each other. 
              We believe that church should be a place where everyone feels welcome, 
              regardless of their background or where they are in their spiritual journey.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our vision is to see lives transformed by the love of Christ, families restored, 
              and communities changed through the power of the Gospel.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
              <FaHeart className="text-5xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Love</h3>
              <p className="text-gray-600">We show God's love to everyone</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
              <FaBible className="text-5xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Truth</h3>
              <p className="text-gray-600">We teach God's Word with excellence</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
              <FaUsers className="text-5xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Community</h3>
              <p className="text-gray-600">We build authentic relationships</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
              <FaGlobe className="text-5xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Mission</h3>
              <p className="text-gray-600">We reach our community and beyond</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="relative">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">{leader.name}</h3>
                    <p className="text-secondary text-sm">{leader.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-3">{leader.bio}</p>
                  <a href={`mailto:${leader.email}`} className="text-secondary text-sm hover:underline">
                    {leader.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Watch Our Welcome Video</h2>
              <p className="text-gray-300 mb-6">
                Learn more about FaithConnect and what to expect when you visit us.
              </p>
              <button className="bg-secondary text-primary font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2">
                <FaPlay /> Play Video
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop" 
                alt="Welcome video"
                className="w-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                  <FaPlay className="text-primary text-2xl ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
