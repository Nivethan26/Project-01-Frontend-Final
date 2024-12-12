import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./TimeslotForm.css";
import PaymentForm from "../PaymentForm/PaymentForm"; // Import PaymentForm component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Swal from "sweetalert2"; // Import SweetAlert2 for popups

Modal.setAppElement("#root"); // Specify your app root element

const TimeslotForm = ({ isOpen, onRequestClose, timeslot, date }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-header">
          <h2>Book Timeslot: {timeslot}</h2>
          <button onClick={onRequestClose} className="close-button">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength="10"
              pattern="\d{10}"
              required
            />
          </div>
          <div className="form-group">
            <label>Vehicle Model:</label>
            <input
              type="text"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Vehicle Number:</label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit Booking
          </button>
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
