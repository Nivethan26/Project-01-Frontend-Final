import Navbar from "./Navbar";
import Footer from "./Footer";
const Layout3 = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout3;
