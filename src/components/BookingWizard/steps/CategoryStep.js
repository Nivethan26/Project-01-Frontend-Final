import React, { useState, useEffect } from 'react';

export default function CategoryStep({ state, update, goTo }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/Backend/api/booking-wizard/categories.php');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setCategories([
          { key: 'washing', label: 'Washing & Detailing', icon: '🚿', description: 'Exterior wash, interior detailing & wax polishing' },
          { key: 'mechanical', label: 'Mechanical Repairs', icon: '🔧', description: 'Engine diagnostics, brake service & general repairs' },
          { key: 'bodywork', label: 'Body Work & Painting', icon: '🎨', description: 'Dent removal, scratch repair & full body painting' },
          { key: 'periodic', label: 'Periodic Maintenance', icon: '🔄', description: 'Oil change, filter replacement & scheduled servicing' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSelect = (cat) => {
    update({
      selectedCategory: cat,
      selectedService: null,
      selectedStation: null,
      selectedDate: null,
      selectedTimeslot: null,
      availabilityInfo: null,
    });
    goTo(2);
  };

  return (
    <div className="bw-card">
      <h2 className="bw-step-title">What service are you looking for?</h2>
      <p className="bw-step-subtitle">Choose a service category to get started</p>

      {loading ? (
        <div className="bw-category-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bw-skeleton" style={{ height: 160 }} />
          ))}
        </div>
      ) : (
        <div className="bw-category-grid">
          {categories.map(cat => (
            <div
              key={cat.key}
              className={`bw-category-card ${state.selectedCategory?.key === cat.key ? 'selected' : ''}`}
              onClick={() => handleSelect(cat)}
            >
              <span className="bw-category-icon">{cat.icon}</span>
              <div className="bw-category-label">{cat.label}</div>
              <div className="bw-category-desc">{cat.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
