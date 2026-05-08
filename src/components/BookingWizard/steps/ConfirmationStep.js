import React from 'react';

export default function ConfirmationStep({ state, resetWizard, navigate }) {
  const isWash = state.selectedCategory?.key === 'washing';
  const bookingId = state.bookingConfirmation?.bookingId;

  const bookingDate = state.selectedDate || state.bookingConfirmation?.date || null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date not available";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Booking reference format: ACL-0042
  const getBookingRef = () => {
    if (!bookingId) return 'ACL-0000';
    return state.bookingConfirmation?.booking_reference || `ACL-${String(bookingId).padStart(4, '0')}`;
  };

  // Generate Google Calendar link
  const getCalendarLink = () => {
    const title = encodeURIComponent(
      isWash
        ? `AutoCare Lanka - Station ${state.selectedStation?.station_number} Wash`
        : `AutoCare Lanka - ${state.selectedService?.serviceName || 'Service'}`
    );
    const dateStr = state.selectedDate?.replace(/-/g, '') || '';
    let startTime = '090000';
    let endTime = '100000';

    if (isWash && state.selectedTimeslot) {
      const parts = state.selectedTimeslot.split('-');
      const convertTo24 = (t) => {
        const match = t.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
        if (!match) return '090000';
        let h = parseInt(match[1]);
        const m = match[2];
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return String(h).padStart(2, '0') + m + '00';
      };
      startTime = convertTo24(parts[0]);
      endTime = convertTo24(parts[1]);
    }

    const start = `${dateStr}T${startTime}`;
    const end = `${dateStr}T${endTime}`;
    const details = encodeURIComponent(
      `Booking Ref: ${getBookingRef()}\nVehicle: ${state.customerDetails.vehicle_model} (${state.customerDetails.vehicle_number})`
    );
    const location = encodeURIComponent('AutoCare Lanka, 66 Attidiya Road, Rathmalana');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  return (
    <div className="bw-card">
      <div className="bw-confirm-page">
        {/* Animated checkmark */}
        <div className="bw-checkmark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="bw-confirm-title">Booking Confirmed!</h2>
        <p className="bw-confirm-subtitle">Your service has been successfully booked</p>

        <div className="bw-booking-ref">{getBookingRef()}</div>

        {/* Summary */}
        <div className="bw-summary" style={{ textAlign: 'left', maxWidth: 480, margin: '0 auto 24px' }}>
          <h4>Booking Details</h4>
          {isWash && state.selectedStation && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Station</span>
              <span className="bw-summary-value">Station {state.selectedStation.station_number} — {state.selectedStation.service_type}</span>
            </div>
          )}
          {!isWash && state.selectedService && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Service</span>
              <span className="bw-summary-value">{state.selectedService.serviceName}</span>
            </div>
          )}
          <div className="bw-summary-row">
            <span className="bw-summary-label">Date</span>
            <span className="bw-summary-value">{formatDate(bookingDate)}</span>
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
            <span className="bw-summary-label">Email</span>
            <span className="bw-summary-value">{state.customerDetails.email}</span>
          </div>
          <div className="bw-summary-row">
            <span className="bw-summary-label">Phone</span>
            <span className="bw-summary-value">{state.customerDetails.phone}</span>
          </div>
          <div className="bw-summary-row">
            <span className="bw-summary-label">Vehicle</span>
            <span className="bw-summary-value">{state.customerDetails.vehicle_model} · {state.customerDetails.vehicle_number}</span>
          </div>
          {isWash && state.selectedStation?.price && (
            <div className="bw-summary-row">
              <span className="bw-summary-label">Price</span>
              <span className="bw-summary-value" style={{ color: '#166534', fontWeight: 700 }}>
                Rs. {parseFloat(state.selectedStation.price).toLocaleString()}
              </span>
            </div>
          )}
          <div className="bw-summary-row">
            <span className="bw-summary-label">Payment</span>
            <span className="bw-summary-value">
              {state.paymentMethod === 'cash' ? '💵 Cash at Centre' : '💳 Card at Centre'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bw-confirm-actions">
          <a
            href={getCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bw-btn-next"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            📅 Add to Google Calendar
          </a>
          <button className="bw-btn-next" onClick={() => navigate('/User/bookings')}>
            📋 View My Bookings
          </button>
          <button className="bw-btn-ghost" onClick={resetWizard}>
            Book Another Service
          </button>
          <button className="bw-btn-ghost" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
