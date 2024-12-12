import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import "font-awesome/css/font-awesome.min.css";

const PaymentForm = ({ closePayment }) => {
  const [username, setUsername] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleUsernameChange = (e) => {
    const input = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters and spaces
    setUsername(input);
  };

  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 16) {
      const formattedNumber = input.replace(/(.{4})/g, "$1 ").trim();
      setCardNumber(formattedNumber);
    }
  };

  const handleExpiryDateChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (input.length > 2) {
      input = input.slice(0, 2) + "/" + input.slice(2, 4); // Add slash after two digits
    }
    if (input.length <= 5) {
      setExpiryDate(input);
    }
  };

  const handleCvcChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Allow only numeric characters
    if (input.length <= 3) {
      setCvc(input);
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validate username (Cardholder Name)
    if (username.trim() === "") {
      errors.username = "Cardholder name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(username)) {
      errors.username = "Cardholder name must contain only letters";
      isValid = false;
    }

    // Validate card number
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      errors.cardNumber = "Card number must be 16 digits";
      isValid = false;
    }

    // Validate expiry date
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) {
      errors.expiryDate = "Expiry date must be in MM/YY format";
      isValid = false;
    }

    // Validate CVC
    if (cvc.length !== 3) {
      errors.cvc = "CVC must be 3 digits";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Trigger SweetAlert2 popup
    Swal.fire({
      title: "Booking Confirmed",
      text: "Your payment has been successfully processed.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // Get the user's role from sessionStorage
      const userRole = sessionStorage.getItem("user-role");

      // Check if the role exists
      if (!userRole) {
        console.error("User role not found in sessionStorage");
        alert("User role is not defined in session storage.");
        return; // Prevent further execution if role is not found
      }

      console.log("User role:", userRole); // Log to check the role

      // Redirect based on the user role
      if (userRole === "admin") {
        window.location.href = "http://localhost:3000/admin";  // Admin page URL
      } else {
        window.location.href = "http://localhost:3000/User";  // User page URL
      }
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
  
    // Show SweetAlert2 confirmation popup
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel the payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#d33",  // Customize the 'Yes' button color (red for cancel)
      cancelButtonColor: "#3085d6",  // Customize the 'No' button color (blue for keep)
    }).then((result) => {
      if (result.isConfirmed) {
        // If user clicks 'Yes'
        closePayment(false);
        Swal.fire({
          title: "Cancelled!",
          text: "Your payment has been cancelled.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745",  // Green for success
        });
      }
    });
  };
  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f2f2f2",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          width: "400px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            backgroundColor: "#2aac15",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "30px",
            fontWeight: "bold",
            margin: "0 auto 20px",
          }}
        >
          <p>P</p>
        </div>
        <h2>Payment Gateway</h2>
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={handleSubmit}
        >
          {/* Default Amount Display */}
          <div
            style={{
              marginTop: "20px",
              fontSize: "18px",
              color: "#333",
              fontWeight: "bold",
              backgroundColor: "#f9f9f9",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <p>
              Reservation Amount: <span style={{ color: "#ff6b6b" }}>Rs. 500.00</span>
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#333",
                marginBottom: "5px",
                textAlign: "left",
              }}
            >
              Cardholder Name:
            </label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {formErrors.username && (
              <p style={{ color: "#34d31c", fontSize: "12px", marginTop: "5px", textAlign: "left" }}>
                {formErrors.username}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#333",
                marginBottom: "5px",
                textAlign: "left",
              }}
            >
              Card Number:
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {formErrors.cardNumber && (
              <p style={{ color: "#34d31c", fontSize: "12px", marginTop: "5px", textAlign: "left" }}>
                {formErrors.cardNumber}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#333",
                marginBottom: "5px",
                textAlign: "left",
              }}
            >
              Expiry (MM/YY):
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {formErrors.expiryDate && (
              <p style={{ color: "#34d31c", fontSize: "12px", marginTop: "5px", textAlign: "left" }}>
                {formErrors.expiryDate}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#333",
                marginBottom: "5px",
                textAlign: "left",
              }}
            >
              CVC:
            </label>
            <input
              type="text"
              value={cvc}
              onChange={handleCvcChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {formErrors.cvc && (
              <p style={{ color: "#34d31c", fontSize: "12px", marginTop: "5px", textAlign: "left" }}>
                {formErrors.cvc}
              </p>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                color: "white",
                backgroundColor: "#2aac15",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Pay Now
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                color: "white",
                backgroundColor: "#cb5353",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
