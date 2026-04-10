import React from "react";
import { Link } from "react-router-dom";
import home1 from "../assets/home1.png";
import home2 from "../assets/home2.png";
import home3 from "../assets/home3.png";
import home4 from "../assets/home4.mp4";
import home5 from "../assets/home5.png";
import home6 from "../assets/home6.png";
import Routine_Maintenance from "../assets/Routine_Maintenance.jpg";
import Expert_Repairs from "../assets/Expert_Repairs.jpg";
import Full_Inspections from "../assets/Full_Inspections.jpg";
import Performance_Optimization from "../assets/Performance_Optimization.jpg";
import "./Home.css";

const Home = () => {
  return (
    <main className="modern-home">
      {/* 1. HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('path/to/your/image.jpg')" }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Premium Automobile Service in Sri Lanka</h1>
          <p className="hero-subtitle">
            Experience excellence with Sri Lanka's largest and most trusted auto service network.
          </p>
          <div className="hero-actions">
            <Link to="/LoginRegister" className="cta-button cta-primary">
              Book a Service
            </Link>
            <Link to="/Services" className="cta-button cta-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="about-section">
        <div className="container about-grid">
          <div className="about-image">
            <img src={home1} alt="AutoCare Lanka workshop excellence" />
          </div>
          <div className="about-text">
            <span className="section-label">ABOUT US</span>
            <span className="section-chip">Established Since 1996</span>
            <h2>Engineering Trust Through Precision Service</h2>
            <p>
              For over 28 years, AutoCare Lanka has delivered reliable maintenance,
              diagnostics, and repair solutions through certified teams and modern
              facilities. Every service experience is built on speed, transparency,
              and long-term vehicle performance.
            </p>
          </div>
        </div>
      </section>

      {/* NEW: SERVICES SECTION */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-heading">Core Service Capabilities</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-image">
                <img src={Routine_Maintenance} alt="Maintenance" />
              </div>
              <div className="service-info">
                <span className="service-tag">🔧 Essential Care</span>
                <h3>Routine Maintenance</h3>
                <p>Comprehensive check-ups and maintenance for optimal performance.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-image">
                <img src={Expert_Repairs} alt="Repairs" />
              </div>
              <div className="service-info">
                <span className="service-tag">⚙️ Precision Work</span>
                <h3>Expert Repairs</h3>
                <p>Advanced diagnostic and repair services by certified technicians.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-image">
                <img src={Full_Inspections} alt="Inspections" />
              </div>
              <div className="service-info">
                <span className="service-tag">✅ Safety First</span>
                <h3>Full Inspections</h3>
                <p>Detailed vehicle inspections to ensure your safety on the road.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-image">
                <img src={Performance_Optimization} alt="Performance tuning" />
              </div>
              <div className="service-info">
                <span className="service-tag">🏁 Pro Performance</span>
                <h3>Performance Optimization</h3>
                <p>Engine and system tuning for smoother drive quality and efficiency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE BANNER */}
      <section className="feature-banner">
        <div className="banner-overlay"></div>
        <img src={home2} alt="Autocare Facility Landscape" className="banner-image" />
      </section>

      {/* 4. LATEST NEWS SECTION */}
      <section className="news-section">
        <div className="container">
          <h2 className="section-heading">Latest News</h2>
          <div className="news-grid">
            <div className="news-card">
              <div className="news-media-container">
                <img src={home3} alt="Toyota Dealer 2022" />
              </div>
              <div className="news-content">
                <span className="news-chip">🏆 Achievement</span>
                <h3>Best Toyota Dealer 2022</h3>
                <p>
                  Proud that AutoCare Lanka has won the trophy for best Toyota
                  Dealer in the year of 2022.
                </p>
              </div>
            </div>

            <div className="news-card">
              <div className="news-media-container">
                <video controls>
                  <source src={home4} type="video/mp4" />
                </video>
              </div>
              <div className="news-content">
                <span className="news-chip">🎬 Spotlight</span>
                <h3>Best Automobile Service Center</h3>
                <p>
                  AutoCare Lanka has won the Best Automobile Service center trophy at Nations Lanka Convention in the year of 2023.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PARTNERS SECTION */}
      <section className="partners-section">
        <div className="container">
          <h2 className="section-heading">Our Service Partners</h2>
          <div className="partners-row">
            <img src={home5} alt="Partner Logo 1" className="partner-logo" />
            <img src={home6} alt="Partner Logo 2" className="partner-logo" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
