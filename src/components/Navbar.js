import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/Home' && (location.pathname === '/' || location.pathname.toLowerCase() === '/home')) {
        return 'active';
    }
    return location.pathname.toLowerCase().startsWith(path.toLowerCase()) ? 'active' : '';
  };

  return (
    <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand me-auto" to="/Home">
          <img src="/assets/logo.png" alt="AutoCare Lanka Logo" className="navbar-logo"/>
        </Link>
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              AutoCare Lanka
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className={`nav-link mx-lg-2 ${isActive('/Home')}`} to="/Home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link mx-lg-2 ${isActive('/About')}`} to="/About">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link mx-lg-2 ${isActive('/Services')}`} to="/Services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link mx-lg-2 ${isActive('/career')}`} to="/career">Careers</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link mx-lg-2 ${isActive('/contactus')}`} to="/contactus">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        <Link to="/LoginRegister" className="login-button">Login</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
