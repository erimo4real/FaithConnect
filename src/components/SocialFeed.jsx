import { FaInstagram, FaFacebook, FaYoutube, FaTwitter } from 'react-icons/fa';

const socialPosts = [
  { id: 1, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop", platform: 'instagram' },
  { id: 2, image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=300&h=300&fit=crop", platform: 'instagram' },
  { id: 3, image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop", platform: 'instagram' },
  { id: 4, image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=300&fit=crop", platform: 'instagram' },
  { id: 5, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=300&fit=crop", platform: 'instagram' },
  { id: 6, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop", platform: 'instagram' },
];

const SocialFeed = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Follow Us</h2>
          <p className="text-gray-600 mb-6">Stay connected with us on social media</p>
          
          <div className="flex justify-center gap-4">
            <a href="#" className="bg-primary text-white p-3 rounded-full hover:bg-secondary transition-colors">
              <FaFacebook className="text-xl" />
            </a>
            <a href="#" className="bg-primary text-white p-3 rounded-full hover:bg-secondary transition-colors">
              <FaInstagram className="text-xl" />
            </a>
            <a href="#" className="bg-primary text-white p-3 rounded-full hover:bg-secondary transition-colors">
              <FaYoutube className="text-xl" />
            </a>
            <a href="#" className="bg-primary text-white p-3 rounded-full hover:bg-secondary transition-colors">
              <FaTwitter className="text-xl" />
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
