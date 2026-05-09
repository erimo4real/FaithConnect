import { useState, useEffect } from 'react';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "Maria Garcia",
    role: "Member since 2018",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content: "BETHEL CHURCH has been a blessing to my family. The worship services are inspiring, and the community has become our second family. I've grown so much in my faith here!"
  },
  {
    id: 2,
    name: "James Wilson",
    role: "New Member",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content: "I was looking for a church home for months before finding BETHEL CHURCH. The warm welcome I received made me feel like I belonged here immediately."
  },
  {
    id: 3,
    name: "Sarah Thompson",
    role: "Youth Leader",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    content: "Our youth program has transformed my teenagers' lives. The leaders genuinely care about each young person and help them discover their purpose in Christ."
  },
  {
    id: 4,
    name: "Robert Chen",
    role: "Volunteer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    content: "Serving at BETHEL CHURCH has been the most rewarding experience. There's always a way to use your gifts and talents to make a difference."
  }
];

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">What Our Members Say</h2>
          <p className="text-gray-600">Hear from the people who make our community special</p>
        </div>

        <div className="relative bg-white rounded-lg shadow-xl p-8 md:p-12">
          <FaQuoteLeft className="text-4xl text-secondary mb-4" />
          
          <div className="text-center">
            <p className="text-xl text-gray-700 italic mb-8 leading-relaxed">
              "{testimonials[currentIndex].content}"
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-bold text-primary">{testimonials[currentIndex].name}</div>
                <div className="text-gray-500 text-sm">{testimonials[currentIndex].role}</div>
              </div>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <FaChevronRight />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-secondary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
