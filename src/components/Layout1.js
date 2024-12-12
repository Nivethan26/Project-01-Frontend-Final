import React from 'react';
import Navbar from './Navbar';

const Layout1 = ({ children }) => {
  return (
    <>
      
      <Navbar />
      {children}
    </>
  );
};

export default Layout1;