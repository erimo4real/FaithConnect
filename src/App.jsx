import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import About from './pages/About';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Live from './pages/Live';
import Contact from './pages/Contact';
import Donations from './pages/Donations';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Testimonials from './pages/Testimonials';
import Pastors from './pages/Pastors';
import Shop from './pages/Shop';
import PrayerRequest from './pages/PrayerRequest';
import SmallGroups from './pages/SmallGroups';
import EventRegistration from './pages/EventRegistration';
import Podcast from './pages/Podcast';
import StaffDirectory from './pages/StaffDirectory';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event-registration" element={<EventRegistration />} />
        <Route path="/live" element={<Live />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/team" element={<Pastors />} />
        <Route path="/staff-directory" element={<StaffDirectory />} />
        <Route path="/small-groups" element={<SmallGroups />} />
        <Route path="/prayer" element={<PrayerRequest />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <LiveChat />
    </Layout>
  );
}

export default App;
