import Navbar from './Navbar';
import Footer from './Footer';
import Announcements from './Announcements';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Announcements />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
