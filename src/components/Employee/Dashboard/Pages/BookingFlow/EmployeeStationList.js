import React from 'react';
import { useNavigate } from 'react-router-dom';
import BuildIcon from '@mui/icons-material/Build';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const EmployeeStationList = () => {
  const navigate = useNavigate();

  const stations = [
    { id: 1, name: 'Station 01', desc: 'Standard exterior body wash and quick dry.', duration: '30 mins', price: '800', rating: 4.8 },
    { id: 2, name: 'Station 02', desc: 'Standard exterior body wash and quick dry.', duration: '30 mins', price: '800', rating: 4.6 },
    { id: 3, name: 'Station 03', desc: 'Comprehensive exterior wash with detailed interior vacuuming and wipe down.', duration: '60 mins', price: '1500', rating: 4.7 },
    { id: 4, name: 'Station 04', desc: 'Ultimate full service: body wash, interior detail, engine bay cleaning, and wax.', duration: '90 mins', price: '3500', rating: 4.9 }
  ];

  const handleCategoryClick = (categoryKey) => {
    const labels = {
      mechanical: 'Mechanical Repairs',
      bodywork: 'Body Work & Painting',
      periodic: 'Periodic Maintenance'
    };
    navigate('/book-service', {
      state: {
        entryType: 'other',
        preSelectedCategory: {
          key: categoryKey,
          label: labels[categoryKey] || categoryKey
        }
      }
    });
  };

  return (
    <>
      <div className="emp-card emp-card-gradient" style={{ marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0', fontSize: '28px' }}>Book A Service</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Select a service station tailored to your vehicle's needs</p>
        </div>
      </div>

      <div className="station-cards-grid">
        {stations.map(station => (
          <div className="station-card" key={station.id}>
            <div className="station-card-header">
              <h3>{station.name}</h3>
              <div className="station-rating">★ {station.rating}</div>
            </div>
            <p className="station-desc">{station.desc}</p>
            <div className="station-meta">
              <div><span>Duration:</span><br/><strong>{station.duration}</strong></div>
              <div style={{ textAlign: 'right' }}><span>Starting from:</span><br/><strong>Rs. {station.price}</strong></div>
            </div>
            <button className="btn-primary" onClick={() => navigate(`/employee/bookings/station/${station.id}`)} style={{ width: '100%' }}>Book Now &rarr;</button>
          </div>
        ))}
      </div>

      {/* Other Services Section */}
      <div className="emp-card emp-card-gradient" style={{ marginTop: '40px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0', fontSize: '28px' }}>Other Services</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Professional repairs and maintenance for your vehicle</p>
        </div>
      </div>

      <div className="station-cards-grid" style={{ marginBottom: '40px' }}>
        {/* Card 1: Mechanical Repairs */}
        <div className="station-card">
          <div className="station-card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BuildIcon style={{ color: '#2563eb' }} /> Mechanical Repairs
            </h3>
          </div>
          <p className="station-desc">Engine diagnostics, general repairs, and mechanical fixes to keep your vehicle running.</p>
          <div style={{ marginTop: 'auto' }}>
            <button className="btn-primary" onClick={() => handleCategoryClick('mechanical')} style={{ width: '100%' }}>Book Now &rarr;</button>
          </div>
        </div>

        {/* Card 2: Body Work & Painting */}
        <div className="station-card">
          <div className="station-card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ColorLensIcon style={{ color: '#2563eb' }} /> Body Work & Painting
            </h3>
          </div>
          <p className="station-desc">Accident repairs, dent removal, and professional repainting for a flawless finish.</p>
          <div style={{ marginTop: 'auto' }}>
            <button className="btn-primary" onClick={() => handleCategoryClick('bodywork')} style={{ width: '100%' }}>Book Now &rarr;</button>
          </div>
        </div>

        {/* Card 3: Periodic Maintenance */}
        <div className="station-card">
          <div className="station-card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AutorenewIcon style={{ color: '#2563eb' }} /> Periodic Maintenance
            </h3>
          </div>
          <p className="station-desc">Scheduled servicing, oil changes, and routine checks to extend your vehicle's life.</p>
          <div style={{ marginTop: 'auto' }}>
            <button className="btn-primary" onClick={() => handleCategoryClick('periodic')} style={{ width: '100%' }}>Book Now &rarr;</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeStationList;
