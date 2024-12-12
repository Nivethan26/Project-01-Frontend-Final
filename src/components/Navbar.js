import React from 'react';
import {Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <a className="navbar-brand me-auto" href=" #">
          <img src="/assets/logo.png" alt="AutoCare Lanka Logo" className="navbar-logo"/>
        </a>
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
                <a className="nav-link mx-lg-2" href="/Home"><b>Home</b></a>
              </li>
              <li className="nav-item">
                <a className="nav-link mx-lg-2" href="/About"><b>About Us</b></a>
              </li>
              <li className="nav-item">
                <a className="nav-link mx-lg-2" href="/Services"><b>Services</b></a>
              </li>
              <li className="nav-item">
                <a className="nav-link mx-lg-2" href="/career"><b>Careers</b></a>
              </li>
              <li className="nav-item">
                <a className="nav-link mx-lg-2" href="/contactus"><b>Contact Us</b></a>
              </li>
            </ul>
          </div>
        </div>
        <Link to="/LoginRegister" href=" #" className="login-button">Login</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
