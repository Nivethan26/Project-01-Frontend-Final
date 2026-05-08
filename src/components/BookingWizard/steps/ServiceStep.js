import React, { useState, useEffect } from 'react';

export default function ServiceStep({ state, update, goTo }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryKey = typeof state.selectedCategory === 'object'
    ? (state.selectedCategory?.key || '')
    : (state.selectedCategory || '');

  const getCategoryLabel = (cat) => {
    if (!cat) return '';
    if (typeof cat === 'object') return cat.label || '';
    if (cat === 'mechanical') return 'Mechanical Repairs';
    if (cat === 'bodywork') return 'Body Work & Painting';
    if (cat === 'periodic') return 'Periodic Maintenance';
    return cat;
  };
  const categoryLabel = getCategoryLabel(state.selectedCategory);

  useEffect(() => {
    if (!categoryKey) return;
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/Backend/api/booking-wizard/services-by-category.php?category=${categoryKey}`
        );
        const data = await res.json();
        if (data.success) {
          setServices(data.services || []);
        } else {
          setError(data.message || 'Failed to load services');
        }
      } catch (err) {
        setError('Network error loading services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [categoryKey]);

  const handleSelect = (service) => {
    update({ selectedService: service });
    goTo(2); // → Date step
  };

  return (
    <div className="bw-card">
      <h2 className="bw-step-title">Select a Service</h2>
      <p className="bw-step-subtitle">Choose from our {categoryLabel} services</p>

      {error && <div className="bw-error-alert">⚠️ {error}</div>}

      {loading ? (
        <div className="bw-service-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="bw-skeleton bw-skeleton-card" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: 32 }}>
          No services available in this category yet.
        </p>
      ) : (
        <div className="bw-service-list">
          {services.map(s => (
            <div
              key={s.id}
              className={`bw-service-card ${state.selectedService?.id === s.id ? 'selected' : ''}`}
              onClick={() => handleSelect(s)}
            >
              {s.image1 && (
                <img
                  src={s.image1.startsWith('http') ? s.image1 : `/Backend/${s.image1}`}
                  alt={s.serviceName}
                  className="bw-service-img"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="bw-service-info">
                <h4>{s.serviceName}</h4>
                <p>{(s.content1 || '').substring(0, 100)}{(s.content1 || '').length > 100 ? '...' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bw-actions">
        <button className="bw-btn-back" onClick={() => window.history.back()}>← Back</button>
        <div />
      </div>
    </div>
  );
}
