import { FaHeart, FaBible, FaUsers, FaGlobe, FaPlay, FaArrowRight, FaEnvelope } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';
import FadeInSection from '../components/FadeInSection';

const About = () => {
  const leadership = [
    {
      name: "Rev Roselyn Oduyemi",
      role: "Senior Pastor",
      image: "/images/leadership2.jpeg",
      bio: "Rev Roselyn Oduyemi is the President and Co-founder Senior Pastor of Bethel Ministries Inc. An Author, Inspiring Preacher, Minister and Teacher of the Gospel for almost 4 decades, She hosts the program called IGNITE TV on social media. She's also an Educationist, a Proprietress  and an Entrepreneur..",
      email: "roselynoduyemi@gmail.com"
    },
    // {
    //   name: "Pastor Sarah Johnson",
    //   role: "Associate Pastor",
    //   image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    //   bio: "Pastor Sarah leads our women's ministry and young adults programs. She has a heart for discipling the next generation.",
    //   email: "pastorsarah@bethelchurch.org"
    // },
    // {
    //   name: "Pastor Michael Brown",
    //   role: "Youth Pastor",
    //   image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    //   bio: "Pastor Michael oversees our young adults ministry. He loves helping young people discover their identity in Christ.",
    //   email: "pastormichael@bethelchurch.org"
    // },
    // {
    //   name: "Lisa Martinez",
    //   role: "Worship Leader",
    //   image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    //   bio: "Lisa leads our worship team and has a gift for creating meaningful worship experiences.",
    //   email: "lisa@bethelchurch.org"
    // }
  ];

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">About BETHEL CHURCH</h1>
            <p className="text-xl">A community of faith, hope, and love</p>
          </div>
        </div>
      </div>
      
      <Breadcrumbs items={[{ label: 'About' }]} />

      <FadeInSection>
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold font-display text-primary mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                At BETHEL CHURCH, our mission is to connect people to God and to each other. 
                We believe that church should be a place where everyone feels welcome, 
                regardless of their background or where they are in their spiritual journey.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Our vision is to see lives transformed by the love of Christ, families restored, 
                and communities changed through the power of the Gospel.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold font-display text-primary mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-primary">
                <FaHeart className="text-5xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Love</h3>
                <p className="text-gray-600 dark:text-gray-400">We show God's love to everyone</p>
              </div>
              <div className="card p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-primary">
                <FaBible className="text-5xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Truth</h3>
                <p className="text-gray-600 dark:text-gray-400">We teach God's Word with excellence</p>
              </div>
              <div className="card p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-primary">
                <FaUsers className="text-5xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Community</h3>
                <p className="text-gray-600 dark:text-gray-400">We build authentic relationships</p>
              </div>
              <div className="card p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-primary">
                <FaGlobe className="text-5xl text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Mission</h3>
                <p className="text-gray-600 dark:text-gray-400">We reach our community and beyond</p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold font-display text-primary mb-12 text-center">Leadership Team</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {leadership.map((leader, index) => (
                <div key={index} className="card overflow-hidden hover:shadow-2xl transition-shadow w-full max-w-2xl">
                  <div className="relative bg-gray-100">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-[300px] md:h-[500px] object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-2xl mb-1">{leader.name}</h3>
                      <p className="text-secondary text-lg font-medium">{leader.role}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{leader.bio}</p>
                    <a href={`mailto:${leader.email}`} className="text-primary font-semibold hover:text-primary/80 transition-colors">
                      <FaEnvelope className="inline mr-2" />{leader.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Watch Our Welcome Video</h2>
              <p className="text-gray-300 mb-6">
                Learn more about BETHEL CHURCH and what to expect when you visit us.
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
      </section> */}
    </div>
  );
};

export default About;
