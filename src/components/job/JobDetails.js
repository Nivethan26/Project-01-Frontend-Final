import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      cv: e.target.files[0],
    }));
  };

  const isPhoneValid = (phone) => {
    // Check if phone is exactly 10 digits
    return /^\d{10}$/.test(phone);
  };

  const isEmailValid = (email) => {
    // Basic email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const { name, phone, email, cv } = formData;

    // Validate phone number and email
    if (!isPhoneValid(phone)) {
      setFormMessage('Phone number must be exactly 10 digits.');
      return;
    }
    if (!isEmailValid(email)) {
      setFormMessage('Please enter a valid email address.');
      return;
    }

    const applicationData = new FormData();
    applicationData.append('jobId', formData.jobId);
    applicationData.append('name', name);
    applicationData.append('phone', phone);
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

      // Assuming the server returns an object with a success property.
      if (response.data.success) {
        setFormMessage('Your application was submitted successfully!');
        // Hide the modal after a short delay if the application was successful.
        setTimeout(() => {
          setShowModal(false);
          setFormMessage(''); // Clear the message after hiding the modal
        }, 3000); // Increase delay to ensure the message is visible
      } else {
        setFormMessage(response.data.message || 'Something went wrong, please try again.');
      }
    } catch (error) {
      setFormMessage('Failed to submit the application. Please try again.');
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
    <div className="container">
     <center><h2 className="title " >{job.jobTitle}</h2></center> 

      <div className="row align-items-center">
        <div className="col-md-12">
          <img
            src={`http://localhost/Backend/images/${job.jobId}/${job.image1}`}
            alt={job.jobTitle}
            className="img-fluid job-image"
          />
          <p className="job-description mt-5">{job.content1}</p>
          <p className="job-description">{job.content2}</p><br></br>
          
          <p><b>Experience:</b> {job.experience}</p>
          <p><b>Salary:</b> {job.salary}</p>
          <p><b>Closing Date:</b> {new Date(job.closingDate).toLocaleDateString()}</p>
          <p><b>Job Type:</b> {job.jobType}</p>


         <br></br>
          <h3>Key Responsibilities:</h3>
          <ul>{responsibilitiesList}</ul>

          <h3>Requirements:</h3>
          <ul>{requirementsList}</ul>
          <div>
            <div className="col-md-3 mt-3">
              <h3>Benefits:</h3>
              <ul>{benefitsList}</ul>
            </div>
            
          </div>
        </div>
        <div>
          <h4>How to Apply </h4>
          <p>Interested candidates are encouraged to submit their resume and cover letter by applying online at our website. </p>
          <div >
            <center><b><i>Join Autocare Lanka and take on a leadership role where your skills and experience will make a difference!</i></b></center>
          </div >
        </div>
      </div>
      <div className="col-md-3 mt-3 d-flex justify-content-center">
  <button className="btn btn-danger" onClick={() => setShowModal(true)}>
    Apply Now
  </button>
</div>




      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ab">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <h3>Apply for {job.jobTitle}</h3>
              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label>Job ID:</label>
                  <input
                    type="text"
                    name="jobId"
                    value={job.jobId}
                    readOnly
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Upload CV:</label>
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
              {formMessage && <p className="form-message">{formMessage}</p>} {/* Added class for styling */}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}