import { toast } from 'react-toastify';
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "font-awesome/css/font-awesome.min.css";
import "./PaymentForm.css";

import LockIcon from "@mui/icons-material/Lock";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import MoneyIcon from "@mui/icons-material/Money";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BuildIcon from "@mui/icons-material/Build";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const STATION_PRICES = {
  1: { label: "Body Wash", price: 800 },
  2: { label: "Body Wash", price: 800 },
  3: { label: "Body Wash + Interior", price: 1500 },
  4: { label: "Full Service", price: 3500 },
};

const STATION_NAMES = {
  1: "Station 01",
  2: "Station 02",
  3: "Station 03",
  4: "Station 04",
};

const isValidLuhn = (value) => {
  let nCheck = 0,
    bEven = false;
  value = value.replace(/\D/g, "");
  for (let n = value.length - 1; n >= 0; n--) {
    let cDigit = value.charAt(n),
      nDigit = parseInt(cDigit, 10);
    if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
    nCheck += nDigit;
    bEven = !bEven;
  }
  return nCheck % 10 === 0 && value.length >= 13;
};

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, stationId, price } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "cash"
  const [username, setUsername] = useState(bookingData?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  
  const [formErrors, setFormErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [touched, setTouched] = useState({});
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState("");
  
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);
  const [showCvc, setShowCvc] = useState(false);

  const receiptRef = useRef(null);

  // If no state, redirect home
  if (!bookingData || !stationId) {
    return <Navigate to="/" replace />;
  }

  const stationInfo = STATION_PRICES[stationId] || { 
    label: bookingData?.serviceName || "General Service", 
    price: price !== undefined ? parseFloat(price) : 500 
  };
  const subtotal = price !== undefined ? parseFloat(price) : stationInfo.price;
  const tax = 0;
  const total = subtotal + tax;

  const validateField = (field, value) => {
    let error = "";
    let isValid = false;

    if (field === "username") {
      if (!value.trim() || value.length < 2) {
        error = "Name must be at least 2 characters";
      } else {
        isValid = true;
      }
    }

    if (field === "cardNumber") {
      const raw = value.replace(/\s/g, "");
      const isAmex = /^3[47]/.test(raw);
      const requiredLength = isAmex ? 15 : 16;
      if (raw.length !== requiredLength) {
        error = "Please enter a valid 16-digit card number";
        if (isAmex) error = "Please enter a valid 15-digit Amex number";
      } else {
        isValid = true;
      }
    }

    if (field === "expiryDate") {
      if (!value.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)) {
        error = "Invalid date";
      } else {
        const [expMonth, expYear] = value.split("/").map(Number);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear() % 100;
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          error = "Card has expired";
        } else {
          isValid = true;
        }
      }
    }

    if (field === "cvc") {
      const raw = cardNumber.replace(/\D/g, "");
      const isAmex = /^3[47]/.test(raw);
      const reqLen = isAmex ? 4 : 3;
      if (value.length !== reqLen) {
        error = `Must be ${reqLen} digits`;
      } else {
        isValid = true;
      }
    }

    return { error, isValid };
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { error, isValid } = validateField(field, value);
    
    setFormErrors((prev) => ({ ...prev, [field]: error }));
    setValidFields((prev) => ({ ...prev, [field]: isValid }));
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleUsernameChange = (e) => {
    const val = capitalizeWords(e.target.value.replace(/[^a-zA-Z\s]/g, ""));
    setUsername(val);
    if (touched.username) {
      const { error, isValid } = validateField("username", val);
      setFormErrors((prev) => ({ ...prev, username: error }));
      setValidFields((prev) => ({ ...prev, username: isValid }));
    }
  };

  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    let formatted = input;
    const isAmex = /^3[47]/.test(input);
    
    if (isAmex) {
      // Amex format: XXXX XXXXXX XXXXX
      if (input.length <= 15) {
        let parts = [];
        if (input.length > 0) parts.push(input.substring(0, 4));
        if (input.length > 4) parts.push(input.substring(4, 10));
        if (input.length > 10) parts.push(input.substring(10, 15));
        formatted = parts.join(" ");
        setCardNumber(formatted);
      }
    } else {
      if (input.length <= 16) {
        formatted = input.replace(/(.{4})/g, "$1 ").trim();
        setCardNumber(formatted);
      }
    }
    
    if (touched.cardNumber) {
      const { error, isValid } = validateField("cardNumber", formatted);
      setFormErrors((prev) => ({ ...prev, cardNumber: error }));
      setValidFields((prev) => ({ ...prev, cardNumber: isValid }));
    }
  };

  const handleExpiryDateChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 2) {
      input = input.slice(0, 2) + "/" + input.slice(2, 4);
    }
    let formatted = input;
    if (input.length <= 5) {
      setExpiryDate(formatted);
    }
    
    if (touched.expiryDate) {
      const { error, isValid } = validateField("expiryDate", formatted);
      setFormErrors((prev) => ({ ...prev, expiryDate: error }));
      setValidFields((prev) => ({ ...prev, expiryDate: isValid }));
    }
  };

  const handleCvcChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    const rawCard = cardNumber.replace(/\D/g, "");
    const isAmex = /^3[47]/.test(rawCard);
    const maxLen = isAmex ? 4 : 3;
    
    let formatted = input;
    if (input.length <= maxLen) {
      setCvc(formatted);
    }
    
    if (touched.cvc) {
      const { error, isValid } = validateField("cvc", formatted);
      setFormErrors((prev) => ({ ...prev, cvc: error }));
      setValidFields((prev) => ({ ...prev, cvc: isValid }));
    }
  };

  const validateAll = () => {
    if (paymentMethod === "cash") return true;

    const fields = [
      { name: "username", val: username },
      { name: "cardNumber", val: cardNumber },
      { name: "expiryDate", val: expiryDate },
      { name: "cvc", val: cvc },
    ];

    let allValid = true;
    let newErrors = {};
    let newValid = {};
    let newTouched = {};

    fields.forEach(({ name, val }) => {
      const { error, isValid } = validateField(name, val);
      if (!isValid) allValid = false;
      newErrors[name] = error;
      newValid[name] = isValid;
      newTouched[name] = true;
    });

    setFormErrors(newErrors);
    setValidFields(newValid);
    setTouched(newTouched);

    return allValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsProcessing(true);

    const isWizard = !!bookingData.category;
    const url = isWizard 
      ? '/Backend/api/booking-wizard/create-booking.php'
      : `/Backend/api.php?action=add_booking&station_id=${stationId}`;

    const body = isWizard ? {
      ...bookingData,
      payment_method: paymentMethod === 'card' ? 'card' : 'cash',
      payment_status: paymentMethod === 'card' ? 'paid' : 'pending_payment'
    } : {
      ...bookingData,
      station_id: stationId,
      paymentMethod: paymentMethod === 'card' ? 'card' : 'cash',
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending_payment'
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok && (data.status === "success" || data.success)) {
        setConfirmedBookingId(data.bookingId || "BKG-CONFIRMED");
        setIsProcessing(false);
        setIsSuccess(true);
      } else {
        throw new Error(data?.message || "Booking failed");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setIsProcessing(false);
      toast.error(error.message || "Unable to save booking. Please try again.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(confirmedBookingId);
    toast.success('Booking ID copied');
  };

  const getCardTypeIcon = () => {
    const raw = cardNumber.replace(/\D/g, "");
    if (raw.startsWith("4")) return "fa-cc-visa";
    if (/^5[1-5]/.test(raw) || /^2[2-7]/.test(raw)) return "fa-cc-mastercard";
    if (/^3[47]/.test(raw)) return "fa-cc-amex";
    if (/^6/.test(raw)) return "fa-cc-discover";
    return "fa-credit-card";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const isFormValid = paymentMethod === "cash" || (validFields.username && validFields.cardNumber && validFields.expiryDate && validFields.cvc);

  const handlePrint = () => {
    window.print();
  };

  if (isSuccess) {
    const formatBookingId = (id, date) => {
      const d = new Date(date);
      const dd   = String(d.getDate()).padStart(2, '0');
      const mm   = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return '#BK' + dd + mm + yyyy + id;
    };
    
    const displayId = formatBookingId(confirmedBookingId, bookingData.date);

    const handleCopy = () => {
      navigator.clipboard.writeText(displayId);
      toast.success('Booking ID copied');
    };

    const generatePDF = async () => {
      const element = receiptRef.current;
      if (!element) return;
      
      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        
        // Remove # if present for filename
        const safeId = displayId.replace('#', '');
        pdf.save(`AutoCare_Receipt_${safeId}.pdf`);
      } catch (err) {
        console.error("PDF generation failed", err);
        toast.error("Failed to generate PDF receipt.");
      }
    };

    return (
      <div className="checkout-page">
        <header className="checkout-header no-print">
          <div className="header-container">
            <h1 className="header-logo">AutoCare Lanka</h1>
          </div>
        </header>

        <div className="receipt-page-container">
          
          {/* MODERN UI (USED FOR SCREEN, PDF, AND PRINT) */}
          <div className="modern-success-wrapper" ref={receiptRef}>
            <div className="modern-success-header">
              <CheckCircleIcon sx={{ fontSize: 64, color: '#16a34a', marginBottom: '16px' }} />
              <h2 className="modern-success-title">Booking Confirmed</h2>
              <p className="modern-success-subtitle">Your service has been successfully booked</p>
              <p className="modern-success-payment-text" style={{ color: paymentMethod === 'card' ? '#166534' : '#b45309', fontWeight: 'bold', marginTop: '8px', fontSize: '15px' }}>
                {paymentMethod === 'card' 
                  ? `✅ Paid Rs. ${total.toLocaleString()} via Card` 
                  : `⏳ Pay Rs. ${total.toLocaleString()} at counter`}
              </p>
            </div>

            <div className="modern-id-highlight">
              <span className="modern-id-text">{displayId}</span>
              <button className="modern-copy-btn no-print" onClick={handleCopy} title="Copy ID" data-html2canvas-ignore="true">
                <ContentCopyIcon sx={{ fontSize: 16 }} /> Copy
              </button>
            </div>

            <div className="modern-details-grid">
              <div className="modern-section">
                <h4>Customer Info</h4>
                <div className="modern-row">
                  <span className="modern-label">Name</span>
                  <span className="modern-value">{bookingData.name}</span>
                </div>
                <div className="modern-row">
                  <span className="modern-label">Phone</span>
                  <span className="modern-value">{bookingData.phone}</span>
                </div>
              </div>

              <div className="modern-section">
                <h4>Vehicle Info</h4>
                <div className="modern-row">
                  <span className="modern-label">Model</span>
                  <span className="modern-value">{bookingData.vehicle_model || bookingData.vehicleModel || "N/A"}</span>
                </div>
                <div className="modern-row">
                  <span className="modern-label">Number</span>
                  <span className="modern-value">{bookingData.vehicle_number || bookingData.vehicleNumber || "N/A"}</span>
                </div>
              </div>

              <div className="modern-section">
                <h4>Booking Info</h4>
                <div className="modern-row">
                  <span className="modern-label">Service</span>
                  <span className="modern-value">{STATION_NAMES[stationId] || stationInfo.label || "AutoCare Service"}</span>
                </div>
                <div className="modern-row">
                  <span className="modern-label">Date</span>
                  <span className="modern-value">{bookingData.date}</span>
                </div>
                <div className="modern-row">
                  <span className="modern-label">Time</span>
                  <span className="modern-value">{bookingData.timeslot || "N/A"}</span>
                </div>
              </div>

              <div className="modern-section">
                <h4>Payment Info</h4>
                <div className="modern-row">
                  <span className="modern-label">Payment</span>
                  <span className="modern-value">
                    {paymentMethod === "card" ? "Paid via Card ✅" : "Cash on Arrival ⏳"}
                  </span>
                </div>
              </div>
            </div>

            <div className="receipt-action-buttons no-print" data-html2canvas-ignore="true">
              <button className="btn-receipt-download" onClick={generatePDF}>
                Download Receipt
              </button>
              <button className="btn-receipt-print" onClick={handlePrint}>
                Print Receipt
              </button>
              <button className="btn-receipt-ghost" onClick={() => navigate("/user/bookings")}>
                Back to Dashboard
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="header-container">
          <Link to="/" className="header-logo">AutoCare Lanka</Link>
          <div className="header-secure">
            <LockIcon fontSize="small" /> Secure Checkout
          </div>
        </div>
      </header>

      <div className="checkout-body">
        {/* Mobile Accordion Summary */}
        <div className="checkout-summary-mobile">
          <div className="mobile-summary-header" onClick={() => setShowSummaryMobile(!showSummaryMobile)}>
            <div className="mobile-amount">
              <span>Show order summary</span>
              <span className="mobile-total">Rs. {total.toLocaleString()}.00</span>
            </div>
            <div className="mobile-toggle">
              {showSummaryMobile ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </div>
          </div>
          <div className={`mobile-summary-content ${showSummaryMobile ? "open" : ""}`}>
            <div className="summary-items">
              <div className="summary-item"><LocationOnIcon fontSize="small"/> {STATION_NAMES[stationId]}</div>
              <div className="summary-item"><BuildIcon fontSize="small"/> {stationInfo.label}</div>
              <div className="summary-item"><CalendarMonthIcon fontSize="small"/> {formatDate(bookingData.date)}</div>
              <div className="summary-item"><AccessTimeIcon fontSize="small"/> {bookingData.timeslot}</div>
              <div className="summary-item"><DirectionsCarIcon fontSize="small"/> {bookingData.vehicleNumber}</div>
            </div>
          </div>
        </div>

        <div className="checkout-main-content">
          {/* Left Panel: Payment Form */}
          <div className="checkout-left-panel">
            <div className="step-indicator">
              <span className="step done">Booking Details</span>
              <span className="step active">Payment</span>
              <span className="step upcoming">Confirmation</span>
            </div>

            <div className="payment-method-cards">
              <div 
                className={`pm-card ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="pm-card-icon">
                  <CreditCardIcon />
                </div>
                <div className="pm-card-content">
                  <h4>Card Payment</h4>
                  <p>Pay securely using your debit/credit card</p>
                </div>
                <div className="pm-card-radio"></div>
              </div>

              <div 
                className={`pm-card ${paymentMethod === "cash" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cash")}
              >
                <div className="pm-card-icon">
                  <MoneyIcon />
                </div>
                <div className="pm-card-content">
                  <h4>Cash on Arrival</h4>
                  <p>Pay at the service station after service</p>
                </div>
                <div className="pm-card-radio"></div>
              </div>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
              {paymentMethod === "card" ? (
                <div className="form-fields-anim-container">
                  <div className="stripe-field-group">
                    <div className={`stripe-input-wrapper ${touched.username && formErrors.username ? "has-error" : ""} ${validFields.username ? "is-valid" : ""}`}>
                      <PersonIcon className="input-icon" />
                      <input
                        type="text"
                        id="cardholder"
                        value={username}
                        onChange={handleUsernameChange}
                        onBlur={(e) => handleBlur("username", e.target.value)}
                        placeholder=" "
                        autoComplete="cc-name"
                      />
                      <label htmlFor="cardholder">Cardholder Name</label>
                      {validFields.username && <CheckCircleIcon className="valid-check" fontSize="small" />}
                    </div>
                    {touched.username && formErrors.username && <span className="field-error-msg">{formErrors.username}</span>}
                  </div>

                  <div className="stripe-field-group">
                    <div className={`stripe-input-wrapper ${touched.cardNumber && formErrors.cardNumber ? "has-error" : ""} ${validFields.cardNumber ? "is-valid" : ""}`}>
                      <CreditCardIcon className="input-icon" />
                      <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        onBlur={(e) => handleBlur("cardNumber", e.target.value)}
                        placeholder=" "
                        maxLength={19}
                        autoComplete="cc-number"
                      />
                      <label htmlFor="cardNumber">Card Number</label>
                      <div className="card-type-icon">
                        <i className={`fa ${getCardTypeIcon()}`}></i>
                      </div>
                      {validFields.cardNumber && <CheckCircleIcon className="valid-check with-cc" fontSize="small" />}
                    </div>
                    {touched.cardNumber && formErrors.cardNumber && <span className="field-error-msg">{formErrors.cardNumber}</span>}
                  </div>

                  <div className="stripe-row">
                    <div className="stripe-field-group half-width">
                      <div className={`stripe-input-wrapper ${touched.expiryDate && formErrors.expiryDate ? "has-error" : ""} ${validFields.expiryDate ? "is-valid" : ""}`}>
                        <input
                          type="text"
                          id="expiryDate"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          onBlur={(e) => handleBlur("expiryDate", e.target.value)}
                          placeholder=" "
                          maxLength={5}
                          autoComplete="cc-exp"
                        />
                        <label htmlFor="expiryDate">MM / YY</label>
                        {validFields.expiryDate && <CheckCircleIcon className="valid-check" fontSize="small" />}
                      </div>
                      {touched.expiryDate && formErrors.expiryDate && <span className="field-error-msg">{formErrors.expiryDate}</span>}
                    </div>

                    <div className="stripe-field-group half-width">
                      <div className={`stripe-input-wrapper ${touched.cvc && formErrors.cvc ? "has-error" : ""} ${validFields.cvc ? "is-valid" : ""}`}>
                        <input
                          type={showCvc ? "text" : "password"}
                          id="cvc"
                          value={cvc}
                          onChange={handleCvcChange}
                          onBlur={(e) => handleBlur("cvc", e.target.value)}
                          placeholder=" "
                          maxLength={4}
                          autoComplete="cc-csc"
                        />
                        <label htmlFor="cvc">Security code</label>
                        <button type="button" className="toggle-cvc-btn" onClick={() => setShowCvc(!showCvc)} title="Toggle visibility">
                          {showCvc ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </button>
                        <div className="cvc-help-icon" title="3 digits on the back of your card. American Express: 4 digits on front.">?</div>
                      </div>
                      {touched.cvc && formErrors.cvc && <span className="field-error-msg">{formErrors.cvc}</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="cash-info-box fade-in">
                  <div className="cash-info-header">
                    <h3>Reserve now, pay later</h3>
                  </div>
                  <p className="cash-amount-text">You will pay at the service station after service completion.</p>
                  <ul className="cash-checklist">
                    <li><CheckCircleIcon fontSize="small" className="check-icon"/> Your slot is reserved immediately</li>
                    <li><CheckCircleIcon fontSize="small" className="check-icon"/> Bring your Booking ID (shown after confirmation)</li>
                    <li><CheckCircleIcon fontSize="small" className="check-icon"/> Arrive 10 minutes before your slot</li>
                    <li><CheckCircleIcon fontSize="small" className="check-icon"/> Pay at the reception counter</li>
                  </ul>
                </div>
              )}

              <button 
                type="submit" 
                className={`checkout-pay-btn ${isProcessing ? "processing" : ""}`} 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="btn-spinner"></div> Processing payment...
                  </>
                ) : (
                  <>
                    <LockIcon fontSize="small" /> {paymentMethod === "card" ? `Pay Rs. ${total.toLocaleString()}.00` : `Confirm Booking`}
                  </>
                )}
              </button>

              <div className="checkout-footer-security">
                <LockIcon fontSize="inherit" />
                <span>Your payment information is encrypted and Secured</span>
                <div className="mini-card-logos">
                  <i className="fa fa-cc-visa"></i>
                  <i className="fa fa-cc-mastercard"></i>
                </div>
              </div>
            </form>
          </div>

          {/* Right Panel: Order Summary */}
          <div className="checkout-right-panel">
            <div className="order-summary-sticky">
              <h3 className="summary-heading">Order Summary</h3>
              <div className="summary-divider"></div>
              
              <ul className="summary-list">
                <li>
                  <LocationOnIcon className="s-icon" />
                  <span className="s-label">{STATION_NAMES[stationId] || "AutoCare Lanka Center"}</span>
                </li>
                <li>
                  <BuildIcon className="s-icon" />
                  <span className="s-label">{stationInfo.label}</span>
                </li>
                <li>
                  <CalendarMonthIcon className="s-icon" />
                  <span className="s-label">{formatDate(bookingData.date)}</span>
                </li>
                {bookingData.timeslot && (
                  <li>
                    <AccessTimeIcon className="s-icon" />
                    <span className="s-label">{bookingData.timeslot}</span>
                  </li>
                )}
                <li>
                  <DirectionsCarIcon className="s-icon" />
                  <span className="s-label">
                    {bookingData.vehicle_model || bookingData.vehicleModel || "Vehicle"} · {bookingData.vehicle_number || bookingData.vehicleNumber}
                  </span>
                </li>
                <li>
                  <PersonIcon className="s-icon" />
                  <span className="s-label">{bookingData.name}</span>
                </li>
              </ul>

              <div className="summary-divider"></div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}.00</span>
                </div>
                <div className="price-row">
                  <span>Tax</span>
                  <span>Rs. {tax.toLocaleString()}.00</span>
                </div>
                <div className="summary-divider thick"></div>
                <div className="price-row total-row">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}.00</span>
                </div>
              </div>

              <div className="trust-badges-row">
                <div className="trust-badge"><LockIcon fontSize="inherit" /> SSL Secured</div>
                <div className="trust-badge"><SecurityIcon fontSize="inherit" /> 256-bit encryption</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="checkout-page-footer">
        © {new Date().getFullYear()} AutoCare Lanka | Privacy | Terms
      </footer>
    </div>
  );
};

export default PaymentForm;
