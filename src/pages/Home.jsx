import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SermonCard from '../components/SermonCard';
import EventCard from '../components/EventCard';
import StatsCounter from '../components/StatsCounter';
import FeaturedMinistries from '../components/FeaturedMinistries';
import TestimonialsSlider from '../components/TestimonialsSlider';
import Newsletter from '../components/Newsletter';
import WhatToExpect from '../components/WhatToExpect';
import SocialFeed from '../components/SocialFeed';
import GoogleMap from '../components/GoogleMap';
import { FaPlay, FaCalendarAlt } from 'react-icons/fa';
import { sermons } from '../data/sermons';
import { events } from '../data/events';

const slides = [
  {
    id: 1,
    title: "Welcome to BETHEL CHURCH",
    subtitle: "Connecting People to God and Each Other",
    description: "Join us every Sunday for worship, prayer, and community",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&h=1080&fit=crop",
    cta: "Join Us This Sunday",
    link: "/about"
  },
  {
    id: 2,
    title: "Live Stream Services",
    subtitle: "Worship From Anywhere",
    description: "Experience the presence of God from the comfort of your home",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
    cta: "Watch Live",
    link: "/live"
  },
  {
    id: 3,
    title: "Grow in Your Faith",
    subtitle: "Bible Study & Discipleship",
    description: "Dive deeper into God's Word with our study groups",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1920&h=1080&fit=crop",
    cta: "Learn More",
    link: "/sermons"
  },
  {
    id: 4,
    title: "Youth Ministry",
    subtitle: "Building the Next Generation",
    description: "Empowering young people to discover their purpose in Christ",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop",
    cta: "Get Involved",
    link: "/events"
  },
  {
    id: 5,
    title: "Community Outreach",
    subtitle: "Serving Our Neighbors",
    description: "Making a difference in our local community together",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop",
    cta: "Volunteer",
    link: "/contact"
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 240000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const featuredSermon = sermons[0];
  const upcomingEvents = events.slice(0, 3);

  return (
    <div>
      <section className="relative h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-purple/50 to-primary/70"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-2 text-secondary font-semibold">{slide.subtitle}</p>
                <p className="text-lg mb-8 max-w-2xl mx-auto">{slide.description}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to={slide.link}
                    className="bg-gradient-to-r from-yellow to-orange text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity inline-block shadow-lg"
                  >
                    {slide.cta}
                  </Link>
                  <Link
                    to="/live"
                    className="bg-white/20 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/30 transition-colors inline-block flex items-center gap-2"
                  >
                    <FaPlay /> Watch Live
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-secondary' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      <StatsCounter />

      <WhatToExpect />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Upcoming Events</h2>
            <Link to="/events" className="text-orange font-semibold hover:underline flex items-center gap-2">
              View All <FaCalendarAlt />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <FeaturedMinistries />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-4">Featured Sermon</h2>
          <p className="text-gray-600 text-center mb-12">Latest message from our pastors</p>
          <div className="max-w-2xl mx-auto">
            <SermonCard sermon={featuredSermon} />
          </div>
        </div>
      </section>

      <TestimonialsSlider />

      <Newsletter />

      <SocialFeed />

      <GoogleMap />

      <section className="py-16 bg-gradient-to-r from-purple to-blue text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8">We'd love to welcome you to BETHEL CHURCH</p>
          <Link to="/contact" className="bg-gradient-to-r from-yellow to-orange text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity">
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
