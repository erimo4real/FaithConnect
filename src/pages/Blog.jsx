import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { FaTimes, FaShareAlt } from 'react-icons/fa';
import { blogPosts } from '../data/blogPosts';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = ['all', 'Faith', 'Prayer', 'Family', 'Youth', 'Outreach', 'Purpose'];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="relative h-64 bg-gradient-to-r from-primary to-accent">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Blog</h1>
            <p className="text-xl">Inspiration, teaching, and stories</p>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[{ label: 'Blog', link: '/blog' }]} />

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-secondary text-primary'
                    : 'bg-white text-gray-700 hover:bg-secondary hover:text-primary'
                }`}
              >
                {cat === 'all' ? 'All Posts' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors">{post.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-64 object-cover"
              />
              <button
                className="absolute top-4 right-4 bg-white/90 rounded-full p-2 hover:bg-white"
                onClick={() => setSelectedPost(null)}
              >
                <FaTimes />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="bg-secondary text-primary text-sm font-bold px-3 py-1 rounded-full">
                  {selectedPost.category}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-2">{selectedPost.title}</h2>
              <div className="flex items-center text-gray-500 mb-4">
                <span>By {selectedPost.author}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(selectedPost.date)}</span>
              </div>
              <div className="prose max-w-none text-gray-700 mb-6">
                <p>{selectedPost.content}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <button className="text-gray-500 hover:text-secondary flex items-center gap-2">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">Get the latest blog posts and church updates delivered to your inbox</p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-secondary text-primary font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Blog;
