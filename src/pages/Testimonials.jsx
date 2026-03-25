import { useState } from 'react';

const Testimonials = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    testimony: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Maria Garcia",
      role: "Member since 2018",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      content: "FaithConnect has been a blessing to my family. The worship services are inspiring, and the community has become our second family. I've grown so much in my faith here!",
      rating: 5
    },
    {
      id: 2,
      name: "James Wilson",
      role: "New Member",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      content: "I was looking for a church home for months before finding FaithConnect. The warm welcome I received made me feel like I belonged here. The teaching is biblical and relevant to daily life.",
      rating: 5
    },
    {
      id: 3,
      name: "Sarah Thompson",
      role: "Youth Leader",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      content: "Our youth program has transformed my teenagers' lives. The leaders genuinely care about each young person and help them discover their purpose in Christ.",
      rating: 5
    },
    {
      id: 4,
      name: "Robert Chen",
      role: "Volunteer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      content: "Serving at FaithConnect has been the most rewarding experience. There's always a way to use your gifts and talents to make a difference in the community.",
      rating: 5
    },
    {
      id: 5,
      name: "Emily Johnson",
      role: "Bible Study Participant",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      content: "The Wednesday Bible study has deepened my understanding of Scripture. The fellowship and discussion make learning God's Word so much more meaningful.",
      rating: 5
    },
    {
      id: 6,
      name: "Michael Brown",
      role: "Elder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      content: "I've been part of many churches, but the genuine love and unity at FaithConnect is unmatched. It's a place where people truly live out their faith.",
      rating: 5
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', testimony: '' });
  };

  return (
    <div>
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Testimonials</h1>
          <p className="text-xl">Stories of faith, hope, and transformation</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-primary">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Share Your Story</h2>
          <p className="text-gray-600 mb-8">Has FaithConnect made a difference in your life? We'd love to hear your testimony!</p>
          
          {submitted ? (
            <div className="max-w-md mx-auto bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-bold">Thank you for sharing!</p>
              <p>Your testimony has been submitted for review.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-green-800 underline"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name *"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email *"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              <div>
                <textarea
                  name="testimony"
                  value={formData.testimony}
                  onChange={handleChange}
                  placeholder="Share your testimony... *"
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Submit Testimony
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-8">What Our Community Says</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6">
              <div className="text-4xl font-bold text-secondary mb-2">500+</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-secondary mb-2">50+</div>
              <div className="text-gray-600">Volunteers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-secondary mb-2">100+</div>
              <div className="text-gray-600">Testimonies Shared</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-secondary mb-2">15+</div>
              <div className="text-gray-600">Years of Ministry</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
