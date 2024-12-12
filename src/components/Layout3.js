import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
const Layout3 = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "80px" }}></div>
      {children}
      <Footer />
    </>
  );
};

export default Layout3;
