import React from "react";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import img1 from "../assets/A19.jpg";
import img2 from "../assets/A16.jpg";
import img3 from "../assets/A18.jpg";
import img4 from "../assets/A17.jpg";
import "./Career2.css";

export default function Career1() {
  return (
    <div style={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      {/* 1. Hero Section */}
      <div className="career-hero-section">
        <h1 className="career-hero-title">Join Our Team</h1>
        <p className="career-hero-subtitle">
          Drive your career forward with AutoCare Lanka. We are looking for passionate,
          innovative, and driven individuals to help us redefine the automotive service industry.
        </p>
      </div>

      {/* Main Container */}
      <div className="container" style={{ marginTop: "60px", maxWidth: "1200px" }}>
        
        <h2 className="career-section-heading">Explore Opportunities</h2>

        {/* Core Career Pillars (Enhanced Cards) */}
        <div className="row g-4 mb-5 justify-content-center">
          <div className="col-12 col-md-6 col-lg-4 anim-st-1">
            <div className="career-card-modern">
              <div className="career-img-wrapper">
                <img
                  src={img1}
                  className="img-fluid custom-image"
                  alt="Engineering Courses"
                />
              </div>
              <div className="career-card-body">
                <h5 className="career-card-title">Engineering Courses</h5>
                <p className="career-card-desc">
                  Accelerate your technical skills with our comprehensive automotive engineering training.
                </p>
                <Link to="/course" className="btn-career-primary">
                  Explore Courses <KeyboardArrowRightIcon fontSize="small" className="ms-1" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 anim-st-1">
            <div className="career-card-modern">
              <div className="career-img-wrapper">
                <img
                  src={img2}
                  className="img-fluid custom-image"
                  alt="Life at AutoCare"
                />
              </div>
              <div className="career-card-body">
                <h5 className="career-card-title">Life at AutoCare</h5>
                <p className="career-card-desc">
                  Discover a vibrant, inclusive, and fast-paced environment where your ideas matter.
                </p>
                <Link to="/careerlife" className="btn-career-primary">
                  Discover More <KeyboardArrowRightIcon fontSize="small" className="ms-1" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 anim-st-1">
            <div className="career-card-modern">
              <div className="career-img-wrapper">
                <img
                  src={img3}
                  className="img-fluid custom-image"
                  alt="Job Openings"
                />
              </div>
              <div className="career-card-body">
                <h5 className="career-card-title">Job Openings</h5>
                <p className="career-card-desc">
                  View our latest vacancies and find the perfect role matching your expertise.
                </p>
                <Link to="/careerjob" className="btn-career-primary">
                  View Openings <KeyboardArrowRightIcon fontSize="small" className="ms-1" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 anim-st-1">
            <div className="career-card-modern">
              <div className="career-img-wrapper">
                <img
                  src={img4}
                  className="img-fluid custom-image"
                  alt="Our People"
                />
              </div>
              <div className="career-card-body">
                <h5 className="career-card-title">Our People</h5>
                <p className="career-card-desc">
                  Meet the diverse and talented individuals driving AutoCare Lanka's success.
                </p>
                <Link to="/careerpeople" className="btn-career-primary">
                  Meet the Team <KeyboardArrowRightIcon fontSize="small" className="ms-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section anim-st-2">
          <h2 className="career-section-heading">Why Work With Us?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <LocalAtmIcon />
                </div>
                <h4>Competitive Salary</h4>
                <p>We offer industry-leading compensation packages and performance-based bonuses to reward your hard work.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <WorkspacePremiumIcon />
                </div>
                <h4>Training Programs</h4>
                <p>Continuous learning is part of our DNA. Access premium workshops, certifications, and technical resources.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <TrendingUpIcon />
                </div>
                <h4>Career Growth</h4>
                <p>Clear, structured career mobility pathways designed to elevate you from junior roles to leadership positions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Open Positions Section */}
        <div className="positions-section anim-st-3 px-4">
          <h2 className="career-section-heading mb-5">Current Openings</h2>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Position 1 */}
              <div className="position-card">
                <div className="pos-info">
                  <h5>Senior Automotive Technician</h5>
                  <p><LocationOnIcon /> Colombo Service Center &middot; Full Time</p>
                </div>
                <Link to="/careerjob" className="btn-apply-outline">Apply Now</Link>
              </div>
              
              {/* Position 2 */}
              <div className="position-card">
                <div className="pos-info">
                  <h5>Service Advisor / Manager</h5>
                  <p><LocationOnIcon /> Kandy Branch &middot; Full Time</p>
                </div>
                <Link to="/careerjob" className="btn-apply-outline">Apply Now</Link>
              </div>

              {/* Position 3 */}
              <div className="position-card">
                <div className="pos-info">
                  <h5>Diagnostic Specialist (EV/Hybrid)</h5>
                  <p><LocationOnIcon /> Colombo Service Center &middot; Full Time</p>
                </div>
                <Link to="/careerjob" className="btn-apply-outline">Apply Now</Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
