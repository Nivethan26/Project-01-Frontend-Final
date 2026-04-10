import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from "../../utils/modernAlert";
import { 
  AccessTime, 
  BarChart, 
  Computer, 
  CheckCircle, 
  Star, 
  WorkOutline, 
  MenuBook 
} from '@mui/icons-material';
import './CourseDetails.css';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    name: '',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/Backend/api/index.php/${id}`);
        const courseData = response.data;
        setCourse(courseData);

        setFormData((prevData) => ({
          ...prevData,
          courseId: courseData.courseId,
        }));
      } catch (err) {
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const handleApplyNowClick = () => {
    // Ensure form is clean when opening the modal
    setFormData({
      courseId: course ? course.courseId : '',
      name: '',
      email: '',
      phone: '',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    if (isDirty) {
      const confirmClose = await Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved data. Are you sure you want to close?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#da1727',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, close it!'
      });
      if (!confirmClose.isConfirmed) return;
    }
    // Reset the form state when closing the modal
    setFormData({
      courseId: course ? course.courseId : '',
      name: '',
      email: '',
      phone: '',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    let newValue = value;

    // Remove non-numeric characters and limit to 9 digits for phone
    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 9);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    
    // Mark form as dirty when user begins typing
    setIsDirty(true);

    // Clear specific error field when user types in it
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters long.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.phone || formData.phone.length !== 9) {
      errors.phone = "Phone number must be exactly 9 digits.";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Format phone correctly before submitting
    const submissionData = {
      ...formData,
      phone: `+94${formData.phone}`,
    };

    try {
      const response = await axios.post(
        'http://localhost/Backend/api/submit_application.php',
        submissionData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.status == 1) {
        // 1. Close modal and reset state immediately
        setIsDirty(false);
        setFormData({
          courseId: course.courseId,
          name: '',
          email: '',
          phone: '',
        });
        setFormErrors({});
        setIsModalOpen(false);

        // 2. Then show the success popup
        await Swal.fire({
          title: 'Submission Success!',
          text: response.data.message || 'Thank you for applying.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Submission Failed!',
          text: response.data.message || 'Unable to submit the application. Please try again.',
          icon: 'error',
          confirmButtonText: 'Retry',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Submission Error!',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry',
      });
    }
  };

  if (loading) return (
    <div className="course-loading-container">
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!course) return <p className="text-center mt-5">No course details available</p>;

  const formattedContent2 = course.content2.split(',').map((text, index) => (
    <li key={index} className="course-content-item">
      <CheckCircle className="course-check-icon" />
      <span>{text.trim()}</span>
    </li>
  ));

  return (
    <div className="course-details-page">
      {/* 1. Hero Section Enhancement */}
      <div className="course-details-hero">
        <div className="course-hero-bg" style={{ backgroundImage: `url(http://localhost/Backend/images/${course.courseId}/${course.image1})` }}>
          <div className="course-hero-overlay"></div>
        </div>
        <div className="container course-hero-content text-center">
          <span className="course-badge-modern mb-3">Professional Training</span>
          <h1 className="course-hero-title">{course.courseName}</h1>
          <p className="course-hero-subtitle">Elevate your automotive career with industry-leading expertise.</p>
        </div>
      </div>

      <div className="container course-main-wrapper">
        <div className="course-grid-container">
          {/* Left Column -> Content */}
          <div className="course-content-area animate-fade-in-up">
            
            {/* 2. Course Info Bar */}
            <div className="course-info-bar shadow-sm">
              <div className="info-item">
                <AccessTime className="info-icon" />
                <div>
                  <strong>Duration</strong>
                  <span>{course.courseDuration || '6 Months'}</span>
                </div>
              </div>
              <div className="info-divider"></div>
              <div className="info-item">
                <BarChart className="info-icon" />
                <div>
                  <strong>Level</strong>
                  <span>Beginner to Advanced</span>
                </div>
              </div>
              <div className="info-divider"></div>
              <div className="info-item">
                <Computer className="info-icon" />
                <div>
                  <strong>Mode</strong>
                  <span>In-Person & Practical</span>
                </div>
              </div>
            </div>

            {/* 3. Content Structure (Overview) */}
            <div className="course-section">
              <h2 className="section-title"><MenuBook className="section-icon"/> Overview</h2>
              <p className="course-overview-text">{course.content1}</p>
            </div>

            {/* 6. Course Content Section */}
            <div className="course-section">
              <h2 className="section-title"><WorkOutline className="section-icon"/> What You Will Learn</h2>
              <ul className="course-learning-list">
                {formattedContent2}
              </ul>
            </div>

            {/* 7. Highlight Section */}
            <div className="course-section">
              <h2 className="section-title"><Star className="section-icon"/> Why Choose This Course</h2>
              <div className="row mt-4">
                <div className="col-md-4 mb-3">
                  <div className="highlight-box">
                    <div className="highlight-icon-wrapper">🏅</div>
                    <h4>Industry Certified</h4>
                    <p>Recognized certifications to boost your credentials.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="highlight-box">
                    <div className="highlight-icon-wrapper">🔧</div>
                    <h4>Hands-on Training</h4>
                    <p>Practical experience with real automotive parts.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="highlight-box">
                    <div className="highlight-icon-wrapper">🚀</div>
                    <h4>Career Opportunities</h4>
                    <p>Direct pathways to employment in top workshops.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="course-image-gallery">
              <img
                src={`http://localhost/Backend/images/${course.courseId}/${course.image2}`}
                alt={course.courseName}
                className="course-content-image"
              />
            </div>
          </div>

          {/* Right Column -> Sticky Fee Card */}
          <div className="course-sidebar-area animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="course-sticky-sidebar">
              {/* 4. Course Fee Card Improvement */}
              <div className="premium-fee-card shadow">
                <div className="fee-card-header">
                  <h4>Course Fee</h4>
                  <div className="fee-amount">
                    <span className="currency">LKR</span>
                    <span className="amount">{course.courseFee}</span>
                  </div>
                  <p className="fee-conditions">*Conditions Apply</p>
                </div>
                
                <div className="fee-card-body">
                  <ul className="fee-features">
                    <li><CheckCircle className="feature-check"/> Full access to workshops</li>
                    <li><CheckCircle className="feature-check"/> Training materials included</li>
                    <li><CheckCircle className="feature-check"/> Certificate upon completion</li>
                  </ul>

                  {/* 5. Add CTA Buttons */}
                  <div className="cta-buttons mt-4">
                    <button className="btn-premium-apply w-100 mb-3" onClick={handleApplyNowClick}>
                      Apply Now
                    </button>
                    <button className="btn-premium-enroll w-100" onClick={handleApplyNowClick}>
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Unchanged underlying logic, polished UI */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-premium-content" onClick={(e) => e.stopPropagation()}>
            <button className="premium-close-btn" onClick={handleCloseModal}>&times;</button>
            <h3 className="modal-title text-center mb-4">Apply for {course.courseName}</h3>
            <form onSubmit={handleFormSubmit} noValidate>
              <div className="form-group modern-input-group">
                <label htmlFor="courseId">Course ID</label>
                <input type="text" id="courseId" name="courseId" className="form-control" value={formData.courseId} readOnly />
              </div>
              <div className="form-group modern-input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" />
                {formErrors.name && <span style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
              </div>
              <div className="form-group modern-input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" />
                {formErrors.email && <span style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '4px', display: 'block' }}>{formErrors.email}</span>}
              </div>
              <div className="form-group modern-input-group">
                <label htmlFor="phone">Phone Number</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ padding: '14px 16px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRight: 'none', borderRadius: '10px 0 0 10px', color: '#555', fontWeight: '500', boxSizing: 'border-box', margin: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    +94
                  </span>
                  <input type="tel" id="phone" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} placeholder="7X XXX XXXX" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flex: 1, margin: 0 }} />
                </div>
                {formErrors.phone && <span style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '4px', display: 'block' }}>{formErrors.phone}</span>}
              </div>
              
              {/* Disable Button dynamically if inherently invalid, or let validateForm handle on-click */}
              <button 
                type="submit" 
                className="btn-premium-submit" 
                disabled={!formData.name || !formData.email || formData.phone.length !== 9}
                style={{ 
                  opacity: (!formData.name || !formData.email || formData.phone.length !== 9) ? 0.6 : 1, 
                  cursor: (!formData.name || !formData.email || formData.phone.length !== 9) ? 'not-allowed' : 'pointer' 
                }}
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
