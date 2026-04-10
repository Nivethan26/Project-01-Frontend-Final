import HeroSection from './HeroSection';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <HeroSection />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
