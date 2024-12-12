import React, { useState } from "react";
import Swal from 'sweetalert2';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img1 from "../assets/A20.jpg";
import img2 from "../assets/A21.jpg";
import img3 from "../assets/A22.jpg";

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
    <div style={{ marginTop: "20px" }}>
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
        <div
          style={{
            marginTop: "20px",
            color: "green",
            backgroundColor: "#dff0d8",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          Your message has been sent successfully!
        </div>
      )}

      {/* Contact Form */}
      <div style={{ marginTop: "50px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "1200px" }}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <div
                style={{
                  backgroundColor: "#333",
                  color: "white",
                  padding: "20px",
                  width: "100%",
                  maxWidth: "500px",
                  marginRight: "30px",
                  borderRadius: "5px",
                  marginBottom: "50px",
                }}
              >
                <h1 style={{ marginBottom: "50px" }}>Find Us</h1>
                <div
                  style={{
                    marginBottom: "50px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="fas fa-home" style={{ marginRight: "15px" }}></i>
                  <span>66, Attidiya Road, Rathmalana, Sri Lanka 10390.</span>
                </div>
                <div
                  style={{
                    marginBottom: "50px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="fas fa-phone" style={{ marginRight: "15px" }}></i>
                  <span>+94 123 456 789</span>
                </div>
                <div
                  style={{
                    marginBottom: "50px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="fas fa-envelope" style={{ marginRight: "15px" }}></i>
                  <span>info@autocarelanka.com</span>
                </div>
                <div
                  style={{
                    marginBottom: "50px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="fas fa-print" style={{ marginRight: "15px" }}></i>
                  <span>+94 123 456 780</span>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h1>Contact Us</h1>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="firstName" style={{ display: "block" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                    {errors.firstName && (
                      <div style={{ color: "red" }}>{errors.firstName}</div>
                    )}
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="phone" style={{ display: "block" }}>
                      Phone No
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      maxLength="10"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                    {errors.phone && (
                      <div style={{ color: "red" }}>{errors.phone}</div>
                    )}
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="email" style={{ display: "block" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                    {errors.email && (
                      <div style={{ color: "red" }}>{errors.email}</div>
                    )}
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="message" style={{ display: "block" }}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#6c757d",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginBottom: "50px",
                    }}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
