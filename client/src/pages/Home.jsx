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
import FadeInSection from '../components/FadeInSection';
import { FaPlay, FaCalendarAlt, FaBookOpen } from 'react-icons/fa';
import { fetchSermons, fetchEvents, fetchCurrentStream, fetchVerseOfTheDay } from '../services/api';

const LIVE_SLIDE_INDEX = 1;

function combineSchedule(stream) {
  if (!stream?.scheduled_date) return null;
  const d = new Date(stream.scheduled_date);
  if (stream.scheduled_time) {
    const [h, m] = stream.scheduled_time.split(':');
    d.setHours(parseInt(h), parseInt(m), 0, 0);
  }
  return d;
}

const defaultSlides = [
  {
    id: 1,
    title: "Welcome to BETHEL CHURCH",
    subtitle: "Connecting People to God and Each Other",
    description: "Join us every Sunday for worship, prayer, and community",
    image: "/images/worship 5.jpeg",
    cta: "Join Us This Sunday",
    link: "/about"
  },
  {
    id: 2,
    title: "Live Stream Services",
    subtitle: "Worship From Anywhere",
    description: "Experience the presence of God from the comfort of your home",
    image: "/images/Live Stream Services.png",
    cta: "Watch Live",
    link: "/live"
  },
  {
    id: 3,
    title: "Grow in Your Faith",
    subtitle: "Bible Study & Discipleship",
    description: "Dive deeper into God's Word with our study groups",
    image: "/images/bible study.jpg",
    cta: "Learn More",
    link: "/sermons"
  },
  {
    id: 4,
    title: "Young Adults (CHAMPIONS)",
    subtitle: "Building the Next Generation",
    description: "Empowering young people to discover their purpose in Christ",
    image: "/images/champions2.jpeg",
    cta: "Get Involved",
    link: "/events"
  },
  {
    id: 5,
    title: "Community Outreach",
    subtitle: "Serving Our Neighbors",
    description: "Making a difference in our local community together",
    image: "/images/outreach 10.jpeg",
    cta: "Volunteer",
    link: "/contact"
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [stream, setStream] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verseOfDay, setVerseOfDay] = useState(null);

  useEffect(() => {
    fetchSermons().then(data => {
      setSermons(data.map(s => ({ ...s, audioUrl: s.audio_url, videoUrl: s.video_url })));
    }).catch(() => {});
    fetchEvents().then(setEvents).catch(() => {}).finally(() => setLoading(false));
    fetchVerseOfTheDay().then(setVerseOfDay).catch(() => {});
    const poll = () => fetchCurrentStream().then(setStream).catch(() => {});
    poll();
    const pollId = setInterval(poll, 30000);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % defaultSlides.length);
    }, 240000);
    return () => { clearInterval(interval); clearInterval(pollId); };
  }, []);

  useEffect(() => {
    const scheduled = combineSchedule(stream);
    if (!scheduled || stream?.is_live) { setTimeLeft(null); return; }
    const TEN_MIN = 10 * 60 * 1000;
    const calc = () => { const d = scheduled - Date.now(); setTimeLeft(d > 0 && d <= TEN_MIN ? d : 0); };
    calc(); const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [stream?.scheduled_date, stream?.scheduled_time, stream?.is_live]);

  const isLive = stream?.is_live;
  const isUpcoming = timeLeft !== null && timeLeft > 0;
  const hasStreamEvent = isLive || isUpcoming;

  const slides = [...defaultSlides];
  if (isLive) {
    slides[LIVE_SLIDE_INDEX] = {
      ...slides[LIVE_SLIDE_INDEX],
      subtitle: "We're Live Now!",
      description: stream.title || 'Join us live — worship from wherever you are',
      cta: 'Watch Live',
    };
  } else if (isUpcoming) {
    const h = Math.floor(timeLeft / 3600000);
    const m = Math.floor((timeLeft % 3600000) / 60000);
    slides[LIVE_SLIDE_INDEX] = {
      ...slides[LIVE_SLIDE_INDEX],
      subtitle: timeLeft > 86400000
        ? `Next Stream: ${combineSchedule(stream)?.toLocaleDateString()}`
        : `Stream starts in ${h}h ${m}m`,
      description: stream.title || 'Live Stream Service',
      cta: 'Set Reminder',
    };
  }

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
      <section className="relative min-h-[400px] md:h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/70"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display animate-fade-in-up">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-2 text-secondary font-semibold animate-fade-in-up animation-delay-100">{slide.subtitle}</p>
                <p className="text-lg mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">{slide.description}</p>
                <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-300">
                  <Link
                    to={slide.link}
                    className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-opacity inline-block shadow-lg"
                  >
                    {slide.cta}
                  </Link>
                  {hasStreamEvent && (
                    <Link
                      to="/live"
                      className="bg-white/20 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/30 transition-colors inline-block flex items-center gap-2"
                    >
                      <FaPlay /> {isLive ? 'Watch Live' : 'View Details'}
                    </Link>
                  )}
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

      {/* <StatsCounter /> */}

      {verseOfDay && (
        <FadeInSection>
          <section className="section-padding bg-white dark:bg-gray-800">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-sm font-medium mb-6">
                <FaBookOpen className="w-4 h-4" />
                Verse of the Day
              </div>
              <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed italic mb-4">
                &ldquo;{verseOfDay.verse_text}&rdquo;
              </blockquote>
              <cite className="text-primary font-semibold not-italic text-lg">{verseOfDay.reference}</cite>
              <span className="text-gray-400 text-sm ml-2">{verseOfDay.version}</span>
              <div className="mt-6">
                <Link to="/verses" className="text-primary hover:underline font-medium text-sm">
                  View All Verses &rarr;
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>
      )}

      {sermons.length > 0 && (
        <FadeInSection>
          <section className="section-padding bg-gray-50 dark:bg-gray-900 text-center">
            <div className="max-w-2xl mx-auto px-4">
              <h2 className="text-3xl font-bold font-display text-primary mb-2">Latest Sermon</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Listen to our most recent message</p>
              <Link to="/sermons" className="block relative aspect-video rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 group">
                <img src={sermons[0].thumbnail || '/churchlogo.png'} alt={sermons[0].title} className="w-full h-full object-contain p-12 opacity-30 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                  <h3 className="text-white text-lg font-bold font-display">{sermons[0].title}</h3>
                  <p className="text-gray-300 text-sm">{sermons[0].speaker}</p>
                </div>
              </Link>
            </div>
          </section>
        </FadeInSection>
      )}
      <WhatToExpect />

      <FadeInSection>
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-primary font-display">Upcoming Events</h2>
            <Link to="/events" className="text-orange font-semibold hover:underline flex items-center gap-2">
              View All <FaCalendarAlt />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <p className="text-gray-400 col-span-full text-center py-8">Loading events...</p>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-gray-400 col-span-full text-center py-8">No upcoming events.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id}>
                  <EventCard event={event} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      </FadeInSection>

      <FadeInSection><FeaturedMinistries /></FadeInSection>

      <FadeInSection><SocialFeed /></FadeInSection>

      <FadeInSection><GoogleMap /></FadeInSection>

      <FadeInSection>
      <section className="section-padding bg-gradient-to-r from-primary to-primary/80 text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 font-display">Join Our Community</h2>
          <p className="text-xl mb-8">We'd love to welcome you to BETHEL CHURCH</p>
          <Link to="/contact" className="bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-white/90 transition-all duration-200 hover:-translate-y-0.5 inline-block shadow-lg min-h-[48px]">
            Get In Touch
          </Link>
        </div>
      </section>
      </FadeInSection>
    </div>
  );
};

export default Home;
