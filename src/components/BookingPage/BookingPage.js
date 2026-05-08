import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './BookingPage.css';

const OTHER_CATEGORIES = [
  {
    key: 'mechanical',
    icon: '🔧',
    label: 'Mechanical Repairs',
    desc: 'Engine diagnostics, brake service, suspension & general repairs',
  },
  {
    key: 'bodywork',
    icon: '🎨',
    label: 'Body Work & Painting',
    desc: 'Dent removal, scratch repair, full body painting & restoration',
  },
  {
    key: 'periodic',
    icon: '🔄',
    label: 'Periodic Maintenance',
    desc: 'Oil change, filter replacement, fluid top-ups & scheduled servicing',
  },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch('/Backend/api/booking-wizard/wash-stations.php');
        const data = await res.json();
        if (data.success) {
          setStations(data.stations || []);
        } else {
          setError('Failed to load wash stations');
        }
      } catch (err) {
        setError('Network error loading stations');
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handleWashBook = (station) => {
    const email = sessionStorage.getItem('email');
    if (!email) {
      toast.info('Please log in to book a service.');
      sessionStorage.setItem('redirectAfterLogin', '/booking');
      navigate('/login');
      return;
    }
    navigate('/book-service', {
      state: {
        entryType: 'wash',
        preSelectedStation: station,
        preSelectedCategory: { key: 'washing', label: 'Washing & Detailing' },
      },
    });
  };

  const handleOtherBook = (cat) => {
    const email = sessionStorage.getItem('email');
    if (!email) {
      toast.info('Please log in to book a service.');
      sessionStorage.setItem('redirectAfterLogin', '/booking');
      navigate('/login');
      return;
    }
    navigate('/book-service', {
      state: {
        entryType: 'other',
        preSelectedCategory: cat,
      },
    });
  };

  return (
    <div className="bp-page">
      {/* Hero Header */}
      <div className="bp-hero">
        <div className="bp-hero-overlay" />
        <div className="bp-hero-content">
          <h1>Book a Service</h1>
          <p>Choose from our wash stations or professional service categories to get started</p>
        </div>
      </div>

      <div className="bp-container">
        {/* ── Section A: Wash Stations ── */}
        <section className="bp-section">
          <div className="bp-section-header">
            <div>
              <h2>Wash & Detail Stations</h2>
              <p>Select a service station tailored to your vehicle's needs</p>
            </div>
          </div>

          {loading ? (
            <div className="bp-station-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bp-station-card bp-skeleton-card">
                  <div className="bp-skel bp-skel-badge" />
                  <div className="bp-skel bp-skel-title" />
                  <div className="bp-skel bp-skel-text" />
                  <div className="bp-skel bp-skel-btn" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bp-error">{error}</div>
          ) : (
            <div className="bp-station-grid">
              {stations.map(station => (
                <div key={station.id} className="bp-station-card">
                  <div className="bp-station-top">
                    <span className="bp-station-number">
                      Station {String(station.station_number).padStart(2, '0')}
                    </span>
                    <span className="bp-station-rating">
                      ⭐ {parseFloat(station.rating || 0).toFixed(1)}
                    </span>
                  </div>
                  <p className="bp-station-desc">{station.service_type}</p>
                  <div className="bp-station-meta">
                    <span className="bp-meta-chip duration">
                      ⏱ {station.duration_minutes} mins
                    </span>
                    <span className="bp-meta-chip price">
                      Rs. {parseFloat(station.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <button
                    className="bp-book-btn"
                    onClick={() => handleWashBook(station)}
                  >
                    Book Now <span className="bp-arrow">→</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Section B: Other Services ── */}
        <section className="bp-section">
          <div className="bp-section-header">
            <div>
              <h2>Other Services</h2>
              <p>Professional repairs and maintenance for your vehicle</p>
            </div>
          </div>

          <div className="bp-category-grid">
            {OTHER_CATEGORIES.map(cat => (
              <div key={cat.key} className="bp-category-card">
                <span className="bp-cat-icon">{cat.icon}</span>
                <h3>{cat.label}</h3>
                <p>{cat.desc}</p>
                <button
                  className="bp-book-btn outline"
                  onClick={() => handleOtherBook(cat)}
                >
                  Book Now <span className="bp-arrow">→</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
