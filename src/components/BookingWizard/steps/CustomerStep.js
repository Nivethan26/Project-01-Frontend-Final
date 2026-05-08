import React, { useState } from 'react';

export default function CustomerStep({ state, update, goTo }) {
  const [errors, setErrors] = useState({});
  const isWash = state.selectedCategory?.key === 'washing';

  // Unified: always step 3 → back to 2, forward to 4
  const backStep = 2;
  const nextStep = 4;

  const details = state.customerDetails;

  const handleChange = (field, value) => {
    update({
      customerDetails: { ...details, [field]: value }
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!details.name.trim() || details.name.trim().length < 2) {
      errs.name = 'Full name is required (min 2 characters)';
    }
    if (!details.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!details.phone.trim() || !/^07\d{8}$/.test(details.phone.trim())) {
      errs.phone = 'Valid Sri Lankan phone (07XXXXXXXX)';
    }
    if (!details.vehicle_model.trim()) {
      errs.vehicle_model = 'Vehicle model is required';
    }
    if (!details.vehicle_number.trim()) {
      errs.vehicle_number = 'Vehicle number is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      goTo(nextStep);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="bw-card">
      <div className="bw-two-col">
        <div>
          <h2 className="bw-step-title">Your Details</h2>
          <p className="bw-step-subtitle">Please fill in your contact and vehicle information</p>

          <div className="bw-form-grid">
            <div className="bw-form-group">
              <label>Full Name *</label>
              <input
                className={`bw-form-input ${errors.name ? 'error' : ''}`}
                value={details.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Kamal Perera"
              />
              {errors.name && <span className="bw-error-text">{errors.name}</span>}
            </div>

            <div className="bw-form-group">
              <label>Email Address *</label>
              <input
                type="email"
                className={`bw-form-input ${errors.email ? 'error' : ''}`}
                value={details.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="e.g. kamal@email.com"
              />
              {errors.email && <span className="bw-error-text">{errors.email}</span>}
            </div>

            <div className="bw-form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                className={`bw-form-input ${errors.phone ? 'error' : ''}`}
                value={details.phone}
                onChange={e => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="e.g. 0771234567"
              />
              {errors.phone && <span className="bw-error-text">{errors.phone}</span>}
            </div>

            <div className="bw-form-group">
              <label>Vehicle Model *</label>
              <input
                className={`bw-form-input ${errors.vehicle_model ? 'error' : ''}`}
                value={details.vehicle_model}
                onChange={e => handleChange('vehicle_model', e.target.value)}
                placeholder="e.g. Toyota Axio"
              />
              {errors.vehicle_model && <span className="bw-error-text">{errors.vehicle_model}</span>}
            </div>

            <div className="bw-form-group full-width">
              <label>Vehicle Number *</label>
              <input
                className={`bw-form-input ${errors.vehicle_number ? 'error' : ''}`}
                value={details.vehicle_number}
                onChange={e => handleChange('vehicle_number', e.target.value.toUpperCase())}
                placeholder="e.g. CAU 1487"
                style={{ maxWidth: 280 }}
              />
              {errors.vehicle_number && <span className="bw-error-text">{errors.vehicle_number}</span>}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="bw-summary">
          <h4>Booking Summary</h4>
          {isWash && state.selectedStation && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Station</span>
              <span className="bw-summary-value">
                Station {state.selectedStation.station_number} — {state.selectedStation.service_type}
              </span>
            </div>
          )}
          {!isWash && state.selectedService && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Service</span>
              <span className="bw-summary-value">{state.selectedService.serviceName}</span>
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
          {isWash && state.selectedStation?.price && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Price</span>
              <span className="bw-summary-value" style={{ color: '#166534', fontWeight: 700 }}>
                Rs. {parseFloat(state.selectedStation.price).toLocaleString()}
              </span>
            </div>
          )}
          {isWash && state.selectedStation?.duration_minutes && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Duration</span>
              <span className="bw-summary-value">{state.selectedStation.duration_minutes} mins</span>
            </div>
          )}
        </div>
      </div>

      <div className="bw-actions">
        <button className="bw-btn-back" onClick={() => goTo(backStep)}>← Back</button>
        <button className="bw-btn-next" onClick={handleContinue}>Continue →</button>
      </div>
    </div>
  );
}
