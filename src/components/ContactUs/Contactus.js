import React, { useState } from "react";
import Swal from 'sweetalert2';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img1 from "../assets/A20.jpg";
import img2 from "../assets/A21.jpg";
import img3 from "../assets/A22.jpg";
import "./Contactus.css";
import "./Contactus.css";

const ContactForm = () => {
  const initialFormData = {
    firstName: "",
    phone: "",
    email: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "firstName") {
      // Full Name Validation: Letters only, one space allowed between words
      const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
      if (!nameRegex.test(value)) {
        errorMsg = "Full name should contain only letters and one space.";
      }
    }

    if (name === "phone") {
      // Phone Number Validation: Exactly 10 digits, starts with 0
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(value)) {
        errorMsg = "Phone number must be exactly 10 digits and start with 0.";
      }
    }

    if (name === "email") {
      // Email Validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        errorMsg = "Please enter a valid email address.";
      }
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Set the form data as user types
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate the field in real-time
    const errorMsg = validateField(name, value);
    setErrors({
      ...errors,
      [name]: errorMsg,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    newErrors.firstName = validateField("firstName", formData.firstName);
    newErrors.phone = validateField("phone", formData.phone);
    newErrors.email = validateField("email", formData.email);

    // Filter out empty error messages
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Perform validation
  if (!validateForm()) {
    return; // Exit if form validation fails
  }

  try {
    const response = await fetch(
      "http://localhost/Backend/submit_message.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();

      if (result.success) {
        // SweetAlert2 success popup
        await Swal.fire({
          title: 'Success',
          text: 'Message is successfully sent.',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        setFormData(initialFormData);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        console.error(result.message);
        // SweetAlert2 error popup
        await Swal.fire({
          title: 'Error',
          text: `Error: ${result.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } else {
      console.error("Response is not JSON:", await response.text());
      // SweetAlert2 success popup for non-JSON response
      await Swal.fire({
        title: 'Success',
        text: 'Message is successfully sent.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
  } catch (error) {
    console.error("Error submitting the form:", error);
    // SweetAlert2 error popup for fetch error
    await Swal.fire({
      title: 'Error',
      text: 'An error occurred while submitting the form.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};


  const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  return (
    <div className="contact-page-wrapper">
      {/* Carousel */}
      <div style={{ maxWidth: "100%", overflow: "hidden" }}>
        <Slider {...settings}>
          <div>
            <img src={img1} alt="Image 1" style={{ width: "100%" }} />
          </div>
          <div>
            <img src={img2} alt="Image 2" style={{ width: "100%" }} />
          </div>
          <div>
            <img src={img3} alt="Image 3" style={{ width: "100%" }} />
          </div>
        </Slider>
      </div>

      {showSuccess && (
        <div style={{ maxWidth: "1200px", margin: "20px auto 0", padding: "0 20px" }}>
          <div style={{ color: "green", backgroundColor: "#dff0d8", padding: "15px", borderRadius: "5px" }}>
            Your message has been sent successfully!
          </div>
        </div>
      )}

      {/* Contact Form */}
      <div className="contact-container">
        <div className="contact-info-card">
          <h1>Find Us</h1>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <i className="fas fa-home"></i>
            </div>
            <span>66, Attidiya Road, Rathmalana, Sri Lanka 10390.</span>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <i className="fas fa-phone"></i>
            </div>
            <span>+94 741915898</span>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <i className="fas fa-envelope"></i>
            </div>
            <span>info@autocarelanka.com</span>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <i className="fas fa-print"></i>
            </div>
            <span>+94 123 456 780</span>
          </div>
        </div>

        <div className="contact-form-section">
          <h1>Contact Us</h1>
          <form onSubmit={handleSubmit}>
            <div className="contact-input-group">
              <label htmlFor="firstName">Full Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="contact-input"
              />
              {errors.firstName && <div className="contact-error-text">{errors.firstName}</div>}
            </div>
            
            <div className="contact-input-group">
              <label htmlFor="phone">Phone No</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
                required
                className="contact-input"
              />
              {errors.phone && <div className="contact-error-text">{errors.phone}</div>}
            </div>

            <div className="contact-input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="contact-input"
              />
              {errors.email && <div className="contact-error-text">{errors.email}</div>}
            </div>

            <div className="contact-input-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact-input contact-input-textarea"
              />
            </div>
            
            <button type="submit" className="contact-btn-submit">
              Submit
            </button>
            <div className="contact-helper-text">
              We'll get back to you within 24 hours.
            </div>
          </form>
        </div>
      </div>

      <div className="contact-map-container">
        <div className="contact-map-wrapper">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15846.52906803734!2d79.8732155!3d6.8153406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a5857ca2eb9%3A0x6732389aaebb0338!2sRathmalana%2C%20Dehiwala-Mount%20Lavinia%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
