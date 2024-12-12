import React, { useEffect } from 'react';
import './FooterEm.css';

const Footer = () => {
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        document.getElementById('currentYear').textContent = currentYear;
      }, []);

  return (
    <footer className="footer bg-dark pt-5 pb-4">
      <div className="container text-md-left">
        <div className="row text-md-left">
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">AutoCare Lanka</h5>
            <p>AutoCare Lanka is your trusted partner in providing top-notch automotive care services. We ensure your vehicle receives the best maintenance and repair solutions.</p>
          </div>
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3 quick-links">
            <h5 className="text-uppercase mb-4 font-weight-bold">Quick Links</h5>
            <p><a href=" #">Home</a></p>
            <p><a href=" #">About Us</a></p>
            <p><a href="/Services">Services</a></p>
            <p><a href=" #">Careers</a></p>
            <p><a href=" #">Contact Us</a></p>
          </div>
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">Contact</h5>
            <p><i className="fas fa-home mr-3"></i> 66, Attidiya Road, Rathmalana, Sri Lanka 10390.</p>
            <p><i className="fas fa-envelope mr-3"></i> info@autocarelanka.com</p>
            <p><i className="fas fa-phone mr-3"></i> +94 123 456 789</p>
            <p><i className="fas fa-print mr-3"></i> +94 123 456 780</p>
          </div>
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">Opening Hours</h5>
            <p><i className="far fa-clock mr-3"></i> Mon - Fri : 9 AM - 6 PM</p>
            <p><i className="far fa-clock mr-3"></i> Sat - Sun : 9 AM - 6 PM</p>
            <h5 className="text-uppercase mt-4 mb-4 font-weight-bold">Follow Us</h5>
            <div className="wrapper">
              <a href="https://facebook.com" className="button">
                <div className="icon">
                  <i className="fab fa-facebook-f"></i>
                </div>
              </a>
              <a href="https://tiktok.com" className="button">
                <div className="icon">
                  <i className="fab fa-tiktok"></i>
                </div>
              </a>
              <a href="https://instagram.com" className="button">
                <div className="icon">
                  <i className="fab fa-instagram"></i>
                </div>
              </a>
              <a href="https://youtube.com" className="button">
                <div className="icon">
                  <i className="fab fa-youtube"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
        <hr className="mb-4" />
        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="text-center text-md-left">© <span id="currentYear"></span> AutoCare Lanka. All Rights Reserved.</p>
          </div>
          <div className="col-md-5 col-lg-4">
            <p className="text-center text-md-right">Designed by CST_GROUP_12</p>
          </div>
        </div>
      </div>
    </footer>
  );
};



export default Footer;