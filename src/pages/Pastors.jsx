import { FaEnvelope } from 'react-icons/fa';

const Pastors = () => {
  const leaders = [
    {
      id: 1,
      name: "Pastor John Smith",
      role: "Senior Pastor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      email: "pastorjohn@bethelchurch.org",
      bio: "Pastor John has been serving at BETHEL CHURCH for over 20 years. He is passionate about teaching God's Word and building community. He holds a Master of Divinity from Fuller Theological Seminary and has a heart for making the Gospel accessible to everyone.",
      ministry: "Senior Leadership, Preaching"
    },
    {
      id: 2,
      name: "Pastor Sarah Johnson",
      role: "Associate Pastor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      email: "pastorsarah@bethelchurch.org",
      bio: "Pastor Sarah leads our women's ministry and youth programs. She has a heart for discipling the next generation and has been instrumental in growing our youth congregation.",
      ministry: "Women's Ministry, Youth"
    },
    {
      id: 3,
      name: "Pastor Michael Brown",
      role: "Youth Pastor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      email: "pastormichael@bethelchurch.org",
      bio: "Pastor Michael oversees our youth ministry. He loves helping young people discover their identity in Christ and has a gift for making biblical teaching relevant to today's youth.",
      ministry: "Youth Ministry, Students"
    },
    {
      id: 4,
      name: "Lisa Martinez",
      role: "Worship Leader",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      email: "lisa@bethelchurch.org",
      bio: "Lisa leads our worship team and has a gift for creating meaningful worship experiences. She has been in ministry for over 15 years and is passionate about using music to draw people closer to God.",
      ministry: "Worship, Music"
    },
    {
      id: 5,
      name: "David Wilson",
      role: "Children's Pastor",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
      email: "david@bethelchurch.org",
      bio: "David leads our children's ministry with joy and creativity. He believes in investing in the next generation and creating a safe, fun environment for kids to learn about God's love.",
      ministry: "Children's Ministry"
    },
    {
      id: 6,
      name: "Rebecca Taylor",
      role: "Outreach Director",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
      email: "rebecca@bethelchurch.org",
      bio: "Rebecca oversees our community outreach programs. She has a passion for serving those in need and has developed partnerships with local organizations to make a greater impact.",
      ministry: "Outreach, Community Service"
    }
  ];

  const staff = [
    { name: "Jennifer Lee", role: "Office Manager", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop" },
    { name: "Mark Anderson", role: "Facilities Manager", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" },
    { name: "Amanda Garcia", role: "行政秘书", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" },
    { name: "Chris Martin", role: "Media Director", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop" }
  ];

  return (
    <div>
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-xl">Meet the people who serve at BETHEL CHURCH</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Pastoral Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader) => (
              <div key={leader.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-xl">{leader.name}</h3>
                    <p className="text-secondary">{leader.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded">
                      {leader.ministry}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{leader.bio}</p>
                  <a
                    href={`mailto:${leader.email}`}
                    className="text-secondary hover:underline flex items-center gap-2"
                  >
                    <FaEnvelope /> {leader.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Church Staff</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {staff.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-primary">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Join Our Team</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for dedicated individuals to join our ministry team. 
            Whether you're called to pastoral ministry, music, children's work, or support roles, 
            we'd love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-block bg-secondary text-primary font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  );
};

export default Pastors;
