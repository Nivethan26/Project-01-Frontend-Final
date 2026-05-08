import React from 'react';

export default function WashConfirmStep({ state, update, goTo, navigate }) {
  const station = state.selectedStation;

  if (!station) {
    return (
      <div className="bw-card" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ color: '#64748b', fontSize: 15, marginBottom: 16 }}>
          No station selected. Please go back and choose a station.
        </p>
        <button className="bw-btn-next" onClick={() => navigate('/booking')}>
          ← Back to Stations
        </button>
      </div>
    );
  }

  return (
    <div className="bw-card">
      <h2 className="bw-step-title">Service Confirmation</h2>
      <p className="bw-step-subtitle">Review your selected wash station</p>

      {/* Station Confirmation Card */}
      <div className="bw-wash-confirm-card">
        <div className="bw-wc-header">
          <span className="bw-wc-station-num">
            Station {String(station.station_number).padStart(2, '0')}
          </span>
          <span className="bw-wc-rating">⭐ {parseFloat(station.rating || 0).toFixed(1)}</span>
        </div>

        <h3 className="bw-wc-service-type">{station.service_type}</h3>

        <div className="bw-wc-details">
          <div className="bw-wc-detail">
            <span className="bw-wc-detail-icon">⏱</span>
            <div>
              <span className="bw-wc-detail-label">Duration</span>
              <span className="bw-wc-detail-value">{station.duration_minutes} minutes</span>
            </div>
          </div>
          <div className="bw-wc-detail">
            <span className="bw-wc-detail-icon">💰</span>
            <div>
              <span className="bw-wc-detail-label">Price</span>
              <span className="bw-wc-detail-value">Rs. {parseFloat(station.price || 0).toLocaleString()}</span>
            </div>
          </div>
          <div className="bw-wc-detail">
            <span className="bw-wc-detail-icon">🕐</span>
            <div>
              <span className="bw-wc-detail-label">Operating Hours</span>
              <span className="bw-wc-detail-value">
                {station.operating_start?.slice(0, 5)} – {station.operating_end?.slice(0, 5)}
              </span>
            </div>
          </div>
        </div>

        <div className="bw-wc-includes">
          <h4>What's Included</h4>
          <ul>
            {station.station_number <= 2 && (
              <>
                <li>Exterior body wash with foam cannon</li>
                <li>Wheel & tire cleaning</li>
                <li>Quick dry & hand finish</li>
              </>
            )}
            {station.station_number === 3 && (
              <>
                <li>Comprehensive exterior body wash</li>
                <li>Interior vacuuming & wipe down</li>
                <li>Dashboard & console cleaning</li>
                <li>Window cleaning (inside & out)</li>
              </>
            )}
            {station.station_number >= 4 && (
              <>
                <li>Full exterior body wash & polish</li>
                <li>Complete interior detail & shampoo</li>
                <li>Engine bay cleaning</li>
                <li>Premium wax coating</li>
                <li>Tire shine & dressing</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="bw-actions">
        <button className="bw-btn-back" onClick={() => navigate('/booking')}>
          ← Back to Stations
        </button>
        <button className="bw-btn-next" onClick={() => goTo(2)}>
          Continue to Schedule →
        </button>
      </div>
    </div>
  );
}
