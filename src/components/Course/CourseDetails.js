import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './CourseDetails.css';

export default function CourseDetails() {
  const { id } = useParams(); // Extract the course ID from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({
    courseId: '',
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/Backend/api/index.php/${id}`);
        const courseData = response.data;
        setCourse(courseData);

        // Automatically set the courseId in formData when course is fetched
        setFormData((prevData) => ({
          ...prevData,
          courseId: courseData.courseId, // Ensure courseId is stored in formData
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
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost/Backend/api/submit_application.php',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Ensure proper content type
          },
        }
      );

      if (response.data.status === 1) {
        // Display a success popup upon successful submission
        Swal.fire({
          title: 'Submission Success!',
          text: response.data.message || 'Thank you for applying.',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // Reset form fields
        setFormData({
          courseId: course.courseId,
          name: '',
          email: '',
          phone: '',
        });

        // Close the modal
        handleCloseModal();
      } else {
        // Display error popup if submission failed (server-side validation failure)
        Swal.fire({
          title: 'Submission Failed!',
          text: response.data.message || 'Unable to submit the application. Please try again.',
          icon: 'error',
          confirmButtonText: 'Retry',
        });
      }
    } catch (error) {
      console.error('Error:', error); // Log the error for debugging

      // Display an unexpected error popup
      Swal.fire({
        title: 'Submission Error!',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry',
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!course) return <p>No course details available</p>;

  // Process content2 to replace commas with line breaks
  const formattedContent2 = course.content2.split(',').map((text, index) => (
    <p key={index} className="content2-paragraph">• {text.trim()}</p>
  ));

  return (
    <div>
      <div className="container mt-5">
        {/* Course Image with Overlay */}
        <div className="position-relative text-center course-container mb-5">
          <img
            src={`http://localhost/Backend/images/${course.courseId}/${course.image1}`}
            alt={course.courseName}
            className="img-fluid course-image"
          />
          <div className="course-overlay-text">
            <h4 className="text-light">{course.courseName}</h4>
            <h3>{course.courseDuration}</h3>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-md-9 mt-3">
            <p>{course.content1}</p>
          </div>
          <div className="col-md-3 d-flex">
            <div className="container">
              <div className="row justify-content-center">
                <div className="text-center">
                  <div className="card p-3 shadow-sm course-fee-card">
                    <h4>Course Fee</h4>
                    <p className="lead">LKR {course.courseFee}</p>
                    <p><small>*Conditions Apply</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-5 mb-5">
            <img
              src={`http://localhost/Backend/images/${course.courseId}/${course.image2}`}
              alt={course.courseName}
              className="img-fluid courses-image"
            />
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-4">
            <h3>Course Content:</h3>
            {formattedContent2} {/* Render the processed content2 */}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <center>
          <button className="btn btn-danger" onClick={handleApplyNowClick}>
            Apply Now
          </button>
        </center>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={handleCloseModal}>
              &times;
            </span>
            <h3>Apply for {course.courseName}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="courseId">Course ID:</label>
                <input
                  type="text"
                  id="courseId"
                  name="courseId"
                  className="form-control"
                  value={formData.courseId}
                  readOnly // Make the field read-only
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
