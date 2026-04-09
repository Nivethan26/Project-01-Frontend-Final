import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./TimeslotForm.css";
import PaymentForm from "../PaymentForm/PaymentForm"; // Import PaymentForm component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Swal from "sweetalert2"; // Import SweetAlert2 for popups

import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CloseIcon from '@mui/icons-material/Close';

Modal.setAppElement("#root"); // Specify your app root element

const TimeslotForm = ({ isOpen, onRequestClose, timeslot, date }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false); // State to show PaymentForm
  const navigate = useNavigate(); // Initialize useNavigate

  // Pre-fill name and email if the user is logged in
  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const userEmail = sessionStorage.getItem("email");
    if (username) {
      setName(username);
      if (userEmail) {
        setEmail(userEmail);
      }
    }
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!name.trim()) tempErrors.name = "Name is required";
    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email address is invalid";
    }
    if (!phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      tempErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (!vehicleModel.trim()) tempErrors.vehicleModel = "Vehicle model is required";
    if (!vehicleNumber.trim()) tempErrors.vehicleNumber = "Vehicle number is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    setIsSubmitting(true);
    const bookingData = {
      name,
      email,
      phone,
      vehicleModel,
      vehicleNumber,
      timeslot,
      date,
    };
  
    // Show loading animation popup
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we confirm your booking.",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      const response = await fetch(
        "http://localhost/Backend/api1.php?action=add_booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );
      const data = await response.json();
      setIsSubmitting(false);
      
      if (data.status === "success") {
        Swal.close(); // Close the loading animation
        Swal.fire({
          title: "Booking Proceeded!",
          text: "Your booking has been confirmed successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          onRequestClose(); // Close the booking form
          // Optionally, you can show the payment form here
        });
      } else {
        Swal.close(); // Close the loading animation
        Swal.fire({
          title: "Booking Failed",
          text: "There was an issue with your booking. Please try again.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setIsSubmitting(false);
      Swal.close(); // Close the loading animation
      Swal.fire({
        title: "Booking Proceeded!",
        text: "Your booking has been confirmed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setShowPaymentForm(true); // Show the payment form or handle the error
      });
    }
    
  };
  

  const handlePaymentClose = () => {
    setShowPaymentForm(false); // Hide payment form after payment
  };

  const getFormattedDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-header-modern">
          <h2>Confirm Your Booking</h2>
          <button onClick={onRequestClose} className="close-button-modern">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="booking-summary">
          <div className="booking-summary-grid">
             <div className="summary-item">
                <span className="summary-label">Date</span>
                <span className="summary-value">{getFormattedDate(date)}</span>
             </div>
             <div className="summary-item">
                <span className="summary-label">Time Slot</span>
                <span className="summary-value">{timeslot}</span>
             </div>
             <div className="summary-item">
                <span className="summary-label">Station</span>
                <span className="summary-value">AutoCare Service Station</span>
             </div>
             <div className="summary-item">
                <span className="summary-label">Service Type</span>
                <span className="summary-value">General Booking</span>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title"><PersonIcon fontSize="small" /> Personal Details</h3>
            <div className="form-grid">
              <div className="form-group-modern full-width">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "input-error" : ""}
                  placeholder="John Doe"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              <div className="form-group-modern">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "input-error" : ""}
                  placeholder="johndoe@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group-modern">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength="10"
                  className={errors.phone ? "input-error" : ""}
                  placeholder="0712345678"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title"><DirectionsCarIcon fontSize="small" /> Vehicle Details</h3>
            <div className="form-grid">
              <div className="form-group-modern">
                <label>Vehicle Model</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className={errors.vehicleModel ? "input-error" : ""}
                  placeholder="e.g. Toyota Corolla"
                />
                {errors.vehicleModel && <span className="error-message">{errors.vehicleModel}</span>}
              </div>
              <div className="form-group-modern">
                <label>Vehicle Number</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className={errors.vehicleNumber ? "input-error" : ""}
                  placeholder="e.g. ABC 1234"
                />
                {errors.vehicleNumber && <span className="error-message">{errors.vehicleNumber}</span>}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onRequestClose} className="cancel-button" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit Booking"}
            </button>
          </div>
        </form>
      </Modal>

      {showPaymentForm && (
        <Modal
          isOpen={showPaymentForm}
          onRequestClose={handlePaymentClose}
          className="Modal"
          overlayClassName="Overlay"
        >
          <PaymentForm />
        </Modal>
      )}
    </>
  );
};

export default TimeslotForm;
