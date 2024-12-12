// Layout.js
import React from 'react';
import HeroSection from './HeroSection';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <HeroSection />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
