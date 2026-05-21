import { FaInstagram, FaFacebook, FaYoutube, FaTiktok  } from 'react-icons/fa';

const socialPosts = [
  { id: 1, image: "/images/prayer 2.jpeg", platform: 'instagram' },
  { id: 2, image: "/images/bible .jpeg", platform: 'instagram' },
  { id: 3, image: "/images/champions2.jpeg", platform: 'instagram' },
  { id: 4, image: "/images/outreach 2.jpeg", platform: 'instagram' },
  { id: 5, image: "/images/outreach 8.jpeg", platform: 'instagram' },
  { id: 6, image: "/images/outreach 7.jpeg", platform: 'instagram' },
];

const SocialFeed = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Follow Us</h2>
          <p className="text-gray-600 mb-6">Stay connected with us on social media</p>
          
          <div className="flex justify-center gap-4">
            <a href="https://www.facebook.com/share/1RUs1gcjAg/"  target="_blank" className="bg-primary text-white p-3 rounded-full hover:bg-secondary transition-colors">
              <FaFacebook className="text-xl" />
            </a>
            <a href="https://www.instagram.com/bethelchurchng?igsh=ZDh2c254bGk4MW41"  target="_blank" className="bg-primary text-white p-3 rounded-full hover:bg-secondary transition-colors">
              <FaInstagram className="text-xl" />
            </a>
            <a href="https://youtube.com/@bethelministriesinc.5454?si=JHnfss7D53IgVap2"  target="_blank" className="bg-primary text-white p-3 rounded-full hover:bg-secondary transition-colors">
              <FaYoutube className="text-xl" />
            </a>
            <a href="https://www.tiktok.com/@bethelchurchng?_r=1&_t=ZS-964zfX4fwVI"  target="_blank" className="bg-primary text-white p-3 rounded-full hover:bg-secondary transition-colors">
              <FaTiktok className="text-xl" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {socialPosts.map((post) => (
            <div key={post.id} className="relative group overflow-hidden rounded-lg">
              <img
                src={post.image}
                alt="Social post"
                className="w-full h-32 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <FaInstagram className="text-white text-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
