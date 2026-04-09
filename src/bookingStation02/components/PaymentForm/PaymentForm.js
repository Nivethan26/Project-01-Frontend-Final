import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import "font-awesome/css/font-awesome.min.css";
import "./PaymentForm.css";

import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SecurityIcon from '@mui/icons-material/Security';

const PaymentForm = ({ closePayment }) => {
  const [username, setUsername] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

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
      errors.username = "Name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(username)) {
      errors.username = "Use only letters";
      isValid = false;
    }

    // Validate card number
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      errors.cardNumber = "Incomplete 16-digit card number";
      isValid = false;
    }

    // Validate expiry date
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) {
      errors.expiryDate = "Use MM/YY format";
      isValid = false;
    } else {
      const [expMonth, expYear] = expiryDate.split('/').map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        errors.expiryDate = "Card has expired";
        isValid = false;
      }
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

    setIsProcessing(true);

    // Simulate backend payment delay
    setTimeout(() => {
      setIsProcessing(false);
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
    }, 1500);
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
      confirmButtonColor: "#cb5353",  
      cancelButtonColor: "#3085d6",  
    }).then((result) => {
      if (result.isConfirmed) {
        // If user clicks 'Yes'
        closePayment(false);
        Swal.fire({
          title: "Cancelled!",
          text: "Your payment has been cancelled.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#2aac15",  // Green for success
        });
      }
    });
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-container">
        
        <header className="payment-header">
          <div className="payment-title-group">
            <LockIcon fontSize="medium" style={{ color: '#1e293b' }} />
            <h2>Secure Payment</h2>
          </div>
          <p className="payment-subtitle">Complete your booking securely</p>
        </header>

        <div className="trust-badge">
          <ShieldIcon fontSize="small" />
          Your payment is secure and encrypted
        </div>

        <div className="amount-display">
          <p className="amount-label">Reservation Amount</p>
          <p className="amount-value">Rs. 500.00</p>
        </div>

        <form className="payment-form" onSubmit={handleSubmit}>
          
          <div className="payment-form-group">
            <label>Cardholder Name</label>
            <div className="payment-input-wrapper">
               <span className="payment-input-icon"><PersonIcon fontSize="small" /></span>
               <input
                 type="text"
                 value={username}
                 onChange={handleUsernameChange}
                 placeholder="John Doe"
                 className={formErrors.username ? "error" : ""}
                 required
               />
            </div>
            {formErrors.username && <span className="payment-error">{formErrors.username}</span>}
          </div>

          <div className="payment-form-group">
            <label>Card Number</label>
            <div className="payment-input-wrapper">
               <span className="payment-input-icon"><CreditCardIcon fontSize="small" /></span>
               <input
                 type="text"
                 value={cardNumber}
                 onChange={handleCardNumberChange}
                 placeholder="XXXX XXXX XXXX XXXX"
                 className={formErrors.cardNumber ? "error" : ""}
                 required
               />
            </div>
            {formErrors.cardNumber && <span className="payment-error">{formErrors.cardNumber}</span>}
          </div>

          <div className="payment-form-row">
            <div className="payment-form-group">
              <label>Expiry Date</label>
              <div className="payment-input-wrapper">
                 <span className="payment-input-icon"><CalendarMonthIcon fontSize="small" /></span>
                 <input
                   type="text"
                   value={expiryDate}
                   onChange={handleExpiryDateChange}
                   placeholder="MM/YY"
                   className={formErrors.expiryDate ? "error" : ""}
                   required
                 />
              </div>
              {formErrors.expiryDate && <span className="payment-error">{formErrors.expiryDate}</span>}
            </div>

            <div className="payment-form-group">
              <label>CVC</label>
              <div className="payment-input-wrapper">
                 <span className="payment-input-icon"><SecurityIcon fontSize="small" /></span>
                 <input
                   type="password"
                   value={cvc}
                   onChange={handleCvcChange}
                   placeholder="123"
                   maxLength={3}
                   className={formErrors.cvc ? "error" : ""}
                   required
                 />
              </div>
              {formErrors.cvc && <span className="payment-error">{formErrors.cvc}</span>}
            </div>
          </div>

          <div className="payment-actions">
            <button
              type="submit"
              className="pay-button"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i> Processing Payment...
                </>
              ) : (
                <>
                  <LockIcon fontSize="small" /> Pay Now
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              className="cancel-pay-button"
              disabled={isProcessing}
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
