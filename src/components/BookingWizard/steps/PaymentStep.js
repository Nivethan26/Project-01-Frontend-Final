import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function PaymentStep({ state, update, goTo, navigate }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isWash = state.selectedCategory?.key === 'washing';

  // Unified: always step 4, back to 3, done = 5
  const backStep = 3;
  const doneStep = 5;

  const paymentOptions = [
    { key: 'cash', icon: '💵', label: 'Pay at Centre', desc: 'Cash payment on arrival', disabled: false },
    { key: 'card', icon: '💳', label: 'Online Card Payment', desc: 'Pay securely using debit/credit card online', disabled: false },
    { key: 'online', icon: '📱', label: 'Mobile Pay', desc: 'Pay via online gateway', disabled: true },
  ];

  const handleSelectPayment = (option) => {
    if (option.disabled) return;
    update({ paymentMethod: option.key });
  };

  const handleConfirm = async () => {
    if (!state.paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    // Check login
    const email = sessionStorage.getItem('email');
    if (!email) {
      sessionStorage.setItem('redirectAfterLogin', '/booking');
      toast.warning('Please login to complete your booking');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      service_id: isWash ? (state.selectedStation?.id || 0) : (state.selectedService?.id || 0),
      category: state.selectedCategory?.key,
      station_id: isWash ? state.selectedStation?.id : null,
      timeslot: isWash ? state.selectedTimeslot : null,
      date: state.selectedDate,
      name: state.customerDetails.name,
      email: state.customerDetails.email,
      phone: state.customerDetails.phone,
      vehicle_model: state.customerDetails.vehicle_model,
      vehicle_number: state.customerDetails.vehicle_number,
      payment_method: state.paymentMethod,
    };

    // If Card Payment: route to the Checkout / Payment Gateway page
    if (state.paymentMethod === 'card') {
      const price = isWash 
        ? parseFloat(state.selectedStation?.price || 0) 
        : parseFloat(state.selectedService?.price || 0);

      navigate('/checkout', {
        state: {
          bookingData: {
            ...payload,
            serviceName: isWash ? state.selectedStation?.service_type : state.selectedService?.serviceName,
            price: price
          },
          stationId: isWash ? state.selectedStation?.id : (state.selectedService?.id || 999),
          price: price
        }
      });
      return;
    }

    try {
      const res = await fetch('/Backend/api/booking-wizard/create-booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        update({ 
          bookingConfirmation: data,
          selectedDate: null,
          selectedTimeslot: null,
          availabilityInfo: null
        });
        goTo(doneStep);
      } else if (res.status === 409) {
        setError(data.message || 'This slot was just taken. Please select another.');
        toast.error('This slot was just taken. Please select another.');
        // Auto-navigate back to date/timeslot step
        setTimeout(() => goTo(2), 2000);
      } else {
        setError(data.message || 'Booking failed. Please try again.');
        toast.error(data.message || 'Booking failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="bw-card">
      <h2 className="bw-step-title">Payment & Confirmation</h2>
      <p className="bw-step-subtitle">Choose how you'd like to pay and review your booking</p>

      {error && <div className="bw-error-alert">⚠️ {error}</div>}

      <div className="bw-two-col">
        <div>
          {/* Payment Options */}
          <div className="bw-payment-options">
            {paymentOptions.map(opt => (
              <div
                key={opt.key}
                className={`bw-payment-card ${state.paymentMethod === opt.key ? 'selected' : ''} ${opt.disabled ? 'disabled' : ''}`}
                onClick={() => handleSelectPayment(opt)}
              >
                <span className="bw-payment-icon">{opt.icon}</span>
                <div className="bw-payment-info">
                  <h4>{opt.label}</h4>
                  <p>{opt.desc}</p>
                </div>
                {opt.disabled && <span className="bw-coming-soon">Coming Soon</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Full Summary */}
        <div className="bw-summary">
          <h4>Booking Summary</h4>
          {isWash && state.selectedStation && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Station</span>
              <span className="bw-summary-value">Station {state.selectedStation.station_number}</span>
            </div>
          )}
          {!isWash && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Service</span>
              <span className="bw-summary-value">{state.selectedService?.serviceName}</span>
            </div>
          )}
          <div className="bw-summary-row">
            <span className="bw-summary-label">Category</span>
            <span className="bw-summary-value">{state.selectedCategory?.label}</span>
          </div>
          <div className="bw-summary-row">
            <span className="bw-summary-label">Date</span>
            <span className="bw-summary-value">{formatDate(state.selectedDate)}</span>
          </div>
          {isWash && state.selectedTimeslot && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Time</span>
              <span className="bw-summary-value">{state.selectedTimeslot}</span>
            </div>
          )}
          <div className="bw-summary-row">
            <span className="bw-summary-label">Customer</span>
            <span className="bw-summary-value">{state.customerDetails.name}</span>
          </div>
          <div className="bw-summary-row">
            <span className="bw-summary-label">Vehicle</span>
            <span className="bw-summary-value">{state.customerDetails.vehicle_model} · {state.customerDetails.vehicle_number}</span>
          </div>
          {isWash && state.selectedStation?.price && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Price</span>
              <span className="bw-summary-value" style={{ color: '#166534', fontWeight: 700, fontSize: 16 }}>
                Rs. {parseFloat(state.selectedStation.price).toLocaleString()}
              </span>
            </div>
          )}
          {!isWash && state.selectedService?.price && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Price</span>
              <span className="bw-summary-value" style={{ color: '#166534', fontWeight: 700, fontSize: 16 }}>
                Rs. {parseFloat(state.selectedService.price).toLocaleString()}
              </span>
            </div>
          )}
          <div className="bw-summary-row">
            <span className="bw-summary-label">Payment</span>
            <span className="bw-summary-value">
              {state.paymentMethod === 'cash' ? '💵 Cash at Centre' : state.paymentMethod === 'card' ? '💳 Online Card Payment' : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="bw-actions">
        <button className="bw-btn-back" onClick={() => goTo(backStep)} disabled={submitting}>← Back</button>
        <button className="bw-btn-next" onClick={handleConfirm} disabled={submitting || !state.paymentMethod}>
          {submitting ? <><span className="bw-spinner" /> Processing...</> : 'Confirm Booking ✓'}
        </button>
      </div>
    </div>
  );
}
