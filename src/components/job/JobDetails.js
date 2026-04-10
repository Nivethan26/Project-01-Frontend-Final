import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  WorkOutline,
  AttachMoney,
  Event,
  BusinessCenter,
  CloudUpload
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './JobDetailsUI.css';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    jobId: id,
    name: '',
    phone: '',
    email: '',
    cv: null,
  });
  const [formMessage, setFormMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/Backend/api/indexjob.php/${id}`);
        setJob(response.data);
      } catch (err) {
        setError('Error fetching job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 9);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setFormData((prevState) => ({
          ...prevState,
          cv: file,
        }));
        setFormErrors((prev) => ({ ...prev, cv: '' }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          cv: null,
        }));
        setFormErrors((prev) => ({ ...prev, cv: 'Only PDF files are allowed.' }));
        e.target.value = null;
      }
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
    if (!formData.cv) {
      errors.cv = "Please upload your CV (PDF format only).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const { name, phone, email, cv, jobId } = formData;
    const applicationData = new FormData();
    applicationData.append('jobId', jobId);
    applicationData.append('name', name);
    applicationData.append('phone', `+94${phone}`);
    applicationData.append('email', email);
    applicationData.append('cv', cv);

    try {
      const response = await axios.post(
        'http://localhost/Backend/api/submit_applications.php',
        applicationData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success || response.data.status == 1) {
        toast.success('Application submitted successfully!');
        setShowModal(false);
        setFormMessage('');
        setFormData({ ...formData, name: '', phone: '', email: '', cv: null }); // clear format
      } else {
        toast.error(response.data.message || 'Something went wrong, please try again.');
      }
    } catch (error) {
      toast.error('Failed to submit the application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>No job details found!</p>;

  const formatAsList = (text) => {
    return text
      ? text
        .split('-')
        .map((item) => item.trim())
        .filter((item) => item)
        .map((item, index) => (
          <li key={index}>{item}</li>
        ))
      : null;
  };

  const benefitsList = formatAsList(job.benefits);
  const responsibilitiesList = formatAsList(job.keyResponsibilities);
  const requirementsList = formatAsList(job.requirements);

  return (
    <div className="container job-details-container">
      <ToastContainer />
      <div className="job-details-grid">
        
        {/* Left Column: Main Job Content */}
        <div className="job-main-content">
          <div className="job-image-wrapper">
            <img
              src={`http://localhost/Backend/images/${job.jobId}/${job.image1}`}
              alt={job.jobTitle}
              className="job-main-image"
            />
          </div>

          <div className="job-section-card">
            <h3 className="job-section-title">Job Description</h3>
            <p className="job-body-text">{job.content1}</p>
            <p className="job-body-text">{job.content2}</p>
          </div>

          <div className="job-section-card">
            <h3 className="job-section-title">Key Responsibilities</h3>
            <ul className="job-list">{responsibilitiesList}</ul>
          </div>

          <div className="job-section-card">
            <h3 className="job-section-title">Requirements</h3>
            <ul className="job-list">{requirementsList}</ul>
          </div>

          <div className="job-section-card">
            <h3 className="job-section-title">Benefits</h3>
            <ul className="job-list">{benefitsList}</ul>
          </div>

          <div className="job-section-card">
            <h3 className="job-section-title">How to Apply</h3>
            <p className="job-body-text">
              Interested candidates are encouraged to submit their resume and cover letter by applying online at our website.
            </p>
            <div className="mt-4 text-center">
              <b className="job-body-text"><i>Join Autocare Lanka and take on a leadership role where your skills and experience will make a difference!</i></b>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary Card */}
        <div className="job-sidebar-column">
          <div className="job-summary-card">
            <h2 className="job-summary-title">{job.jobTitle}</h2>
            <div className="job-summary-divider"></div>
            
            <div className="job-summary-detail">
              <div className="job-summary-icon-wrapper">
                <WorkOutline className="job-summary-icon" />
              </div>
              <div className="job-summary-text">
                <span className="job-summary-label">Experience</span>
                <span className="job-summary-value">{job.experience} Years</span>
              </div>
            </div>

            <div className="job-summary-detail">
              <div className="job-summary-icon-wrapper">
                <BusinessCenter className="job-summary-icon" />
              </div>
              <div className="job-summary-text">
                <span className="job-summary-label">Job Type</span>
                <span className="job-summary-value">{job.jobType}</span>
              </div>
            </div>

            <div className="job-summary-detail">
              <div className="job-summary-icon-wrapper">
                <AttachMoney className="job-summary-icon" />
              </div>
              <div className="job-summary-text">
                <span className="job-summary-label">Salary</span>
                <span className="job-summary-value">{job.salary}</span>
              </div>
            </div>

            <div className="job-summary-detail">
              <div className="job-summary-icon-wrapper">
                <Event className="job-summary-icon" />
              </div>
              <div className="job-summary-text">
                <span className="job-summary-label">Closing Date</span>
                <span className="job-summary-value">{new Date(job.closingDate).toLocaleDateString()}</span>
              </div>
            </div>

            <button className="btn-premium-apply-job" onClick={() => setShowModal(true)}>
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Existing Modal logic below */}
      {showModal && (
        <div className="job-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="job-modal-content-modern" onClick={(e) => e.stopPropagation()}>
            <button className="job-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="job-modal-title">Apply for {job.jobTitle}</h3>

            <form onSubmit={handleApply} noValidate>
              <div className="job-form-group">
                <label>Job ID</label>
                <input
                  type="text"
                  name="jobId"
                  value={job.jobId}
                  readOnly
                  className="job-input-modern job-read-only"
                />
              </div>

              <div className="job-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="job-input-modern"
                  placeholder="Enter your full name"
                />
                {formErrors.name && <span className="job-error-text">{formErrors.name}</span>}
              </div>

              <div className="job-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="job-input-modern"
                  placeholder="name@example.com"
                />
                {formErrors.email && <span className="job-error-text">{formErrors.email}</span>}
              </div>

              <div className="job-form-group">
                <label>Phone Number</label>
                <div className="job-phone-wrapper">
                  <span className="job-phone-prefix">+94</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="job-input-modern job-phone-input"
                    placeholder="71 234 5678"
                  />
                </div>
                {formErrors.phone && <span className="job-error-text">{formErrors.phone}</span>}
              </div>

              <div className="job-form-group">
                <label>Upload CV</label>
                <label className="job-file-upload-zone">
                  <CloudUpload className="job-upload-icon" />
                  <span className="job-upload-text">
                    {formData.cv ? formData.cv.name : "Click to select a PDF file"}
                  </span>
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="job-file-hidden"
                  />
                </label>
                {formErrors.cv && <span className="job-error-text">{formErrors.cv}</span>}
              </div>

              <button 
                type="submit" 
                className="btn-job-submit" 
                disabled={isSubmitting || !formData.name || !formData.email || formData.phone.length !== 9 || !formData.cv}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}