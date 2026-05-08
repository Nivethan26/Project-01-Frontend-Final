import React, { useState, useEffect } from 'react';

export default function StationStep({ state, update, goTo }) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch('/Backend/api/booking-wizard/wash-stations.php');
        const data = await res.json();
        if (data.success) {
          setStations(data.stations || []);
        }
      } catch (err) {
        console.error('Failed to load stations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handleSelect = (station) => {
    update({ selectedStation: station, selectedDate: null, selectedTimeslot: null });
    goTo(4); // date+timeslot step
  };

  return (
    <div className="bw-card">
      <h2 className="bw-step-title">Choose a Wash Station</h2>
      <p className="bw-step-subtitle">Each station offers a different level of service</p>

      {loading ? (
        <div className="bw-station-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bw-skeleton" style={{ height: 150 }} />
          ))}
        </div>
      ) : (
        <div className="bw-station-grid">
          {stations.map(st => (
            <div
              key={st.id}
              className={`bw-station-card ${state.selectedStation?.id === st.id ? 'selected' : ''}`}
              onClick={() => handleSelect(st)}
            >
              <div className="bw-station-number">0{st.station_number}</div>
              <div className="bw-station-type">{st.service_type}</div>
              <span className="bw-duration-badge">⏱ {st.duration_minutes} min</span>
            </div>
          ))}
        </div>
      )}

      <div className="bw-actions">
        <button className="bw-btn-back" onClick={() => goTo(2)}>← Back</button>
        <div />
      </div>
    </div>
  );
}
