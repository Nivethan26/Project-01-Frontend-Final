import React, { useEffect } from "react";
import img1 from "../assets/img1.jpg";
import img3 from "../assets/img3.jpeg";
import { useNavigate } from "react-router";
import "./About.css";

// Material UI Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BoltIcon from '@mui/icons-material/Bolt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EngineeringIcon from '@mui/icons-material/Engineering';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div 
        className="about-hero-section" 
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>About AutoCare Lanka</h1>
          <p>Your Trusted Automotive Partner</p>
        </div>
      </div>

      <div className="about-container">
        
        {/* Who We Are / About Grid Section */}
        <div className="about-grid-section">
          <div className="about-grid-text">
            <h2>Who We Are</h2>
            <p>
              AutoCare Lanka is transforming the way vehicle owners interact with service centres. 
              We provide a comprehensive online booking system, job opportunities, educational 
              resources, and clear career pathways in the automotive industry. Join us and 
              help shape the future of automotive education and reliable service.
            </p>
            {/* Stats inline */}
            <div className="about-stats">
              <div className="stat-item">
                <h3>1000+</h3>
                <span>Bookings</span>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <span>Stations</span>
              </div>
              <div className="stat-item">
                <h3>98%</h3>
                <span>Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="about-grid-image">
            <img src={img3} alt="Who We Are" />
          </div>
        </div>

        {/* Vision & Mission Sections */}
        <div className="vision-mission-section">
          <div className="vm-card">
            <div className="vm-icon-wrapper">
              <VisibilityIcon className="vm-icon" />
            </div>
            <h2>Our Vision</h2>
            <p>
              Our vision is to revolutionize the vehicle service industry by becoming the 
              preferred platform for seamless service reservations, education opportunities, 
              and career advancement within the automotive sector.
            </p>
          </div>

          <div className="vm-card">
            <div className="vm-icon-wrapper">
              <TrackChangesIcon className="vm-icon" />
            </div>
            <h2>Our Mission</h2>
            <p>
              Simplify the process of booking service appointments for vehicle owners, 
              ensuring convenience and reliability. We aim to empower future professionals 
              through robust automotive education and connect job seekers with rewarding 
              career opportunities.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="features-section">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <BoltIcon className="feature-icon" />
              </div>
              <h3>Fast Booking</h3>
              <p>Seamlessly schedule your next service with just a few clicks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <VerifiedUserIcon className="feature-icon" />
              </div>
              <h3>Reliable Service</h3>
              <p>Quality and trust you can depend on for all your automotive needs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <EngineeringIcon className="feature-icon" />
              </div>
              <h3>Professional Technicians</h3>
              <p>Expertly trained staff equipped with top-tier industry knowledge.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <EventAvailableIcon className="feature-icon" />
              </div>
              <h3>Easy Scheduling</h3>
              <p>Flexible and convenient time slots tailored to fit your busy life.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready for an Upgrade?</h2>
          <p>Experience the ultimate automotive service standard and empower your journey.</p>
          <button className="cta-btn" onClick={() => navigate('/bookingStation01')}>
            Book a Service Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default About;