import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from './store/authSlice';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import About from './pages/About';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Live from './pages/Live';
import Contact from './pages/Contact';
import Donations from './pages/Donations';
import DonationSuccess from './pages/DonationSuccess';
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
import PastStreams from './pages/PastStreams';
import Verses from './pages/Verses';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSermons from './pages/admin/AdminSermons';
import AdminEvents from './pages/admin/AdminEvents';
import AdminBlog from './pages/admin/AdminBlog';
import AdminGallery from './pages/admin/AdminGallery';
import AdminStreams from './pages/admin/AdminStreams';
import AdminPrayer from './pages/admin/AdminPrayer';
import AdminContact from './pages/admin/AdminContact';
import AdminDonations from './pages/admin/AdminDonations';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProfile from './pages/AdminProfile';
import AdminNotFound from './pages/admin/AdminNotFound';
import AdminMedia from './pages/admin/AdminMedia';
import AdminVerses from './pages/admin/AdminVerses';

function App() {
  const dispatch = useDispatch();
  const enableDonations = import.meta.env.VITE_ENABLE_DONATIONS === 'true';

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider>
    <ToastProvider>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/reset-password" element={<ResetPassword />} />
      {enableDonations && <Route path="/donation/success" element={<DonationSuccess />} />}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/sermons" element={<ProtectedRoute><AdminSermons /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute><AdminEvents /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
      <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
      <Route path="/admin/streams" element={<ProtectedRoute><AdminStreams /></ProtectedRoute>} />
      {enableDonations && <Route path="/admin/donations" element={<ProtectedRoute><AdminDonations /></ProtectedRoute>} />}
      <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/subscribers" element={<ProtectedRoute><AdminSubscribers /></ProtectedRoute>} />
      <Route path="/admin/prayer" element={<ProtectedRoute><AdminPrayer /></ProtectedRoute>} />
      <Route path="/admin/contact" element={<ProtectedRoute><AdminContact /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/media" element={<ProtectedRoute><AdminMedia /></ProtectedRoute>} />
      <Route path="/admin/verses" element={<ProtectedRoute><AdminVerses /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute><AdminNotFound /></ProtectedRoute>} />
      <Route path="/past-streams" element={<PastStreams />} />
      <Route path="/sermons" element={<Sermons />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/verses" element={<Verses />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event-registration" element={<EventRegistration />} />
            <Route path="/live" element={<Live />} />
            {enableDonations && <Route path="/donations" element={<Donations />} />}
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
      } />
    </Routes>
    </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
